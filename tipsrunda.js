function kostnad(startRad, A, B) {
    let rows = [Array.from(startRad), []];
    let a = 0, b = 1;
    
    for (i = 0; i < B.length; i++) {
        // Levenshtein matrix distance calculation by iterative row swapping, check https://en.wikipedia.org/wiki/Levenshtein_distance for reference

        rows[b][0] = i + 1
        for (j = 0; j < startRad.length; j++) {
            let tabortKostnad = (j+1 in rows[a] ? rows[a][j+1] : j ) +1;
            let läggtillKostnad = rows[b][j]+1;
            let ersättningsKostnad = rows[a][j] + (A[i] == B[j] ? 0 : 1)
            // console.log(tabortKostnad, läggtillKostnad, ersättningsKostnad)
            rows[b][j + 1] = Math.min(tabortKostnad, läggtillKostnad, ersättningsKostnad)
            // console.log(rows[b][j+1])
        }
        [a, b] = [b, a];
    }
    return rows[a].slice(-1)[0]
}

function hittaTips(kommandoMatris, handlingar) {
    const startRad = kommandoMatris.map((_, i) => i)
    const möjligaAlternativ = [];
    for (h of handlingar) {
        for (p of h.triggervarningar) {
            let kostnaden = kostnad(startRad, kommandoMatris, p)
            if(kostnaden <= Math.sqrt(Math.max(startRad.length, p.length))) {
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
        const kommando = meddelande.content.toLocaleLowerCase().normalize().split(" ")[0]
        const kommandoMatris = [...kommando]
        if (kommandoMatris.length > 0) {
            tips = hittaTips(kommandoMatris, handlingar);
            if(tips) {
                meddelande.reply(
                    [
                        `did you mean '${tips}'?`,
                        `menade du '${tips}'?`,
                        `Имаш предвид '${tips}' за да преведа?`,
                    ][Math.floor(Math.random()*3)]
                );
            }
        }
    }
}