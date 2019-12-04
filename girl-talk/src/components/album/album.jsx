import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import * as d3 from "d3";
import classNames from 'classnames/bind';

import './album.scss';

import Record from "../record/record";

class Album extends Component {

    state = {
        size: 350,
        hover: false,
    }

    constructor(props) {
        super(props);

        this.album = this.props.album;
    
        this.hover = this.hover.bind(this);
        this.blur = this.blur.bind(this);
    }

    hover() {
        this.setState({ hover: true });
    }

    blur() {
        this.setState({ hover: false });
    }

    

    render() {
        return (
            <React.Fragment>
                {
                    <Link to={`/view/${this.album.title}`}>
                        <img className={classNames({ 'v-album': true, "r-bigger": this.state.hover })} 
                        src={this.album.artWork} onMouseOver={this.hover} onMouseOut={this.blur} ></img>
                    </Link>
                }
            </React.Fragment>
        );
    }
}

export default Album;