import React, { Component } from 'react';

import * as d3 from "d3";

import './timeline.scss';

class Timeline extends Component {

    constructor(props) {
        super(props);

        this.angle = this.angle.bind(this);
        this.time = this.time.bind(this);

        this.timeline = React.createRef();
    }

    componentDidMount(){
        const node = this.timeline.current;
        const self = this;
        d3.select(node).call(d3.drag()
                .on("drag", function () {
                    let angle = 180 - Math.atan2(d3.event.x, d3.event.y) * 180 / Math.PI;
                    let draggedTime = ((angle / 360) * self.props.duration);
                    self.props.onDrag(draggedTime);
                })
            )
    }

    render() {
        return (
            <g ref={this.timeline} style={{ transform: `rotate(${this.angle(this.props.elapsed,this.props.duration)}rad)` }} >
                <line className="r-timeline" x0="0px" x1="0px" y1="0px" y2={this.props.radius * -1.5}></line>
                <text className="r-time" x={this.props.radius * -1.6} y="10">{this.time(this.props.elapsed)}</text>
            </g>

        );
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
}

export default Timeline;