import React, { Component } from 'react';

import * as d3 from "d3";

import './timeline.scss';

class Timeline extends Component {

    constructor(props) {
        super(props);

        this.angle = this.angle.bind(this);
        this.time = this.time.bind(this);
    }

    time(elapsed){
        //minutes and seconds has elapsed
        let minutes = parseInt(elapsed / 60000);
        let seconds = parseInt((elapsed - (60000 * minutes)) / 1000);
        seconds = seconds < 10 ? `0${seconds}` : seconds.toString();
        return `${minutes}:${seconds}`;
    }

    angle(elapsed, duration) {
        // used to calculate radians
        const circum = 2 * Math.PI;

        // time of the track converted into an angle
        // 360deg = track duration
        return (elapsed / duration) * circum;
    }

    render() {
        return (
            <g style={{ transform: `rotate(${this.angle(this.props.elapsed,this.props.duration)}rad)` }} >
                <line className="r-timeline" x0="0px" x1="0px" y1="0px" y2={this.props.radius * -1.5}></line>
                <text className="r-time" x={this.props.radius * -1.6} y="10">{this.time(this.props.elapsed)}</text>
            </g>

        );
    }
}

export default Timeline;