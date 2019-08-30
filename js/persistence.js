
function collectData() {
    data.name = $("#jampal input[name=songname]").val();
    data.signatureA = $("#jampal input[name=signatureA]").val();
    data.signatureB = $("#jampal input[name=signatureB]").val();
    data.tempo = $("#jampal input[name=tempo]").val();
    data.parts = [];
    $(".part").each(function(){
        // console.log(p);
        var p = $(this);
        var prt = {
            'name' : p.data('name'),
            'rounds' : []
        };
        if (p.data('color') !== undefined)
            prt.color = p.data('color');
        if (p.data('notes') !== undefined)
            prt.notes = p.data('notes');
        p.find(".round").not('.empty').each(function(){
            var r = $(this);
            var rnd = { repeat : r.data('repeat'), chords : []};
            r.find(".chord").each(function(){
                var ch = $(this);
                var chrd = {};
                chrd.root = ch.data('root');
                chrd.leng = ((ch.data('len') !== undefined )) ?  ch.data('len') : 1;
                if (ch.data('sharp') !== undefined ) chrd.sharp =  ch.data('sharp');
                if (ch.data('chord') !== undefined ) chrd.chord =  ch.data('chord');
                rnd.chords.push(chrd);
            });
            prt.rounds.push(rnd);
        });
        data.parts.push(prt);
    });
    return data;
}

function newSong() {
    data = {
        name : "New Song",
        signatureA : 4,
        signatureB : 4,
        tempo: 120,
        parts : []
    };
}