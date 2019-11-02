
const trackPath = "../data/all_day/oh_no.json";

const options = {
    width: 1000,
    height: 1000,
    outerPadding: 10,
    innerPadding: 100,
}

d3.json(trackPath).then((track) => {

    // track samples
    const tracks = track.tracks;

    //record height and width
    const width = options.width - 500;
    const height = options.height - 500;

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

    // record
    record.append("circle")
        .attr("r", width / 2)

    // inner part of record
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

    // each sample 
    tracks.forEach((d, i) => {
        let track = record.append("g")
            .attr("class", "track")


        // track arcs
        track.append("path")
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

        let label = track.append("g")
            .attr("class", "label")
            .style("visibility", "hidden")

        // artist labels
        label.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", 0)
            .style("stroke", "#bfbfbf")
            .style("stroke-width", "2px")

        label.append("text")
            .text(tracks[i].artist)
            .attr("x", 0)
            .attr("y", 0)
            .style("font-size", "15px")
            .style("font-family", "arial");



    });


    // timeline 
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

        //speed up time
        elapsed *= 50;

        // used to calculate radians
        const circum = 2 * Math.PI;

        // time of the track converted into an angle
        // 360deg = track duration
        let angleRad = (elapsed / duration) * circum;

        timeLine.style("transform", `rotate(${angleRad}rad)`)

        trackEls.each(function (m, i) {
            let d = tracks[i];

            // angles of each ith track
            let startAngle = (d.startTime / duration) * circum;
            let endAngle = (d.endTime / duration) * circum;


            // dont display track arcs until we have reached the correct point
            startAngle = startAngle > angleRad ? angleRad : startAngle;
            endAngle = endAngle > angleRad ? angleRad : endAngle;

            let path = d3.arc()
                .innerRadius(((width / 2) - ((i + 1) * arcWidth)) - options.outerPadding)
                .outerRadius(((width / 2) - (i * arcWidth)) - options.outerPadding)
                .startAngle(startAngle)
                .endAngle(endAngle);


            // artist label line goes from arc centroid to 100 + radius of record 
            const centroid = path.centroid();
            const radius = (width / 2);
            const hypo = Math.hypot(centroid[0], centroid[1])
            const scaler = (radius + (65 * ((i + 1) % 3))) / hypo;


            let label = d3.select(this)
                .select(".label")
                .style("visibility", () => {
                    return startAngle != angleRad ? "visible" : "hidden";
                })


            label.select("line")
                .attr("x1", centroid[0])
                .attr("y1", centroid[1])
                .attr("x2", centroid[0] * scaler)
                .attr("y2", centroid[1] * scaler)

            label.select("text")
                .attr("x", (centroid[0] + 3) * scaler)
                .attr("y", (centroid[1] + 1) * scaler)
                .style("transform-origin", () => {
                    return `${centroid[0] * scaler}px ${centroid[1] * scaler}px`;
                })
                .style("transform", `rotate(${-1.57 + ((startAngle + endAngle) / 2)}rad)`)



            d3.select(this)
                .select("path")
                .attr("d", () => {
                    return path();
                })
        })


        // minutes and seconds has elapsed
        let minutes = parseInt(elapsed / 60000);
        let seconds = parseInt((elapsed - (60000 * minutes)) / 1000);
        seconds = seconds < 10 ? `0${seconds}` : seconds.toString();
        text.text(`${minutes}:${seconds}`);


        // if at the end of track remove all arcs and labels
        if (elapsed > duration) {
            t.stop()

            text.text(`0:00`);

            trackEls.each(function (m, i) {
                let d = tracks[i];

                let startAngle = (d.startTime / duration) * circum;
                let endAngle = (d.endTime / duration) * circum;

                let path = d3.arc()
                    .innerRadius(((width / 2) - ((i + 1) * arcWidth)) - options.outerPadding)
                    .outerRadius(((width / 2) - (i * arcWidth)) - options.outerPadding)
                    .startAngle(startAngle)
                    .endAngle(endAngle);


                // artist label line goes from arc centroid to 100 + radius of record 
                const centroid = path.centroid();

                let label = d3.select(this)
                    .select(".label");

                label.select("line")
                    .transition()
                    .duration(2000)
                    .delay(1000)
                    .ease(d3.easeExp)
                    .attr("x1", centroid[0])
                    .attr("y1", centroid[1])
                    .attr("x2", centroid[0])
                    .attr("y2", centroid[1]);

                label.select("text")
                    .transition()
                    .duration(2000)
                    .delay(1000)
                    .style("opacity",0)



                d3.select(this)
                    .select("path")
                    .transition()
                    .duration(2000)
                    .delay(1000)
                    .ease(d3.easeExp)
                    .attrTween("d", () => {

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

                    }).on("end", () => {
                        trackEls.each(() => {
                            d3.select(this).remove();
                        })
                    });
            })
        };
    }, 150);


}).catch((err) => {
    console.error(err);
})