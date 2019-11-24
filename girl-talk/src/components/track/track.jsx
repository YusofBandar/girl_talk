import React, { Component } from 'react';

import './track.scss';

class Track extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <g>
                <path onMouseEnter={this.props.hover} onMouseLeave={this.props.blur} style={{fill : this.props.colour}} d={this.props.path()}></path>
            </g>
        );
    }
}

export default Track;