class Record {
    constructor(root, dataPath, audioPath) {
        this.root = root;
        this.dataPath = dataPath;
        this.audioPath = audioPath;

        this.options = {
            width: 1000,
            height: 1000,
            outerPadding: 5,
            innerPadding: 150
        }

        this.colors = ["#9bd5f3", "#ecb60f", "#b75dc5", "#4dbd2c", "#b72d44"]
        this.PLAYING = 1;
        this.PAUSED = 0;
        this.STOPPED = -1;

        this._init();
    }


    arc(index, startAngle, endAngle) {
        let path = d3.arc()
            .innerRadius(((this.radius) - ((index + 1) * this.arcWidth)) - this.options.outerPadding)
            .outerRadius(((this.radius) - (index * this.arcWidth)) - this.options.outerPadding)
            .startAngle(startAngle)
            .endAngle(endAngle);

        return path;
    }

    record(node, width, height) {
        node.append("defs")
            .append("pattern")
            .attr("id", "albumArt")
            .attr("width", 400)
            .attr("height", 400)
            .append("image")
            .attr("xlink:href", "../album_art/All_Day.jpg")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 400)
            .attr("height", 400)

        // record
        node.append("circle")
            .attr("r", this.radius)
            .style("filter","url(#softGlow)");

        // inner part of record
        node.append("path")
            .attr("d", (d) => {
                let path = d3.arc()
                    .innerRadius((this.options.innerPadding / 2) * 0.2)
                    .outerRadius(this.options.innerPadding / 2)
                    .startAngle(0)
                    .endAngle(2 * Math.PI);

                return path();
            })
            .style("fill", "url(#albumArt)")

