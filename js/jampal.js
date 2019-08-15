var CHORDCHARS = "CDEFGAH";
var MODIFIERCHARS = "sm37#2";

function initChordLengthStyles() {
    var x = '';
    for (var i =1; i<33; i++ ) {
        x+= "#jampal .part_chords .chbox.len"+i+" { width: "+(i*7)+"vw; }\n";
        x+= "#jampal.small1 .part_chords .chbox.len"+i+" { width: "+(i*6)+"vw; }\n";
        x+= "#jampal.small2 .part_chords .chbox.len"+i+" { width: "+(i*5)+"vw; }\n";
        x+= "#jampal.small3 .part_chords .chbox.len"+i+" { width: "+(i*5)+"vw; }\n";
        x+= "#jampal.small4 .part_chords .chbox.len"+i+" { width: "+(i*4)+"vw; }\n";
    }
    $("<style>").prop("type", "text/css").html(x).appendTo("head");
}



function initJamPal() {
    console.log("Initializing jampal");
    console.log("Subloading css");
    initChordLengthStyles();
    console.log("Configuring hk")
    initControls();
    console.log("data=", data);

    $("#jampal input[name=songname]").val(data.name);
    $("#jampal input[name=signatureA]").val(data.signatureA);
    $("#jampal input[name=signatureB]").val(data.signatureB);
    $("#jampal input[name=tempo]").val(data.tempo);
    for (var di in data.parts) {
        var d = data.parts[di];
        console.log("Working on "+d.name);
        var partbox = getPartBox(d);
        var chordspart = partbox.find(".part_chords");
        for (var ri= d.rounds.length-1; ri>=0; ri--) {
            var r = d.rounds[ri];
            var round = $("<div data-repeat='"+r.repeat+"' class='round'/>");
            if (r.repeat == 1)
                round.append( $("<span class='chbox_outer'><span class='chbox repeat repeat1'><span class='u'>&nbsp;</span></span></span>") );
            else
                round.append( $("<span class='chbox_outer'><span class='chbox repeat repeatn'><span class='u'>"+r.repeat+"x</span></span></span>") );
            for (var chi in r.chords) {
                var ch = r.chords[chi];
                round.append(getChordBox(ch));
            }
            chordspart.prepend(round);
        }

        $("#jampal .thediv").append(partbox);
    }
    // $("#jampal .thediv").sortable({itemSelector: ".part_outer"});

    $("#noteedit").keyup(syncNote);
    $("#noteModal").on('shown.bs.modal', function (e) {
      $("#noteedit").focus();
    });
    // $("#noteModal").on('hidden.bs.modal', syncNote);
}

function getPartBox(partdata=null){
    var clr = "#ffffff";
    var name = partdata!=null ? partdata.name : "-Part-";
    if (partdata!=null && partdata.color !== undefined) clr = partdata.color;
    var partbox = $("<div class='part' data-name='"+name+"' data-color='"+clr+"'><div class='partname'><span class='name'>"+name+"</span><input type='text' value='"+name+"'/></div></div>");
    partbox.find(".partname .name").click( function(){editPartname($(this))} );
    var inp = partbox.find(".partname input");
    inp.hide();
    inp.focusout(function() { finishPartNameEdit($(".part.active")); });
    inp.bind('keyup', 'return esc tab ctrl+right', function(){ finishPartNameEdit($(".part.active")); });
    inp.bind('keydown', 'right', function(){
        if ($(this).prop('selectionStart') == $(this).val().length)
            finishPartNameEdit($(".part.active"));
    });
    partbox.click(function(){
        if (!$(this).hasClass("chbox"))
            partSelect($(this));
    });

    var chordspart = $("<div class='part_chords'/>");
    var chboxempty = $("<span class='chbox empty'><span class='u'>+</span></span>");
    chboxempty.click(function(){ chboxSelect($(this)) });
    var wrap = $("<div class='round empty'/>").append( $("<span class='chbox_outer'>").append(chboxempty) );
    chordspart.append(wrap);
    partbox.append(chordspart);
    if (partdata!=null && partdata.notes !== undefined)  partbox.append(getNotesBox(partdata.notes));

    var colorp = $("<input class='colorpicker' type='color' data-show-alpha='true'  value='"+clr+"'/>");
    colorp.change(function(){
        $(this).parent().data('color', $(this).val() );
        $(this).parent().parent().css("background-color",hexToRgbA($(this).val(), .4));
        $(this).blur();
    });
    partbox.append(colorp);
    return $("<div class='part_outer' style='background-color: "+hexToRgbA(clr, .4)+"'/>").append(partbox);
}
function getChordBox(ch) { //takes the selected chord data
    if (ch == null) {
        var chbox = $("<span class='chbox chord blank len1' data-len='1'><span class='u'>&nbsp;</span></span>");
    } else {
        var chbox = $("<span class='chbox chord len"+ch.leng+"' data-len='"+ch.leng+"'><span class='u'>"+ch.ch+"</span></span>");
    }
    chbox.click(function(){ chboxSelect($(this)) });
    return $("<span class='chbox_outer'>").append(chbox);
}

