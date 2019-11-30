import React, { Component } from 'react';
import * as d3 from "d3";

import './record.scss';

import Track from "../track/track";
import Timeline from "./timeline/timeline";

class Record extends Component {

    width = 500;
    height = 500;

    innerPadding = this.width / 15;
    outerPadding = this.width / 100;

    radius = this.width / 2;

    colours = ["#9bd5f3", "#ecb60f", "#b75dc5", "#4dbd2c", "#b72d44"];

    state = {
        hoverTrack: -1,
        elapsed: 1
    }

    componentDidMount() {
        //this.play();
    }

    constructor(props) {
        super(props);
        this.track = props.track;

        this.arcWidth = this.arcWidth.bind(this);
        
        this.arcHover = this.arcHover.bind(this);
        this.arcBlur = this.arcBlur.bind(this);

        this.play = this.play.bind(this);
    }

    play(){
        let audio = new Audio(this.props.audioPath);
        this.audio = audio;

        audio.addEventListener("loadedmetadata", () => {
            audio.play();

            let timer = d3.timer((elapsed) => {
                elapsed = (audio.currentTime * 1000) * 10;
                this.setState({elapsed : elapsed});

                 // if at the end of track remove all arcs and labels
                 if (elapsed > this.track.duration) {
                    timer.stop()
                }
            })
        });
    }

    arcWidth(radius, innerPadding, outerPadding, numTracks) {
        const arcWidth = (((radius * 2) - (outerPadding + innerPadding + 50)) / 2) / numTracks;
        return arcWidth.toFixed(2);
    }

    arcHover(index) {
        this.setState({ hoverTrack: index })
    }

    arcBlur() {
        this.setState({ hoverTrack: -1 });
    }

    render() {
        const track = this.track;
        const tracks = this.track.tracks;

        const arcWidth = this.arcWidth(this.radius, this.innerPadding, this.outerPadding, tracks.length)

        return (
            <svg className="v-record" viewBox="0 0 1000 1000" width={this.props.width} height={this.props.height}>
                <g className="r-wrapper" onClick={this.play}>
                    <circle className="r-disk" r={this.width / 2}></circle>
                    <circle className="r-innerDisk" r={this.innerPadding}></circle>
                    {
                        tracks.map((sample, index) => {
                            let blur = false;

                            if (index !== this.state.hoverTrack && this.state.hoverTrack > -1) {
                                blur = true;
                            }

                            const config = {
                                index: index,
                                radius: this.radius,
                                arcWidth: arcWidth,
                                padding: this.outerPadding,
                                colour: this.colours[index % this.colours.length]
                            }

                            return <Track key={sample.track} elapsed={this.state.elapsed} track={sample} duration={track.duration}
                                blur={blur} onHover={this.arcHover} onBlur={this.arcBlur} config={config} 
                            ></Track>
                        })
                    }
                    <Timeline radius={this.radius} duration={track.duration} elapsed={this.state.elapsed}></Timeline>
                </g>
            </svg>
        );
    }
}

export default Record;