import React, { Component } from 'react';

import './record.scss';

import Track from "../track/track";

class Record extends Component {

    width = 500;
    height = 500;
    
    innerPadding = this.width / 15;
    outerPadding = this.width / 100;
    
    radius = this.width / 2;
    
    colours = ["#9bd5f3", "#ecb60f", "#b75dc5", "#4dbd2c", "#b72d44"];

    constructor(props) {
        super(props);
        this.tracks = props.track.tracks;
        this.arcWidth = this.arcWidth.bind(this);
    }

    arcWidth(radius, innerPadding, outerPadding, numTracks) {
        const arcWidth = (((radius * 2) - (outerPadding + innerPadding + 50)) / 2) / numTracks;
        return arcWidth.toFixed(2);
    }

    render() {

        console.log(this.arcWidth(this.radius, this.innerPadding, this.outerPadding, this.tracks.length))

        return (
            <svg className="v-record" viewBox="0 0 1000 1000" width={this.props.width} height={this.props.height}>
                <g className="r-wrapper">
                    <circle className="r-disk" r={this.width / 2}></circle>
                    <circle className="r-innerDisk" r={this.innerPadding}></circle>
                    {
                        this.tracks.map((track,index) => {
                            return <Track key={track.title} colour={this.colours[index % this.colours.length]}></Track>
                        })
                    }
                </g>
            </svg>
        );
    }
}

export default Record;