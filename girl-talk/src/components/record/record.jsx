import React, { Component } from 'react';
import * as d3 from "d3";

import './record.scss';

import Track from "../track/track";
import Timeline from "./timeline/timeline";

class Record extends Component {

    PAUSED = 0;
    PLAYING = 1;

    width = 500;
    height = 500;

    innerPadding = this.width / 15;
    outerPadding = this.width / 100;

    radius = this.width / 2;

    colours = ["#9bd5f3", "#ecb60f", "#b75dc5", "#4dbd2c", "#b72d44"];

    state = {
        hoverTrack: -1,
        elapsed: 1,
        end: false,
        state: this.PAUSED
    }

    componentDidMount() {
        //this.play();
        this.loadAudio();
    }

    constructor(props) {
        super(props);
        this.track = props.track;

        this.arcWidth = this.arcWidth.bind(this);

        this.arcHover = this.arcHover.bind(this);
        this.arcBlur = this.arcBlur.bind(this);

        this.loadAudio = this.loadAudio.bind(this);
        this.timelineDrag = this.timelineDrag.bind(this);

        this.recordClick = this.recordClick.bind(this);
        this.play = this.play.bind(this);
        this.pause = this.pause.bind(this);
    }


    recordClick() {
        if (this.state.state === this.PAUSED) {
            this.play();
            this.setState({ state: this.PLAYING });
        } else {
            this.pause();
            this.setState({ state: this.PAUSED });
        }
    }

    pause() {
        this.setState({state: this.PAUSED});
        this.audio.pause();
    }

    loadAudio() {
        let audio = new Audio(this.props.audioPath);
        this.audio = audio;
    }

    play() {
        this.audio.play()
        let timer = d3.timer(() => {
            let elapsed = (this.audio.currentTime * 1000);
            this.setState({elapsed : elapsed});
            
            // if at the end of track remove all arcs and labels
            if (elapsed > this.track.duration) {
                timer.stop()

                d3.timeout(() => {
                    this.setState({ end: true })

                    d3.timeout(() => {
                        this.setState({elapsed : 0, end:false})
                    }, 3000)
                }, 5000)

            }
        })
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

    timelineDrag(time){
        this.audio.currentTime = time/1000;

        let elapsed = (this.audio.currentTime * 1000);
        this.setState({elapsed : elapsed});
    }


    render() {
        const track = this.track;
        const tracks = this.track.tracks;

        const arcWidth = this.arcWidth(this.radius, this.innerPadding, this.outerPadding, tracks.length)

        return (
            <svg className="v-record" viewBox="0 0 1000 1000" width={this.props.width} height={this.props.height}>
                <g className="r-wrapper" onClick={this.recordClick}>
                    <circle className="r-disk" r={this.width / 2}></circle>
                    <circle className="r-innerDisk" r={this.innerPadding}></circle>
                    <circle r={this.innerPadding/3}></circle>
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
                                blur={blur} end={this.state.end} onHover={this.arcHover} onBlur={this.arcBlur} config={config}
                            ></Track>
                        })
                    }
                    <Timeline radius={this.radius} duration={track.duration} elapsed={this.state.elapsed} onDrag={this.timelineDrag}></Timeline>
                </g>
            </svg>
        );
    }
}

export default Record;