import React, { Component } from 'react';
import * as d3 from "d3";

import './record.scss';

import Track from "../track/track";

class Record extends Component {

    width = 500;
    height = 500;

    innerPadding = this.width / 15;
    outerPadding = this.width / 100;

    radius = this.width / 2;

    colours = ["#9bd5f3", "#ecb60f", "#b75dc5", "#4dbd2c", "#b72d44"];

    constructor(props) {
        super(props);
        this.track = props.track;
        this.arcWidth = this.arcWidth.bind(this);
    }

    arcWidth(radius, innerPadding, outerPadding, numTracks) {
        const arcWidth = (((radius * 2) - (outerPadding + innerPadding + 50)) / 2) / numTracks;
        return arcWidth.toFixed(2);
    }

    d3Arc(index, radius, arcWidth, startAngle, endAngle, outerPadding) {
        let path = d3.arc()
            .innerRadius(((radius) - ((index + 1) * arcWidth)) - outerPadding)
            .outerRadius(((radius) - (index * arcWidth)) - outerPadding)
            .startAngle(startAngle)
            .endAngle(endAngle);
        return path;
    }

    angles(startTime,endTime,duration) {
        const circum = 2 * Math.PI;

        let startAngle = (startTime / duration) * circum;
        let endAngle = (endTime / duration) * circum;
        return [startAngle,endAngle];
    }

    arcHover(){
        console.log("arc hover");
    }

    arcBlur(){
        console.log("arc Blur")
    }

    render() {
        const track = this.track;
        const tracks = this.track.tracks;

        const arcWidth =  this.arcWidth(this.radius, this.innerPadding, this.outerPadding,tracks.length)

        return (
            <svg className="v-record" viewBox="0 0 1000 1000" width={this.props.width} height={this.props.height}>
                <g className="r-wrapper">
                    <circle className="r-disk" r={this.width / 2}></circle>
                    <circle className="r-innerDisk" r={this.innerPadding}></circle>
                    {
                        tracks.map((sample, index) => {
                            const angles = this.angles(sample.startTime,sample.endTime,track.duration);
                            const arcPath = this.d3Arc(index,this.radius,arcWidth,angles[0],angles[1],this.outerPadding);
                            return <Track key={sample.track} path={arcPath} colour={this.colours[index % this.colours.length]}
                            hover={this.arcHover} blur={this.arcBlur}
                            ></Track>
                        })
                    }
                </g>
            </svg>
        );
    }
}

export default Record;