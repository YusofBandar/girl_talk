import React, { Component } from 'react';

import './track.scss';

class Track extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <g>
                <path style={{fill : this.props.colour}}></path>
            </g>
        );
    }
}

export default Track;