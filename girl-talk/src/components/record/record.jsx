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
        count: 20,
        currentAngle: 0
    }

    componentDidMount() {
        
    }

    constructor(props) {
        super(props);
        this.track = props.track;

        this.arcWidth = this.arcWidth.bind(this);
        
        this.arcHover = this.arcHover.bind(this);
        this.arcBlur = this.arcBlur.bind(this);
    }

    arcWidth(radius, innerPadding, outerPadding, numTracks) {
        const arcWidth = (((radius * 2) - (outerPadding + innerPadding + 50)) / 2) / numTracks;
        return arcWidth.toFixed(2);
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
                            let blur = false;

                            if (index !== this.state.hoverTrack && this.state.hoverTrack > -1) {
                                blur = true;
                            }

                            return <Track key={sample.track} index={index} radius={this.radius} arcWidth={arcWidth} angle="3.8" track={sample} duration={track.duration}
                                padding={this.outerPadding} blur={blur} colour={this.colours[index % this.colours.length]} onHover={this.arcHover} onBlur={this.arcBlur}
                            ></Track>
                        })
                    }
                    <Timeline radius={this.radius} time="0:00" angle={this.state.currentAngle}></Timeline>
                </g>
            </svg>
        );
    }
}

export default Record;