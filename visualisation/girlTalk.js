window.onload = () => {
    let dataUrl;
    const url = window.location.href;

    if(url.includes('allDay')){
        dataUrl = '/data/all_day.json';
    }else{
        dataUrl = '/data/feed_the_animals.json';
    }
    
    girlTalk(dataUrl);
}

const girlTalk = async (url) => {
    const album = await d3.json(url);

    let data = await Promise.all(album.tracks.map(({ dataPath }) => d3.json(dataPath)));

    const colors = ['#9bd5f3', '#ecb60f', '#b75dc5', '#4dbd2c', '#b72d44'];

    const width = 800;
    const height = 1100;

    const radius = 200;
    const outerPadding = 10
    const innerPadding = 20

    const svg = d3.select('.content')
        .selectAll('svg')
        .data(data)
        .enter()
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)

    svg.append('text')
        .text(d => d.track)
        .attr('class', 'title');

    const record = svg.append('g')
        .attr('id', (d) => d.track)
        .style('transform', `translate(${width * 0.5}px,${height * 0.5}px)`)
        .each(d => {
            d.tracks.forEach(t => t.album = d);
        });
    
    // record
    record.append('circle')
        .attr('r', radius)
        .attr('cx', 0)
        .attr('cy', 0)
        .style('fill', 'black');

    // inner circle within record
    record.append('circle')
        .attr('r', innerPadding)
        .attr('cx', 0)
        .attr('cy', 0)
        .style('fill', '#fff5df');
    record.append('circle')
        .attr('r', innerPadding * 0.1)
        .attr('cx', 0)
        .attr('cy', 0)
        .style('fill', 'black');

    const tracks = record.append('g')
        .selectAll('.track')
        .data((d) => d.tracks)
        .enter()
        .append('g')
        .attr('class', 'track')
        .attr('id', (d) => d.track)

    // track arcs
    tracks
        .append('path')
        .attr('d', (d, i) => {
            const circum = 2 * Math.PI;

            const arcWidth = (((radius * 2) - (outerPadding + innerPadding + 50)) / 2) / d.album.tracks.length;
            const innerRadius = (((radius) - ((i + 1) * arcWidth)) - outerPadding);
            const outerRadius = (((radius) - (i * arcWidth)) - outerPadding);

            let startAngle = (d.startTime / d.album.duration) * circum;
            let endAngle = (d.endTime / d.album.duration) * circum;

            const path = arc(startAngle, endAngle, innerRadius, outerRadius);
            d.centroid = path.centroid();
            return path();
        })
        .style('fill', (d, i) => colors[i % colors.length])
        .on("mouseover", function (j) {
            svg.selectAll('.track')
                .transition()
                .duration(200)
                .style('opacity', (d) => j.track === d.track ? 1 : 0.2);
        })
        .on("mouseout", function () {
            svg.selectAll('.track')
                .transition()
                .delay(200)
                .style('opacity', 1);
        });


    let label = tracks.append('g')
        .attr('class', 'label')

    label.each((p, i) => {
        const { centroid } = p;
        const hypo = Math.hypot(centroid[0], centroid[1])
        const scaler = (radius + (65 * ((i + 1) % 3))) / hypo;
        p.line = {
            x1: centroid[0],
            y1: centroid[1],
            x2: centroid[0] * scaler,
            y2: centroid[1] * scaler
        }
    });

    // artist labels
    label.append('line')
        .attr('x1', (d) => d.line.x1)
        .attr('y1', (d) => d.line.y1)
        .attr('x2', (d) => d.line.x2)
        .attr('y2', (d) => d.line.y2)
        .style('stroke', '#bfbfbf')
        .style('stroke-width', '2px')

    const artist = label
        .append('g')
        .style('text-rendering', 'geometricprecision')
        .style('transform-origin', (d) => (
            `${d.line.x2}px ${d.line.y2}px`
        ))
        .style('transform', (d) => {
            const circum = 2 * Math.PI;
            let startAngle = (d.startTime / d.album.duration) * circum;
            let endAngle = (d.endTime / d.album.duration) * circum;

            return `rotate(${-1.57 + ((startAngle + endAngle) / 2)}rad)`
        })
        .on("mouseover", function (j) {
            svg.selectAll('.track')
                .transition()
                .duration(200)
                .style('opacity', (d) => j.track === d.track ? 1 : 0.2);
        })
        .on("mouseout", function () {
            svg.selectAll('.track')
                .transition()
                .delay(200)
                .style('opacity', 1);
        });

    artist.append('text')
        .attr('class', 'label_artist')
        .text((d) => d.artist)
        .attr('x', (d) => d.line.x2 + 3)
        .attr('y', (d) => d.line.y2 + 1)
        .style('font-size', '15px')
        .style('font-family', 'arial');

    artist.append('text')
        .attr('class', 'label_track')
        .text((d) => d.track)
        .attr('x', (d) => d.line.x2 + 3)
        .attr('y', (d) => d.line.y2 + 15)
        .style('font-size', '10px')
        .style('font-family', 'arial')
        .style('fill', 'goldenrod');
}

const arc = (startAngle, endAngle, innerRadius, outerRadius) => {
    return d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(startAngle)
        .endAngle(endAngle);
}

