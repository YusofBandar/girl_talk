const fs = require("fs");
const readline = require("readline");

const file = "./all_day/oh_no.txt";

const readInterface = readline.createInterface({
    input: fs.createReadStream(file)
});

readInterface.on('line', function (line) {
    line = line.toString();
    let lineSplit = line.split(" - ");

    let startTime = lineSplit[0];
    startTime = timeConversion(startTime.trim());

    let endTime = lineSplit[1].split("[")[0];
    endTime = timeConversion(endTime.trim());

    let artist = lineSplit[1].split("[")[2].split("|")[1];

    artist = artist.replace(/]/g, "");
    artist = artist.replace(/featuring/g, "");
    artist = artist.trim();

    let track = lineSplit[lineSplit.length - 1].split("|")[1];
    track = track.replace(/]/g, "");
    track = track.replace(/"/g, "");
    track = track.trim();



    console.log(startTime,endTime,artist,track);
    console.log("==================")
});


function timeConversion(timeString) {
    let time = new Date(10, 10, 10, 0, timeString.split(":")[0], timeString.split(":")[1])
    return ((time.getSeconds() * 1000) + time.getMinutes() * 60000);
}


