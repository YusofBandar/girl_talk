const fs = require("fs");
const readline = require("readline");

const sourceFile = "./all_day/steady_shock.txt";
const targetFile = "./all_day/steady_shock.json";

const readInterface = readline.createInterface({
    input: fs.createReadStream(sourceFile)
});

let tracks = [];

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


    tracks.push({startTime,endTime,artist,track})

    console.log(startTime, endTime, artist, track);
    console.log("==================")
});

readInterface.on("close",() => {
    writeTrack(targetFile,tracks)
})


function writeTrack(file, tracks) {
    fs.readFile(file, { encoding: 'utf-8' }, function (err, data) {
        if (!err) {
            let JSONdata = JSON.parse(data);
            JSONdata.tracks = tracks;
            fs.writeFile(file, JSON.stringify(JSONdata), function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        } else {
            console.log(err);
        }
    });
}

function timeConversion(timeString) {
    let time = new Date(10, 10, 10, 0, timeString.split(":")[0], timeString.split(":")[1])
    return ((time.getSeconds() * 1000) + time.getMinutes() * 60000);
}


