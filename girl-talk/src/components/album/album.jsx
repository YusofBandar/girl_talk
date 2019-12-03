import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import * as d3 from "d3";
import classNames from 'classnames/bind';

import './album.scss';

import Record from "../record/record";

class Album extends Component {

    state = {
        tracks: [],
        size: 350,
        hover: false,
    }

    constructor(props) {
        super(props);

        this.album = this.props.album;
        this.renderTracks = this.renderTracks.bind(this);

        this.hover = this.hover.bind(this);
        this.blur = this.blur.bind(this);
    }

    hover() {
        this.setState({ hover: true });
    }

    blur() {
        this.setState({ hover: false });
    }

    async readJson(path) {
        return await d3.json(path);
    }

    async componentWillMount() {
        this.album.tracks.forEach(async (track) => {
            let data = await this.readJson(track.dataPath);
            let tracks = this.state.tracks;
            tracks.push(data);
            this.setState({ tracks });
        })
    }

    renderTracks() {
        if (this.state.clicked) {
            return this.state.tracks.map((track, i) => {
                return <Record key={track.track} track={track} audioPath={this.album.tracks[i].audioPath} width="1000px" height="1000px"></Record>
            })
        }
    }


    render() {
        return (
            <React.Fragment>
                {
                    <Link to="/view">
                        <img className={classNames({ 'v-album': true, "r-bigger": this.state.hover })} 
                        src={this.album.artWork} onMouseOver={this.hover} onMouseOut={this.blur} ></img>
                    </Link>
                }
            </React.Fragment>
        );
    }
}

export default Album;