import React, { Component } from 'react';
import * as d3 from "d3";

import './label.scss';


class Label extends Component {


    constructor(props) {
        super(props); 
    }

    isVisible(startAngle, currentAngle){
        if(currentAngle === 0){
            return { visibility: "hidden"}
        }

        return (startAngle !== currentAngle) ? {visibility: "visible"} : { visibility: "hidden"};
    }



    render() {
        const props = this.props;
        
        const centroid = props.centroid;
        const hypo = Math.hypot(centroid[0], centroid[1])
        const scaler = (props.config.radius + (65 * ((props.config.index + 1) % 3))) / hypo;

        const origin = `${centroid[0] * scaler}px ${centroid[1] * scaler}px`;
        const rotate = `rotate(${-1.57 + ((Number(props.angles[0]) + Number(props.angles[1])) / 2)}rad)`;
        
        return (
            <g className="r-label" style={this.isVisible(props.angles[0],props.currentAngle)}>
                <line className="r-line" x1={centroid[0]} y1={centroid[1]} x2={centroid[0] * scaler} y2={centroid[1] * scaler}></line>
                <g style={
                    {
                        "transformOrigin": origin,
                        "transform": rotate
                    }
                }>
                    <text x={(centroid[0] * scaler) + 3} y={(centroid[1] * scaler) + 1}>{props.track.track}</text>
                    <text x={(centroid[0] * scaler) + 3} y={(centroid[1] * scaler) + 15}>{props.track.artist}</text>
                </g>
            </g>
        );
    }
}

export default Label;