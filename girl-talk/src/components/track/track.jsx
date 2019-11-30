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
        this.angle = this.angle.bind(this);
        this.d3Arc = this.d3Arc.bind(this);
    }

    hover() {
        this.props.onHover(this.props.config.index);
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

    angle(elapsed, duration) {
        // used to calculate radians
        const circum = 2 * Math.PI;

        // time of the track converted into an angle
        // 360deg = track duration
        return (elapsed / duration) * circum;
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
        const config = props.config;

        const angles = this.angles(props.track.startTime, props.track.endTime, this.angle(props.elapsed, props.duration), props.duration);
        const arc = this.d3Arc(config.index, config.radius, config.arcWidth, angles[0], angles[1], config.padding);

        const labelConfig = {
            index : config.index,
            radius: config.radius
        }


        return (
            <g className={classNames({ 'r-blur': this.props.blur, "r-end": this.props.end })}>
                <path onMouseEnter={this.hover} onMouseLeave={this.blur} style={{ fill: config.colour }} d={arc()}></path>
                <Label config={labelConfig} angles={angles} currentAngle={this.angle(props.elapsed, props.duration)} centroid={arc.centroid()} track={props.track}></Label>
            </g>
        );
    }
}

export default Track;