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
    $("#storageModal").modal('hide');
}


function saveSong() {
    console.log("saving song");
    var dd = collectData();
    console.log(dd);
    var myJSON = JSON.stringify( dd );
    var text = encodeURIComponent( myJSON );
    var $link = $("<a />");

    // <a download="filename.txt" href='data:application/octet-stream,...'></a>
    $link
      .attr( "download", data.name+".jpl" )
      .attr( "href", "data:application/octet-stream," + text )
      .appendTo( "body" )
      .get(0)
      .click()
      .remove();
    encodeDataToURL(dd);
}

var reader = new FileReader();
function loadSong() {
    var file = this.files[0];
    // read the file as text
    reader.readAsText( file );
    // and then then load event will trigger ...
}
reader.onload = function( ev ) {
   var contents = JSON.parse( decodeURIComponent( ev.target.result ) );
   data = contents;
   drawJampal();
   $("#storageModal").modal('hide');
};


function initStorage() {
    $("#downloadLink").click(saveSong);
    $("#newSongLink").click(newSong);
    $("#fileField").on("change", loadSong );

    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('data')) {
        decodeDataFromURL();
    }
}

// Function to handle loading .jpl file from file dialog
function handleLoadFile(fileContent) {
    var contents = JSON.parse(decodeURIComponent(fileContent));
    data = contents;
    drawJampal();
}

// Function to handle saving .jpl file to file dialog
function handleSaveFile(filePath) {
    var dd = collectData();
    var myJSON = JSON.stringify(dd);
    fs.writeFileSync(filePath, myJSON, 'utf-8');
}

// Listen for load-file and save-file events from main process
const { ipcRenderer } = require('electron');
ipcRenderer.on('load-file', (event, fileContent) => {
    handleLoadFile(fileContent);
});
ipcRenderer.on('save-file', (event, filePath) => {
    handleSaveFile(filePath);
});

function encodeDataToURL(data) {
    var compressedData = compressData(data);
    var encodedData = encodeURIComponent(compressedData);
    var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?data=' + encodedData;
    window.history.replaceState({path: newUrl}, '', newUrl);
}

function decodeDataFromURL() {
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('data')) {
        var encodedData = urlParams.get('data');
        var compressedData = decodeURIComponent(encodedData);
        var decodedData = decompressData(compressedData);
        data = JSON.parse(decodedData);
        drawJampal();
    }
}

function compressData(data) {
    // Implement compression logic here
    var compressedData = JSON.stringify(data);
    compressedData = compressedData.replace(/"repeat":/g, 'r:');
    compressedData = compressedData.replace(/"chords":/g, 'c:');
    compressedData = compressedData.replace(/"root":/g, 'o:');
    compressedData = compressedData.replace(/"leng":/g, 'l:');
    compressedData = compressedData.replace(/"sharp":/g, 's:');
    compressedData = compressedData.replace(/"chord":/g, 'h:');
    compressedData = compressedData.replace(/"notes":/g, 'n:');
    compressedData = compressedData.replace(/"color":/g, 'cl:');
    compressedData = compressedData.replace(/"name":/g, 'nm:');
    return compressedData;
}

function decompressData(compressedData) {
    // Implement decompression logic here
    compressedData = compressedData.replace(/r:/g, '"repeat":');
    compressedData = compressedData.replace(/c:/g, '"chords":');
    compressedData = compressedData.replace(/o:/g, '"root":');
    compressedData = compressedData.replace(/l:/g, '"leng":');
    compressedData = compressedData.replace(/s:/g, '"sharp":');
    compressedData = compressedData.replace(/h:/g, '"chord":');
    compressedData = compressedData.replace(/n:/g, '"notes":');
    compressedData = compressedData.replace(/cl:/g, '"color":');
    compressedData = compressedData.replace(/nm:/g, '"name":');
    return compressedData;
}
