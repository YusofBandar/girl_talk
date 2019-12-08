import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import classNames from 'classnames/bind';

import './album.scss';

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

    hover() {
        this.setState({ hover: true });
    }

    blur() {
        this.setState({ hover: false });
    }

}

export default Album;