// These pieces of code were definetely not borrowed from the internet
/**   
 * Maths n stuff
 *      _---~~(~~-_.
     _{        )   )
   ,   ) -~~- ( ,-' )_
  (  `-,_..`., )-- '_,)
 ( ` _)  (  -~( -_ `,  }
 (_-  _  ~_-~~~~`,  ,' )
   `~ -^(    __;-,((()))
         ~~~~ {_ -_(())
                `\  }
                  { }

*/
/**
 * Create a seeded random generator function based on the mulberry 32 algorythm
 * @param {number} a
 * @returns seeded random generator function
 */
function mulberry32(a) {
  return function () {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate a number hashcode based on ze passed in string ya feel me ?
 * @param {string} s
 * @returns hashcode of the string
 */
function getHashCode(s) {
  var hash = 0,
    i,
    chr;
  if (s.length === 0) return hash;
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

function createSeededGenerator(seed) {
  const hashCode = getHashCode(seed.replace(" ", ""));
  return mulberry32(hashCode);
}

module.exports = {
  createSeededGenerator
};