function addEmptyRound() {
    var round = $("<div data-repeat='1' class='round'/>");
    round.append( $("<span class='chbox_outer'><span class='chbox repeat repeat1'><span class='u'>&nbsp;</span></span></span>") );
    var activateAfter;
    for (var i=0; i< data.signatureB; i++) {
        var chb = getChordBox(null);
        if (i==0) activateAfter = chb;
        round.append(chb);
    }
    round.insertBefore($(".chbox.empty.active").parent().parent());
    setTimeout(function(){chboxSelect(activateAfter.children().first());}, 100);
    sizeRedraw();
}

function addPart() {
    var ap = $(".part.active");
    if (ap.length == 0) {
        var ap = $(".part").last();
    }
    var newpart = getPartBox();
    newpart.insertAfter(ap.parent());
    partSelect(newpart);
    $("#jampal .chbox, #jampal .round").removeClass("active");
    newpart.find(".chbox.empty").addClass("active");
    addEmptyRound();
    sizeRedraw();
    setTimeout(function(){horizontalSelect(-1);}, 100);
}

function getNotesBox(notes) {
    var notebox = $("<div class='notes'><div class='text'>"+notes+"</div></div>");
    return notebox;
}

function changeRepetitions(step) {
    var ra = $(".round.active");
    var newval = ra.data("repeat")+step < 0 ? 1 : ra.data("repeat")+step;
    ra.data("repeat", newval);
    ra.find(".repeat").removeClass("repeat1");
    ra.find(".repeat").removeClass("repeatn");
    if (newval <= 1) {
        ra.find(".repeat .u").html("&nbsp;");
        ra.addClass("repeat1");
    } else {
        ra.find(".repeat .u").html(newval+"x");
        ra.addClass("repeatn");
    }
}

function changeChordLength(step) {
    var ra = $(".chbox.chord.active");
    var newval = ra.data("len")+step < 0 ? 1 : ra.data("len")+step;
    ra.data("len", newval);
    for (var i=1; i< 33;i++) ra.removeClass("len"+i);
    ra.addClass("len"+newval);
    var rl = getRoundLength(ra.parents(".round"));
    if (rl < data.signatureB) {
        ra.parents(".round").append(getChordBox(null));
    } else if (rl > data.signatureB) { //if its bigger just remove the following empty ones
        for (var i=0; i<rl-data.signatureB; i++) {
            ra.parents(".round").find(".chbox.chord.blank").last().remove();
        }
    }
}

function getRoundLength(round) {
    var l = 0;
    round.find(".chbox.chord").each(function(){ l+=$(this).data("len") });
    return l;
}
function isRoundBlank(round) {
    var l = 0;
    round.find(".chbox.chord.blank").each(function(){ l+=$(this).data("len") });
    return l==data.signatureB;
}

function chboxSelect(chbox) {
    console.log("selected ", chbox);
    if (chbox.hasClass('active')) {
        $("#jampal .chbox, #jampal .round").removeClass("active")
    } else {
        $("#jampal .chbox, #jampal .round").removeClass("active")
        chbox.addClass("active");
        chbox.parents(".round").addClass("active");
    }
    $(".part.active").removeClass("active");
    var part = chbox.parent().parent().parent().parent();
    console.log("is this the right part ", part);
    part.addClass("active");
}

