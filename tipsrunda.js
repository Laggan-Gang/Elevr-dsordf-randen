function kostnad(rawA, rawB) {
    // let A, B;
    if(rawA.length < rawB.length) {
        [B, A] = [rawA, rawB]
    } else {
        [A, B] = [rawA, rawB]
    }

    let matris = "☭".repeat(A.length).split("☭").map(() => "☭".repeat(B.length).split("☭").fill(0))
    maxdist = A.length + B.length
    matris[-1] = [];
    matris[-1][-1] = maxdist;
    for(let i = 0; i <= A.length; i++) { matris[i][0] = i; matris[i][-1] = maxdist; }
    for(let j = 0; j <= B.length; j++) { matris[0][j] = j; matris[-1][j] = maxdist; }

    da = [];

    for (let i = 1; i <= A.length; i++) {
        // Damerau–Levenshtein_distance matrix distance calculation, check https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance for reference

        let db = 0;
        for (j = 1; j < B.length+1; j++) {
            let k = da[B[j]] || 0
            let delta = db;
            let cost = 1;
            if(A[i-1] == B[j-1]) {
                cost = 0;
                db = j;
            }
            const substitution = matris[i-1][j-1] + cost
            const insertion = matris[i][j-1] + 1
            const  deletion = matris[i-1][j] + 1
            const  transposition = matris[k-1][delta-1] + (i-k-1) + 1 + (j-delta-1) 
            // console.log(i, j, A[i], B[j], substitution, insertion, deletion, transposition)
            matris[i][j] = Math.min(
                substitution,
                insertion,
                deletion,
                transposition,
            )

            da[A[i]] = i
        }
    }
    return matris[A.length][B.length]
}


const bannadeKommandon = ["!dota"]

function hittaTips(kommandoMatris, handlingar) {
    const möjligaAlternativ = [];
    if(bannadeKommandon.includes(kommandoMatris.join(""))) {
        return false;
    }
    for (h of handlingar) {
        for (p of h.triggervarningar) {
            let kostnaden = kostnad(kommandoMatris, p)
            let tillåtenKostnad = Math.sqrt(Math.min(kommandoMatris.length, p.length)-1);
            let kekkostnad = [0,1].includes(p.join("").indexOf(kommandoMatris.join(""))) ? Math.abs(kommandoMatris.length-p.length) : 0
            console.log(kommandoMatris.join(""), p.join(""), p.join("").indexOf(kommandoMatris.join("")), kostnaden, tillåtenKostnad, kekkostnad)
            if(kostnaden <= Math.max(tillåtenKostnad, kekkostnad)) {
                möjligaAlternativ.push([p, kostnaden])
            }
        }
    }
    möjligaAlternativ.sort((a,b) => a[1] > b[1] ? 1 : -1)
    const bästaAlternativ = möjligaAlternativ.filter(i => i[1] == möjligaAlternativ[0][1])
    if(bästaAlternativ.length > 0) {
        return bästaAlternativ[Math.floor(Math.random() * bästaAlternativ.length)][0].join("")
    }
    return false
}

module.exports = {
    kostnad,
    hittaTips,
    tipsrunda: function(handlingar, meddelande, aleaIactaEst) {
        if(meddelande.content.toLocaleLowerCase().normalize().length > 30)
            return;
        const kommando = meddelande.content.toLocaleLowerCase().normalize().split(" ")[0]
        // console.log(kommando)
        const kommandoMatris = [...kommando]
        if (kommandoMatris.length > 0) {
            tips = hittaTips(kommandoMatris, handlingar);
            if(tips) {
                meddelande.reply(
                    [
                        `did you mean '${tips}'?`,
                        `menade du '${tips}'?`,
                        `Имаш предвид '${tips}' за да преведа?`,
                        `tarkoittko '${tips}'?`,
                        `あなたは「${tips}」を意味しましたか？`,
                    ][Math.floor(Math.random()*5)]
                );
            }
        }
    }
}