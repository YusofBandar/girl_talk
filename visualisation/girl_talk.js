
const trackPath = "../data/all_day/oh_no.json";

const options = {
    width: 500,
    height: 500,
}

d3.json(trackPath).then((track) => {

    const arcWidth = (options.width/2) / track.tracks.length;
    const duration = track.duration;

    let svg = d3.select("body")
        .append("svg")
        .attr("width", options.width)
        .attr("height", options.height)
        

    let record = svg.append("g")
    

    record.append("circle")
        .attr("cx",options.width/2)
        .attr("cy",options.height/2)
        .attr("r",options.width/2)

  

    record.selectAll(".track")
        .data(track.tracks)
        .enter()
        .append("g")
        .style("transform",()=>{
            return `translate(250px,250px)`
        })
        .append("path")
        .style("fill","white")
        .attr("d", (d, i) => {
            const circum = 2 * Math.PI;
            let startAngle = (d.startTime / duration) * circum;
            let endAngle = (d.endTime / duration) * circum;

            let path = d3.arc()
                .innerRadius(250 - ((i+1) * arcWidth) )
                .outerRadius(250 - (i * arcWidth))
                .startAngle(startAngle)
                .endAngle(endAngle);

                return path();

        })



}).catch((err) => {
    console.error(err);
})