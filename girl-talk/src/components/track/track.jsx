import React, { Component } from 'react';
import classNames from 'classnames/bind';

import './track.scss';

class Track extends Component {

    constructor(props) {
        super(props);
        
        this.hover = this.hover.bind(this);
        this.blur = this.blur.bind(this);
    }

    hover() {
        this.props.onHover(this.props.index);
    }

    blur() {
        this.props.onBlur();
    }



    render() {

        return (
            <g>
                <path className={classNames({ 'r-blur': this.props.blur })} onMouseEnter={this.hover} onMouseLeave={this.blur} style={{ fill: this.props.colour }} d={this.props.path()}></path>
            </g>
        );
    }
}

export default Track;