function partSelect(part) {
    console.log("selected ", part);
    $("#jampal .part").removeClass("active")
    part.addClass("active");
}

function editPartname(part) {
    console.log("Edit partname ",part);
    if (part.hasClass("name") && ! part.hasClass("part"))   { //its the bloody span inside
        part = part.parent().parent();
        partSelect(part);
    }
    part.find(".partname input").show();
    part.find(".partname .name").hide();
    part.find(".partname input").focus().ready(function(){ part.find(".partname input").select(); });
}
function finishPartNameEdit(part) {
    console.log(part);
    var i = part.find(".partname input");
    part.data("name", i.val());
    part.find(".partname .name").html(i.val());
    i.hide();
    part.find(".partname .name").show();
    $(document).focus();
}
function duplicatePart(){
    var ap = $(".part.active");
    if (ap.length==1) {
        var np = ap.parent().clone(true, true);
        np.insertAfter(ap.parent());
        partSelect(np.children().first());
    }
    sizeRedraw();
}


function horizontalSelect(step) {
    console.log("horizontalSelect ", step);
    var active = $(".chbox.active");
    if (active.length == 0) {
        var activePart = $("#jampal .part.active");
        if (activePart.length == 0) {
            activePart = $("#jampal .part").first();
            partSelect(activePart);
        }
        var next = activePart.find(".chbox.chord, .chbox.empty").first();
        chboxSelect(next);
    } else {
        var all = $(".chbox.active").parent().parent().parent().find(".chbox.chord, .chbox.empty");
        if (all.index(active)+step < 0) {
            console.log("Edit partname");
            $("#jampal .chbox, #jampal .round").removeClass("active");
            editPartname(active.parent().parent().parent().parent());
        } else if (all.index(active)+step < all.length) {
            var next = all.eq(all.index(active) + step);
            chboxSelect(next);
        }
    }
}

function verticalSelect(step) {
    console.log("verticalSelect ", step);
    var active = $("#jampal .part.active");
    if (active.length == 0) {
        partSelect($("#jampal .part").first());
    } else {
        var all = $("#jampal .part");
        if (all.index(active)+step < all.length) {
            $("#jampal .chbox, #jampal .round").removeClass("active")
            var next = all.eq(all.index(active) + step);
            partSelect(next);
        }
    }
}

function verticalMove(step) {
    if (step<=0) step-= 1;
    var active = $("#jampal .part.active");
    var all = $("#jampal .part");
    if (all.index(active)+step < 0) {
        active.parent().parent().prepend(active.parent());
    } else if (all.index(active)+step < all.length) {
        all.eq(all.index(active)+step ).parent().after(active.parent());
    }
}

function deleteChord(chord, n=0) {
    var rl = getRoundLength(chord.parents(".round"));
    if (rl-chord.data("len") < data.signatureB) {
        var nc = getChordBox(null);
        nc.insertAfter(chord.parent());
    }
    horizontalSelect(2);
    chord.remove();
}

function genericDelete(){
    var ac = $(".chbox.chord.active");
    if (ac.length == 1) {
        if (isRoundBlank(ac.parents(".round")) )
            ac.parents(".round").remove();
        else
            deleteChord(ac);
    } else {
        var ac = $(".part.active");
        if (ac.length == 1 && confirm("Are you sure you want to remove whole part "+ac.data('name')+"?")) {
            ac.remove();
        }
    }
    sizeRedraw();
}


function setChord(ch) {
    if ($(".chbox.empty.active").length==1)  addEmptyRound();

    if (CHORDCHARS.indexOf(ch.toUpperCase()) >=0 ) {
        var ac = $(".chbox.chord.active");
        ac.find(".u").html(ch.toUpperCase());
        ac.removeClass("blank");
    }
    if (MODIFIERCHARS.indexOf(ch.toLowerCase()) >=0 ) {
        var ac = $(".chbox.chord.active");
        if (ac.length == 1) {
            var curr = ac.find(".u").html();
            if (curr.indexOf(ch)>0) {
                curr = curr.replace(ch, "");
            } else {
                curr+= ch;
            }
            ac.find(".u").html(curr);
        }
    }
}

