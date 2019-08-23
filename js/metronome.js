// Defaults
var count = 0;
var tapStart = 0;
var tapPrevious = 0;
var autoReset = 2; //in seconds
var idleTime = 0;


$("document").ready(function() {
    // $(".in_bpm").hide();
    var idleInterval = setInterval(idleIncrement, 1000);

    $(this).bind('keydown', 't', function(){
        idleTime = 0;
        getTempo();
    });
});


// Reset Counter
function resetTempo()
{
    count = 0;
    // $(".avg_bpm").text( defaultText );
    // $(".in_bpm").hide();
}

// Get BPM
function getTempo()
{
    tapTimer = $.now();

    if (count == 0) {
        tapStart = tapTimer;
        count = 1;

    } else {
        bpmAvg = 60000 * count / (tapTimer - tapStart);

        if(bpmAvg > 220)
            bpmAvg = 220;

        if(bpmAvg < 40)
            bpmAvg = 40;

        $("#bpm").val( Math.round(bpmAvg) );
        $("#bpm").change();
        count++;
    }

    tapPrevious = tapTimer;
}

// Auto-reset
function idleIncrement() {
    idleTime = idleTime + 1;
    if (idleTime >= autoReset)
        resetTempo();
}


/********* METRONOME ***************/
function toggleMetronome() {
    if (intervalReference == null ){
        tempotick =  -data.signatureA;
        intervalReference = setInterval("metronomeTick()", 1000*60/$("#bpm").val());
        $("#metronome_toggle").addClass("active");
    } else {
        clearInterval(intervalReference);
        $("#tempooverlay").hide();
        intervalReference = null;
        $("#metronome_toggle").removeClass("active");
    }
}
var intervalReference = null;
var tempotick = 1;

function runningCarret() {
    var loc = Math.floor(tempotick/data.signatureA);
    if ($("#running_toggle").hasClass("active") && tempotick>=0 && tempotick%data.signatureA ==0) {
        var rl = 0;
        for (var ri =0; ri < $(".round").not(".empty").length; ri++ ) {
            var round = $(".round").not(".empty").eq(ri);
            if (rl <= loc && loc < rl+ round.data("repeat")*data.signatureB) { //its in this round, now which chbox
                console.log("Metronome current round", round);
                var j = 0;
                for (var chi = 0; chi < round.find(".chbox.chord").length; chi++) {
                    var chbox = round.find(".chbox.chord").eq(chi);
                    var left = j;
                    var match = loc%data.signatureB;
                    var right = j + chbox.data("len");
                    console.log("-- MC chbox", chbox, "  loc=",loc, " rl=", rl, " j=",j, "; ",left,"<=",match,"<",right);
                    if (left<= match && match < right) {
                        chboxSelect( chbox, true);
                        return
                    }
                    j+= chbox.data("len");
                }
            }
            rl += round.data("repeat")*data.signatureB;
        }
        // chboxSelect( $("#jampal .chbox.chord").eq( loc ), true );
    }
}

function metronomeTick() {
    var to = $("#tempooverlay");
    to.removeClass("first");
    if (tempotick % data.signatureA == 0) {
        to.addClass("first");
    }
    to.show();
    // to.stop(); // stops previous animations
    // to.animate({opacity: 1}, 30, function() { $(this).animate({opacity:0.5}); });
    runningCarret();
    tempotick =  tempotick+1;
    setTimeout(function() { $("#tempooverlay").hide(); }, 80);
}

$("#bpm").change(function() {
    if (intervalReference != null ) {
        clearInterval(intervalReference);
        intervalReference = setInterval("metronomeTick()", 1000 * 60 / $(this).val());
    }
});