var data = {
    name : "My test Song",
    signatureA : 4,
    signatureB : 4,
    tempo: 120,
    parts : [
        {name : "Sloka",
         rounds: [
             {
                 repeat: 3,
                 notes: "Slow antre",
                 chords: [
                     { ch : "C", leng : 1 },
                     { ch : "D", leng : 1 },
                     { ch : "Am", leng : 1 },
                     { ch : "G", leng : 1 }
                 ]
             },
             {
                 repeat: 1,
                 chords: [
                     { ch : "C", leng : 1 },
                     { ch : "D", leng : 1 },
                     { ch : "Am", leng : 1 },
                     { ch : "F", leng : 1, notes: "pauza na konci" }
                 ]
             },
             {
                 repeat: 3,
                 notes: "Slow antre",
                 chords: [
                     { ch : "C", leng : 1 },
                     { ch : "D", leng : 1 },
                     { ch : "Am", leng : 1 },
                     { ch : "G", leng : 1 }
                 ]
             },

         ]},
        {name : "Refren",
         rounds: [
             {
                 repeat: 2,
                 chords: [
                     { ch : "Am", leng : 2 },
                     { ch : "F", leng : 2 }
                 ]
             }
         ]}
    ]
}