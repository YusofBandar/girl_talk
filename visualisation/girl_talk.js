
const trackPath = "../data/all_day/oh_no.json";

const options = {
    width: 800,
    height: 800,
    outerPadding: 10,
    innerPadding: 100,
}

d3.json(trackPath).then((track) => {


    const width = options.width - 300;
    const height = options.height - 300;

    const arcWidth = ((width - (options.outerPadding + options.innerPadding + 50)) / 2) / track.tracks.length;
    const duration = track.duration;


    let colors = ["#9bd5f3", "#ecb60f", "#b75dc5", "#4dbd2c"]

    let svg = d3.select("body")
        .append("svg")
        .attr("width", options.width)
        .attr("height", options.height)


    let record = svg.append("g")
        .style("transform", () => {
            return `translate(${options.width / 2}px,${options.height / 2}px)`
        })


    record.append("circle")
        .attr("r", width / 2)

    record.append("path")
        .attr("d", (d) => {
            let path = d3.arc()
                .innerRadius((options.innerPadding / 2) * 0.25)
                .outerRadius(options.innerPadding / 2)
                .startAngle(0)
                .endAngle(2 * Math.PI);

            return path();
        })
        .style("fill", "#909090")



    record.selectAll(".track")
        .data(track.tracks)
        .enter()
        .append("path")
        .style("fill", (d, i) => {

            return colors[i % colors.length];
        })
        .attr("d", (d, i) => {
            const circum = 2 * Math.PI;
            let startAngle = (d.startTime / duration) * circum;
            let endAngle = (d.endTime / duration) * circum;

            let path = d3.arc()
                .innerRadius(((width / 2) - ((i + 1) * arcWidth)) - options.outerPadding)
                .outerRadius(((width / 2) - (i * arcWidth)) - options.outerPadding)
                .startAngle(startAngle)
                .endAngle(endAngle);

            return path();

        })


    let timeLine = record.append("g")
        .attr("class", "timeline")

    timeLine.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", -((height / 2) + (height / 2 * 0.3)))
        .style("stroke", "#bfbfbf")
        .style("stroke-width", "3px")
        .style("stroke-dasharray", "3px");

    let text = timeLine.append("text")
        .text("0:00")
        .attr("x", -((height / 2) + (height / 2 * 0.55)))
        .attr("y", 10)
        .style("transform", "rotate(90deg)")
        .style("font-size", "30px")
        .style("font-family", "arial")
    
    let t = d3.timer(function (elapsed) {
        let minutes = parseInt(elapsed/60000);

        let seconds = parseInt((elapsed - (60000*minutes)) / 1000);    
        seconds = seconds < 10 ? `0${seconds}` : seconds.toString();
        
        text.text(`${minutes}:${seconds}`);

        let angle = (elapsed / duration) * 360;
        timeLine.style("transform",`rotate(${angle}deg)`)

        if (elapsed > duration) t.stop();
    }, 150);


}).catch((err) => {
    console.error(err);
})