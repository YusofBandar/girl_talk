
const trackPath = "../data/all_day/oh_no.json";

const options = {
    width: 800,
    height: 800,
    outerPadding: 10,
    innerPadding: 100,
}

d3.json(trackPath).then((track) => {

    const tracks = track.tracks;

    const width = options.width - 300;
    const height = options.height - 300;

    const arcWidth = ((width - (options.outerPadding + options.innerPadding + 50)) / 2) / tracks.length;
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


    tracks.forEach((d, i) => {
        record.append("path")
            .attr("class", "track")
            .style("fill", () => {

                return colors[i % colors.length];
            })
            .attr("d", () => {
                let path = d3.arc()
                    .innerRadius(((width / 2) - ((i + 1) * arcWidth)) - options.outerPadding)
                    .outerRadius(((width / 2) - (i * arcWidth)) - options.outerPadding)
                    .startAngle(0)
                    .endAngle(0);

                return path();

            })
    });

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

    let trackEls = record.selectAll(".track");

    let t = d3.timer(function (elapsed) {

        const circum = 2 * Math.PI;
        let angleDeg = (elapsed / duration) * 360;
        let angleRad = (elapsed / duration) * circum;

        console.log(angleRad);

        timeLine.style("transform", `rotate(${angleDeg}deg)`)


        trackEls.each(function (d, i) {
            d3.select(this).attr("d", () => {
                let d = tracks[i];

                let startAngle = (d.startTime / duration) * circum;
                let endAngle = (d.endTime / duration) * circum;

                startAngle = startAngle > angleRad ? angleRad : startAngle;
                endAngle = endAngle > angleRad ? angleRad : endAngle;

                let path = d3.arc()
                    .innerRadius(((width / 2) - ((i + 1) * arcWidth)) - options.outerPadding)
                    .outerRadius(((width / 2) - (i * arcWidth)) - options.outerPadding)
                    .startAngle(startAngle)
                    .endAngle(endAngle);

                return path();

            })
        })




        let minutes = parseInt(elapsed / 60000);

        let seconds = parseInt((elapsed - (60000 * minutes)) / 1000);
        seconds = seconds < 10 ? `0${seconds}` : seconds.toString();

        text.text(`${minutes}:${seconds}`);

        if (elapsed > duration) {
            t.stop()

            text.text(`0:00`);




            d3.selectAll(".track").transition()
                .duration(2000)
                .ease(d3.easeExp)
                .attrTween("d", (m, i) => {
                    let d = tracks[i];

                    let startAngle = (d.startTime / duration) * circum;
                    let endAngle = (d.endTime / duration) * circum;

                    var interpolate = d3.interpolate(endAngle, startAngle);

                    return function (t) {
                        endAngle = interpolate(t);

                        let path = d3.arc()
                            .innerRadius(((width / 2) - ((i + 1) * arcWidth)) - options.outerPadding)
                            .outerRadius(((width / 2) - (i * arcWidth)) - options.outerPadding)
                            .startAngle(startAngle)
                            .endAngle(endAngle);

                        return path();
                    };

                }).remove();
        };
    }, 150);


}).catch((err) => {
    console.error(err);
})