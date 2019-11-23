import React, { Component } from 'react';
import * as d3 from "d3";

import './album.scss';

import Record from "../record/record";

class Album extends Component {

    state = {
        tracks: []
    }

    constructor(props) {
        super(props);
        this.album = this.props.album;
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


    render() {
        return (
            <div>
                {
                    this.state.tracks.map((track) => {
                        return <Record key={track.title} track={track} width="1000px" height="1000px"></Record>
                    })
                }
            </div>
        );
    }
}

export default Album;