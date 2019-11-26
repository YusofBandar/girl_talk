import React, { Component } from 'react';
import * as d3 from "d3";

import './label.scss';


class Label extends Component {


    constructor(props) {
        super(props);


    }



    render() {
        const props = this.props;
        
        const centroid = props.centroid;
        const hypo = Math.hypot(centroid[0], centroid[1])
        const scaler = (props.radius + (65 * ((props.index + 1) % 3))) / hypo;

        const origin = `${centroid[0] * scaler}px ${centroid[1] * scaler}px`;
        const rotate = `rotate(${-1.57 + ((props.angles[0] + props.angles[1]) / 2)}rad)`;
        return (
            <g className="r-label">
                <line className="r-line" x1={centroid[0]} y1={centroid[1]} x2={centroid[0] * scaler} y2={centroid[1] * scaler}></line>
                <g style={
                    {
                        "transformOrigin": origin,
                        "transform": rotate
                    }
                }>
                    <text x={(centroid[0] * scaler) + 3} y={(centroid[1] * scaler) + 1}>{props.track}</text>
                    <text x={(centroid[0] * scaler) + 3} y={(centroid[1] * scaler) + 15}>{props.artist}</text>
                </g>
            </g>
        );
    }
}

export default Label;