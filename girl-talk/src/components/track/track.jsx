import React, { Component } from 'react';
import classNames from 'classnames/bind';
import * as d3 from "d3";

import './track.scss';

import Label from "./label/label";

class Track extends Component {

    constructor(props) {
        super(props);
        console.log("props",props);
        this.hover = this.hover.bind(this);
        this.blur = this.blur.bind(this);
        this.d3Arc = this.d3Arc.bind(this);
    }

    hover() {
        this.props.onHover(this.props.index);
    }

    blur() {
        this.props.onBlur();
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
        const arc = this.d3Arc(props.index,props.radius,props.arcWidth,props.angles[0],props.angles[1],props.padding);

        return (
            <g>
                <path className={classNames({ 'r-blur': this.props.blur })} onMouseEnter={this.hover} onMouseLeave={this.blur} style={{ fill: this.props.colour }} d={arc()}></path>
                <Label></Label>
            </g>
        );
    }
}

export default Track;