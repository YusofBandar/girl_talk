import React, { Component } from 'react';
import classNames from 'classnames/bind';
import * as d3 from "d3";

import './track.scss';

import Label from "./label/label";

class Track extends Component {

    constructor(props) {
        super(props);

        this.hover = this.hover.bind(this);
        this.blur = this.blur.bind(this);

        this.angles = this.angles.bind(this);
        this.d3Arc = this.d3Arc.bind(this);
    }

    hover() {
        this.props.onHover(this.props.index);
    }

    blur() {
        this.props.onBlur();
    }

    angles(startTime, endTime, currentAngle, duration) {
        const circum = 2 * Math.PI;

        let startAngle = (startTime / duration) * circum;
        let endAngle = (endTime / duration) * circum;

        // dont display track arcs until we have reached the correct point
        startAngle = startAngle > currentAngle ? currentAngle : startAngle;
        endAngle = endAngle > currentAngle ? currentAngle : endAngle;
        return [startAngle, endAngle];
    }

    d3Arc(index, radius, arcWidth, startAngle, endAngle, outerPadding) {
        let path = d3.arc()
            .innerRadius(((radius) - ((index + 1) * arcWidth)) - outerPadding)
            .outerRadius(((radius) - (index * arcWidth)) - outerPadding)
            .startAngle(startAngle)
            .endAngle(endAngle);
        return path;
    }

    render() {

        const props = this.props;
        const angles = this.angles(props.track.startTime,props.track.endTime,"3",props.duration);
        const arc = this.d3Arc(props.index, props.radius, props.arcWidth, angles[0], angles[1], props.padding);

        return (
            <g className={classNames({ 'r-blur': this.props.blur })}>
                <path onMouseEnter={this.hover} onMouseLeave={this.blur} style={{ fill: this.props.colour }} d={arc()}></path>
                <Label index={props.index} radius={props.radius} angles={angles} centroid={arc.centroid()} artist={props.track.artist} track={props.track.track}></Label>
            </g>
        );
    }
}

export default Track;