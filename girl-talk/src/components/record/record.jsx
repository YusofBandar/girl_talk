import React, { Component } from 'react';
import * as d3 from "d3";

import './record.scss';

import Track from "../track/track";
import Timeline from "./timeline/timeline";

class Record extends Component {

    width = 500;
    height = 500;

    innerPadding = this.width / 15;
    outerPadding = this.width / 100;

    radius = this.width / 2;

    colours = ["#9bd5f3", "#ecb60f", "#b75dc5", "#4dbd2c", "#b72d44"];

    state = {
        hoverTrack: -1,
        count: 20
    }

    constructor(props) {
        super(props);
        this.track = props.track;

        this.arcWidth = this.arcWidth.bind(this);
        this.angles = this.angles.bind(this);

        this.arcHover = this.arcHover.bind(this);
        this.arcBlur = this.arcBlur.bind(this);
    }

    arcWidth(radius, innerPadding, outerPadding, numTracks) {
        const arcWidth = (((radius * 2) - (outerPadding + innerPadding + 50)) / 2) / numTracks;
        return arcWidth.toFixed(2);
    }

    angles(startTime, endTime, duration) {
        const circum = 2 * Math.PI;

        let startAngle = (startTime / duration) * circum;
        let endAngle = (endTime / duration) * circum;
        return [startAngle, endAngle];
    }

    arcHover(index) {
        this.setState({ hoverTrack: index })
    }

    arcBlur() {
        this.setState({ hoverTrack: -1 });
    }

    render() {
        const track = this.track;
        const tracks = this.track.tracks;

        const arcWidth = this.arcWidth(this.radius, this.innerPadding, this.outerPadding, tracks.length)

        return (
            <svg className="v-record" viewBox="0 0 1000 1000" width={this.props.width} height={this.props.height}>
                <g className="r-wrapper">
                    <circle className="r-disk" r={this.width / 2}></circle>
                    <circle className="r-innerDisk" r={this.innerPadding}></circle>
                    {
                        tracks.map((sample, index) => {
                            const angles = this.angles(sample.startTime, sample.endTime, track.duration);

                            let blur = false;

                            if (index !== this.state.hoverTrack && this.state.hoverTrack > -1) {
                                blur = true;
                            }

                            return <Track key={sample.track} index={index} radius={this.radius} arcWidth={arcWidth} angles={[angles[0], angles[1]]} track={sample}
                                padding={this.outerPadding} blur={blur} colour={this.colours[index % this.colours.length]} onHover={this.arcHover} onBlur={this.arcBlur}
                            ></Track>
                        })
                    }
                    <Timeline radius={this.radius} time="0:00"></Timeline>
                </g>
            </svg>
        );
    }
}

export default Record;