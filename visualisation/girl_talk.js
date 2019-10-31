
const trackPath = "../data/all_day/oh_no.json";

const options = {
    width: 500,
    height: 500,
    outerPadding: 10,
    innerPadding: 100,
}

d3.json(trackPath).then((track) => {

    const arcWidth = ((options.width-(options.outerPadding+options.innerPadding + 50)) / 2) / track.tracks.length;
    const duration = track.duration;


    let colors = ["#9bd5f3", "#ecb60f", "#b75dc5", "#4dbd2c"]

    let svg = d3.select("body")
        .append("svg")
        .attr("width", options.width)
        .attr("height", options.height)


    let record = svg.append("g")
        .style("transform", () => {
            return `translate(250px,250px)`
        })


    record.append("circle")
        .attr("r",options.width/2)

    record.append("circle")
        .attr("r",options.innerPadding/2)
        .style("fill","#909090")

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
                .innerRadius(((options.width/2) - ((i + 1) * arcWidth)) - options.outerPadding)
                .outerRadius(((options.width/2) - (i * arcWidth)) - options.outerPadding)
                .startAngle(startAngle)
                .endAngle(endAngle);

            return path();

        })



}).catch((err) => {
    console.error(err);
})