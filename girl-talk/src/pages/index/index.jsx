import React, { Component } from 'react';
import * as d3 from "d3";

import Album from "../../components/album/album";

import './index.scss';

class Index extends Component {

  albumPaths = ["./data/all_day.json", "./data/feed_the_animals.json"];

  state = {
    albums: []
  }

  async componentWillMount() {
    this.albumPaths.forEach(async (path) => {
      let album = await this.readJson(path);
      let albums = this.state.albums;
      albums.push(album);
      this.setState({ albums });
    })
  }

  async readJson(path) {
    return await d3.json(path);
  }

  render() {
    return (
      <React.Fragment>
        <div className="centre">
          {
            this.state.albums.map((album) => {
              return <Album key={album.title} album={album}></Album>
            })
          }
        </div>
        <footer> <a href="https://github.com/YusofBandar" target="_blank">GitHub</a> | <a href="https://twitter.com/BandarYusof" target="_blank">Twitter</a></footer>
      </React.Fragment>
    );
  }
}

export default Index;


