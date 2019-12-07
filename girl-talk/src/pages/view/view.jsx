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
        this.screenStyle = this.screenStyle.bind(this);

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

       let path = decodeURI(this.params.album).replace(/\s/g, "_").toLowerCase();
        this.album = await this.readJson(`/data/${path}.json`);
        
        window.addEventListener('scroll', this.handleScroll);

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
        const size = this.screenSize();
        
        return {
            backgroundImage: `url(${this.album.artWork})`,
            top: `${-(this.state.backgroundY)}px`,
            width: `${size[0]}px`,
            height: `${size[1]}px`
        };
    }

    screenSize(){
        let height = Math.max( document.body.scrollHeight, document.body.offsetHeight);
        let width = Math.max( document.body.scrollWidth, document.body.offsetWidth);

        return [width,height];
    }

    screenStyle(){
        const size = this.screenSize();
        return {
            width: `${size[0]}px`,
            height: `${size[1]}px`
        };
    }

    render() {
        return (
            <React.Fragment>
                <div className="r-background" style={this.backgroundSyle()}></div>
                <div className="r-screen" style={this.screenStyle()}></div>
                <div className="centre">
                    {
                        this.state.tracks.map((track, i) => {
                            return <div  key={track.track} className="r-recordWrapper">
                            <Record track={track} audioPath={this.album.tracks[i].audioPath} width="1000px" height="1000px"></Record>
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