function sizeRedraw(step=0) { //checks if we need to resize
    if (step==0)
        for (var i=0; i<6; i++) $("#jampal").removeClass("small"+i);
    if (step>6) return;
    var partstotal = 0;
    $("#jampal .part").each(function(){ partstotal+= $(this).height(); });
    if (partstotal +60 > $(".thediv").first().height()) {
        $("#jampal").addClass("small"+(step+1));
        sizeRedraw(step+1);
    }
}

function editPartNote(part) {
    console.log("Edit partnote ",part);
    if (part.hasClass("name") && ! part.hasClass("part"))   { //its the bloody span inside
        part = part.parent().parent();
        partSelect(part);
    }
    if ($(".part.active .notes .text").length != 0) {
        $("#noteedit").val( $(".part.active .notes .text").html() );
    }
    $('#noteModal').modal('toggle');
}
function syncNote() {
    if ($(".part.active").length == 0) {
        console.warn("No part active");
    } else {
        var noteval = $("#noteedit").val();
        if (noteval.length == 0) {
            $(".part.active .notes").remove();
        } else {
            var ap = $(".part.active .notes .text");
            if (ap.length == 0) {
                $(".part.active").append(getNotesBox(noteval));
            } else {
                ap.html(noteval);
            }
        }
    }
}

/********* KEYBOARD CONTROL ****************/
function initControls() {
    // $.hotkeys.options.filterInputAcceptingElements = false;
    // $.hotkeys.options.filterContentEditable = false;

    $(document).bind('keydown', 'up', function(){ verticalSelect(-1) });
    $(document).bind('keydown', 'down', function(){ verticalSelect(+1) });
    $(document).bind('keydown', 'right', function(){ horizontalSelect(+1) });
    $(document).bind('keydown', 'left', function(){ horizontalSelect(-1) });
    $(document).bind('keydown', 'ctrl+right', function(){ horizontalSelect(+data.signatureB) });
    $(document).bind('keydown', 'ctrl+left', function(){ horizontalSelect(-data.signatureB) });

    $(document).bind('keydown', 'alt+up', function(){ verticalMove(-1) });
    $(document).bind('keydown', 'alt+down', function(){ verticalMove(+1) });


    $(document).bind('keydown', '+', function(){ changeRepetitions(+1) });
    $(document).bind('keydown', '=', function(){ changeRepetitions(+1) });
    $(document).bind('keydown', '-', function(){ changeRepetitions(-1) });
    $(document).bind('keydown', 'l', function(){ changeChordLength(+1) });
    $(document).bind('keydown', 'k', function(){ changeChordLength(-1) });
    $(document).bind('keydown', 'b', function(){ duplicatePart() });


    $(document).bind('keydown', 'n', function(){ editPartNote($(".part.active")); });
    $(document).bind('keydown', 'p', function(){ addPart(); });
    $(document).bind('keydown', 'del', function(){ genericDelete(2); });
    $(document).bind('keydown', 'backspace', function(){ genericDelete(-2); });
    $(document).bind('keydown', 'space', function(){ editPartname($(".part.active")); });

    $(document).bind('keydown', 'return', function(){ if ($(".chbox.empty.active").length==1)  addEmptyRound(); });


    $(document).bind('keydown', 'c', function(){ setChord("C"); });
    $(document).bind('keydown', 'd', function(){ setChord("D"); });
    $(document).bind('keydown', 'e', function(){ setChord("E"); });
    $(document).bind('keydown', 'f', function(){ setChord("F"); });
    $(document).bind('keydown', 'g', function(){ setChord("G"); });
    $(document).bind('keydown', 'a', function(){ setChord("A"); });
    $(document).bind('keydown', 'h', function(){ setChord("H"); });
    $(document).bind('keydown', 'm', function(){ setChord("m"); });
    $(document).bind('keydown', '2', function(){ setChord("2"); });
    $(document).bind('keydown', '3', function(){ setChord("#"); });
    $(document).bind('keydown', '7', function(){ setChord("7"); });
    $(document).bind('keydown', 's', function(){ setChord("s"); });

    /*********** ICON BINDING ******************/
    $("#jampal .head .addpart").click(addPart);
}














/************* helpers **********************/
function hexToRgbA(hex, alpha=1){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+alpha+')';
    }
    throw new Error('Bad Hex');
}
