import React, { Component } from 'react';
import * as d3 from "d3";

import './view.scss';

import Record from "../../components/record/record";

class View extends Component {

    constructor(props) {
        super(props);
        this.params = this.props.match.params;

        this.screenSize = this.screenSize.bind(this);
        this.backgroundSyle = this.backgroundSyle.bind(this);

        this.loadAudio = this.loadAudio.bind(this);

        this.handleScroll = this.handleScroll.bind(this);
    }


    state = {
        tracks: [],
        backgroundY: 0,
        width: 0,
        height: 0
    }

    async readJson(path) {
        return await d3.json(path);
    }

    async componentDidMount() {
        if (!this.params.album) {
            return;
        }

        let path = decodeURI(this.params.album).replace(/\s/g, "_").toLowerCase();
        this.album = await this.readJson(`/data/${path}.json`);

        this.screenSize();
        window.addEventListener('resize', this.screenSize);
        window.addEventListener('scroll', this.handleScroll);

        this.album.tracks.forEach(async (track) => {
            let data = await this.readJson(track.dataPath);
            let audio = await this.loadAudio(track.audioPath);

            let tracks = this.state.tracks;
            tracks.push({ data, audio });
            this.setState({ tracks });
            this.screenSize();
        })
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.screenSize);
    }

    loadAudio(audioPath) {
        return new Promise((resolve, reject) => {
            let audio = new Audio(audioPath);
            audio.addEventListener("canplay", event => {
                this.audio = audio;
                resolve(audio);
            });
            audio.load();
        })
    }

    handleScroll() {
        let top = window.pageYOffset || document.body.scrollTop;
        let recordsHeight = this.album.tracks.length * 2000;
        let dy = this.mapNumRange(top, 0, recordsHeight, 0, window.outerWidth + 500);

        this.setState({ backgroundY: dy });
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    backgroundSyle(width, height) {
        if (!this.album) return {};

        return {
            backgroundImage: `url(${this.album.artWork})`,
            top: `${-(this.state.backgroundY)}px`,
            width: `${width}px`,
            height: `${height}px`
        };
    }

    screenSize() {
        let height = Math.max(document.body.scrollHeight, document.body.offsetHeight);
        let width = Math.max(document.body.scrollWidth, document.body.offsetWidth);

        this.setState({ width, height });
    }

    render() {
        return (
            <React.Fragment>
                <div className="r-background" style={this.backgroundSyle(this.state.width, this.state.height)}></div>
                <div className="r-screen" style={{ width: this.state.width, height: this.state.height }}></div>
                <div className="centre">
                    {
                        this.state.tracks.map((track, i) => {
                            return <div key={track.data.track} className="r-recordWrapper">
                                <Record track={track.data} audio={track.audio} width="1000px" height="1000px"></Record>
                                <div className="r-title">{track.data.track}</div>
                            </div>
                        })
                    }

                </div>
            </React.Fragment>
        );
    }

    mapNumRange(num, inMin, inMax, outMin, outMax) {
        return (((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin);
    }
}

export default View;


