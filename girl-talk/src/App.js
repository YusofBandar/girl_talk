import React, { Component } from 'react';
import * as d3 from "d3";

import Album from "./components/album/album";

import './app.scss';

class App extends Component {

  albumPaths = ["./data/all_day.json"];

  state = {
    albums: []
  }

  async readJson(path) {
    return await d3.json(path);
  }

  async componentWillMount() {
    this.albumPaths.forEach(async (path) => {
      let album = await this.readJson(path);
      let albums = this.state.albums;
      albums.push(album);
      this.setState({ albums });
    })
  }

  render() {
    return (
      <div className="centre">
        {
          this.state.albums.map((album) => {
            return <Album key={album.title} album={album}></Album>
          })
        }
        {
          this.state.albums.map((album) => {
            return <Album key={album.title} album={album}></Album>
          })
        }
      </div>
    );
  }
}

export default App;


