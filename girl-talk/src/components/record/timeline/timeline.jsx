import React, { Component } from 'react';

import * as d3 from "d3";

import './timeline.scss';

class Timeline extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <g style={{transform: `rotate(${this.props.angle}rad)`}} >
                <line className="r-timeline" x0="0px" x1="0px" y1="0px" y2={this.props.radius * -1.5}></line>
                <text className="r-time" x={this.props.radius * -1.6} y="10">{this.props.time}</text>
            </g>
            
        );
    }
}

export default Timeline;