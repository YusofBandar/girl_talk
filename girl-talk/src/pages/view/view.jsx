import React, { Component } from 'react';
import * as d3 from "d3";

import './view.scss';

import Record from "../../components/record/record";

class View extends Component {

    constructor(props) {
        super(props);
        this.params = this.props.match.params;

        this.backgroundSyle = this.backgroundSyle.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }


    state = {
        tracks: [],
        backgroundY: 0
    }

    async readJson(path) {
        return await d3.json(path);
    }

    async componentDidMount() {
        if (!this.params.album) {
            return;
        }

        window.addEventListener('scroll', this.handleScroll);

        let path = decodeURI(this.params.album).replace(" ", "_").toLowerCase();
        this.album = await this.readJson(`/data/${path}.json`);

        this.album.tracks.forEach(async (track) => {
            let data = await this.readJson(track.dataPath);

            let tracks = this.state.tracks;
            tracks.push(data);
            this.setState({ tracks });
        })
    }

    handleScroll() {
        let top = window.pageYOffset || document.body.scrollTop;
        let recordsHeight = this.album.tracks.length * 2000;
        let dy = this.mapNumRange(top, 0, recordsHeight, 0, window.outerWidth + 500);

        this.setState({backgroundY : dy});
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    backgroundSyle(){
        if(!this.album) return {};
        return {
            backgroundImage: `url(${this.album.artWork})`,
            top: `${-(this.state.backgroundY)}px`,
            height: "4000px",
            width: "4000px"
        };
    }

    render() {
        return (
            <React.Fragment>
                <div className="r-background" style={this.backgroundSyle()}></div>
                <div className="r-screen" style={{height: "4000px", width:"4000px"}}></div>
                <div className="centre">
                    {
                        this.state.tracks.map((track, i) => {
                            return <div className="r-recordWrapper">
                            <Record key={track.track} track={track} audioPath={this.album.tracks[i].audioPath} width="1000px" height="1000px"></Record>
                            <div className="r-title">{track.track}</div>
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


