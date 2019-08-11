




function initJamPal() {
    console.log("Initializing jampal");
    console.log("data=", data);

    for (var di in data.parts) {
        var d = data.parts[di];
        console.log("Working on "+d.name);
        var partbox = $("<div class='part'><span class='name'>"+d.name+"</span></div>");
        $("#jampal .parts").append(partbox);
        var chordspart = $("<div class='part'/>");
        for (var ri in d.rounds) {
            var r = d.rounds[ri];
            var round = $("<div class='round'/>");
            if (r.repeat == 1)
                round.append( $("<span class='chbox_outer'><span class='chbox repeat repeat1'><span class='u'>&nbsp;</span></span></span>") );
            else
                round.append( $("<span class='chbox_outer'><span class='chbox repeat repeatn'><span class='u'>"+r.repeat+"x</span></span></span>") );
            chordspart.append(round);
            for (var chi in r.chords) {
                var ch = r.chords[chi];
                var chbox = $("<span class='chbox_outer'><span class='chbox chord len"+ch.leng+"'><span class='u'>"+ch.ch+"</span></span></span>");
                round.append(chbox)
            }
        }
        $("#jampal .chords").append(chordspart);
    }

}