        return node;
    }

    trackArc(index, node, width, height, arcWidth) {

        let scope = this;

        let track = node.append("g")
            .attr("class", "track")




        // track arcs
        track.append("path")
            .attr("index", index)
            .style("fill", () => {
                return this.colors[index % this.colors.length];
            })
            .attr("d", () => {
                let path = this.arc(index, 0, 0);
                return path();
            })
            .on("mouseover", function () {
                scope.arcHover(d3.select(this).attr("index"));
            })
            .on("mouseout", function () {
                scope.arcLeave();
            })

        return track;
    }

    arcLeave() {
        let trackEls = this.svg.selectAll(".track");
        trackEls.each((m, i, nodes) => {
            let node = d3.select(nodes[i]);
            node.style("opacity", 1);
        })
    }

    arcHover(index) {
        console.log(index);
        let trackEls = this.svg.selectAll(".track");
        trackEls.each((m, i, nodes) => {
            let node = d3.select(nodes[i]);
            if (node.select("path").attr("index") != index) {
                node.style("opacity", 0.2);
            }
        })
    }

    trackLabel(node, track) {
        let label = node.append("g")
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
            .attr("class", "label_artist")
            .text(track.artist)
            .attr("x", 0)
            .attr("y", 0)
            .style("font-size", "15px")
            .style("font-family", "arial")
            .style("fill","#ffffff");

        label.append("text")
            .attr("class", "label_track")
            .text(track.track)
            .attr("x", 0)
            .attr("y", 0)
            .style("font-size", "10px")
            .style("font-family", "arial")
            .style("fill","#c5c5c5");

        return label;
    }

    timeLine(node, width, height) {
        // timeline 
        let timeLine = node.append("g")
            .attr("class", "timeline");


        timeLine.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", -(this.radius * 1.2))
            .style("stroke", "#bfbfbf")
            .style("stroke-width", "3px")
            .style("stroke-dasharray", "3px");

        timeLine.append("text")
            .text("0:00")
            .attr("x", -(this.radius * 1.3))
            .attr("y", 10)
            .style("transform", "rotate(90deg)")
            .style("font-size", "30px")
            .style("font-family", "arial")
            .style("fill","#ffffff");

        return timeLine;
    }

    artistLabels(node, index, path, startAngle, endAngle, angle) {
        // artist label line goes from arc centroid to 100 + radius of record 
        const centroid = path.centroid();
        const radius = (this.radius);
        const hypo = Math.hypot(centroid[0], centroid[1])
        const scaler = (radius + (65 * ((index + 1) % 3))) / hypo;

        let label = d3.select(node)
            .select(".label")
            .style("visibility", () => {
                return startAngle != angle ? "visible" : "hidden";
            })


        label.select("line")
            .attr("x1", centroid[0])
            .attr("y1", centroid[1])
            .attr("x2", centroid[0] * scaler)
            .attr("y2", centroid[1] * scaler)

        label.select(".label_artist")
            .attr("x", (centroid[0] * scaler) + 3)
            .attr("y", (centroid[1] * scaler) + 1)
            .style("transform-origin", () => {
                return `${centroid[0] * scaler}px ${centroid[1] * scaler}px`;
            })
            .style("transform", `rotate(${-1.57 + ((startAngle + endAngle) / 2)}rad)`)
            .style("opacity", 1);


        label.select(".label_track")
            .attr("x", (centroid[0] * scaler) + 3)
            .attr("y", (centroid[1] * scaler) + 15)
            .style("transform-origin", () => {
                return `${centroid[0] * scaler}px ${centroid[1] * scaler}px`;
            })
            .style("transform", `rotate(${-1.57 + ((startAngle + endAngle) / 2)}rad)`)
            .style("opacity", 1);
    }

    resume() {
        this.state = this.PLAYING;
        this.audio.play();
    }

    stop(trackEls, duration) {

        this.state = this.STOPPED;

        const circum = 2 * Math.PI;

        trackEls.each((m, i, nodes) => {
            let d = this.data.tracks[i];

            let startAngle = (d.startTime / duration) * circum;
            let endAngle = (d.endTime / duration) * circum;

            let path = d3.arc()
                .innerRadius(((this.radius) - ((i + 1) * this.arcWidth)) - this.options.outerPadding)
                .outerRadius(((this.radius) - (i * this.arcWidth)) - this.options.outerPadding)
                .startAngle(startAngle)
                .endAngle(endAngle);


            // artist label line goes from arc centroid to 100 + radius of record 
            const centroid = path.centroid();
            const delay = 5000;

            let label = d3.select(nodes[i])
                .select(".label");

            label.select("line")
                .transition()
                .duration(2000)
                .delay(delay)
                .ease(d3.easeExp)
                .attr("x1", centroid[0])
                .attr("y1", centroid[1])
                .attr("x2", centroid[0])
                .attr("y2", centroid[1]);

            label.select(".label_artist")
                .transition()
                .duration(2000)
                .delay(delay)
                .style("opacity", 0)

            label.select(".label_track")
                .transition()
                .duration(2000)
                .delay(delay)
                .style("opacity", 0)




            d3.select(nodes[i])
                .select("path")
                .transition()
                .duration(2000)
                .delay(delay)
                .ease(d3.easeExp)
                .attrTween("d", () => {

                    let interpolate = d3.interpolate(endAngle, startAngle);

                    return (t) => {
                        endAngle = interpolate(t);

                        let path = d3.arc()
                            .innerRadius(((this.radius) - ((i + 1) * this.arcWidth)) - this.options.outerPadding)
                            .outerRadius(((this.radius) - (i * this.arcWidth)) - this.options.outerPadding)
                            .startAngle(startAngle)
                            .endAngle(endAngle);

                        return path();
                    };

                }).on("end", () => {
                    this.timer.select("text").text(`0:00`);
                    trackEls.each(() => {
                        d3.select(this).remove();
                    })
                });
        })
    }

    pause() {
        this.state = this.PAUSED;
        this.audio.pause();
    }

    play() {
        this.state = this.PLAYING;

        let audio = new Audio(this.audioPath);
        this.audio = audio;

        audio.addEventListener("loadedmetadata", () => {
            audio.play();

            const duration = this.data.duration;
            let trackEls = this.svg.selectAll(".track");



            this.timer.call(d3.drag()
                .on("drag", function () {
                    let angle = 180 - Math.atan2(d3.event.x, d3.event.y) * 180 / Math.PI;
                    audio.currentTime = ((angle / 360) * duration) / 1000;
                })
            )


            this.t = d3.timer((elapsed) => {

                elapsed = (audio.currentTime * 1000) * 1;

                // used to calculate radians
                const circum = 2 * Math.PI;

                // time of the track converted into an angle
                // 360deg = track duration
                let angleRad = (elapsed / duration) * circum;

                this.timer.style("transform", `rotate(${angleRad}rad)`)


                trackEls.each((m, i, nodes) => {
                    let d = this.data.tracks[i];

                    // angles of each ith track
                    let startAngle = (d.startTime / duration) * circum;
                    let endAngle = (d.endTime / duration) * circum;


                    // dont display track arcs until we have reached the correct point
                    startAngle = startAngle > angleRad ? angleRad : startAngle;
                    endAngle = endAngle > angleRad ? angleRad : endAngle;

                    let path = d3.arc()
                        .innerRadius(((this.radius) - ((i + 1) * this.arcWidth)) - this.options.outerPadding)
                        .outerRadius(((this.radius) - (i * this.arcWidth)) - this.options.outerPadding)
                        .startAngle(startAngle)
                        .endAngle(endAngle);


                    this.artistLabels(nodes[i], i, path, startAngle, endAngle, angleRad);

                    d3.select(nodes[i])
                        .select("path")
                        .attr("d", () => {
                            return path();
                        })
                })


                // minutes and seconds has elapsed
                let minutes = parseInt(elapsed / 60000);
                let seconds = parseInt((elapsed - (60000 * minutes)) / 1000);
                seconds = seconds < 10 ? `0${seconds}` : seconds.toString();
                this.timer.select("text").text(`${minutes}:${seconds}`);


                // if at the end of track remove all arcs and labels
                if (elapsed > duration) {
                    this.t.stop()
                    this.stop(trackEls, duration);
                }
            }, 150);
        })
    }


    _init() {
        d3.json(this.dataPath).then((track) => {

            this.state = this.STOPPED
            this.data = track;

            const options = this.options;

            // track samples
            const tracks = track.tracks;

            //record height and width
            const width = options.width - 500;
            const height = options.height - 500;
            this.width = width;
            this.height = height;
            this.radius = width / 1.8;

            const arcWidth = (((this.radius * 2) - (options.outerPadding + options.innerPadding + 50)) / 2) / tracks.length;
            this.arcWidth = arcWidth;

            this.svg = this.root
                .append("svg")
                .attr("width", options.width)
                .attr("height", options.height)
                .append("g")
                .style("transform", () => {
                    return `translate(${options.width / 2}px,${options.height / 2}px)`
                }).on("click", () => {
                    if (this.state == this.STOPPED) {
                        this.play();
                    } else if (this.state == this.PAUSED) {
                        this.resume();
                    } else if (this.state == this.PLAYING) {
                        this.pause();
                    }
                })


            this.record(this.svg, width, height);

            // each sample 
            tracks.forEach((track, i) => {
                let trackArc = this.trackArc(i, this.svg, width, height, arcWidth);
                this.trackLabel(trackArc, track)
            });


            this.timer = this.timeLine(this.svg, width, height);
        }).catch((err) => {
            console.error(err);
        })
    }
}



