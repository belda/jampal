var data = {
    name : "My test Song",
    signatureA : 4,
    signatureB : 4,
    tempo: 120,
    parts : [
        {name : "Sloka",
         notes: "My note very very long note, that I want to put here so that we do not forget about it",
         rounds: [
             {
                 repeat: 3,
                 notes: "Slow antre",
                 chords: [
                     { root : "C", leng : 1 },
                     { root : "D", leng : 1 },
                     { root : "Am", chord : "m", leng : 1 },
                     { root : "G", leng : 1 }
                 ]
             },
             {
                 repeat: 1,
                 chords: [
                     { root : "C", leng : 1 },
                     { root : "D", leng : 1 },
                     { root : "Am", chord : "m", leng : 1 },
                     { root : "F", leng : 1, notes: "pauza na konci" }
                 ]
             },
             {
                 repeat: 3,
                 notes: "Slow antre",
                 chords: [
                     { root : "C", leng : 1 },
                     { root : "D", leng : 1 },
                     { root : "Am", chord : "m", leng : 1 },
                     { root : "G", leng : 1 }
                 ]
             },

         ]},
        {name : "Refren",
         rounds: [
             {
                 repeat: 2,
                 chords: [
                     { root : "Am", chord : "m", leng : 2 },
                     { root : "F", leng : 2 }
                 ]
             }
         ]},
        {name : "Bridge",
         color: "#aaffff",
         rounds: [
             {
                 repeat: 2,
                 chords: [
                     { root : "Am", chord : "m", leng : 2 },
                     { root : "F", leng : 2 }
                 ]
             }
         ]}
    ]
}