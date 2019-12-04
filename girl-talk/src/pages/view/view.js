import React, { Component } from 'react';
import * as d3 from "d3";

import './view.scss';

import Record from "../../components/record/record";

class View extends Component {

    constructor(props) {
        super(props);
        this.params = this.props.match.params;
    }


    state = {
        tracks: []
    }

    async readJson(path) {
        return await d3.json(path);
    }

    async componentDidMount() {
        if (!this.params.album) {
            return;
        }

        let path = decodeURI(this.params.album).replace(" ", "_").toLowerCase();
        this.album = await this.readJson(`/data/${path}.json`);

        this.album.tracks.forEach(async (track) => {
            let data = await this.readJson(track.dataPath);

            let tracks = this.state.tracks;
            tracks.push(data);
            this.setState({ tracks });
        })
    }

    render() {
        return (
            <React.Fragment>
                <div className="v-background" style={{ backgroundImage: "url('../album_art/All_Day.jpg')" }}></div>
                <div className="centre">
                    {
                        this.state.tracks.map((track, i) => {
                            return <Record key={track.track} track={track} audioPath={this.album.tracks[i].audioPath} width="1000px" height="1000px"></Record>
                        })
                    }
                </div>
            </React.Fragment>
        );
    }
}

export default View;


