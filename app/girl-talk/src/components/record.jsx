import React, { Component } from 'react';

import './record.scss';

class Record extends Component {

    width = 500;
    height = 500;
    innerPadding = this.width/15;
    outerPadding = this.width/100;
    radius = this.width/2;

    constructor(props) {
        super(props);
        this.tracks = this.props.tracks || [];
        this.arcWidth = this.arcWidth.bind(this);
      }

    arcWidth(radius,innerPadding,outerPadding,numTracks){
        const arcWidth = (((radius * 2) - (outerPadding + innerPadding + 50)) / 2) / numTracks;
        return arcWidth.toFixed(2);
    }

    render() {

        console.log(this.arcWidth(this.radius,this.innerPadding,this.outerPadding,this.tracks.length))

        return (
            <svg className="v-record" viewBox="0 0 1000 1000" width="1066" height="1066">
                <g className="r-wrapper">
                    <circle className="r-disk" r={this.width/2}></circle>
                    <circle className="r-innerDisk" r={this.innerPadding}></circle>
                </g>
            </svg>
        );
    }
}

export default Record;