import React, { Component } from 'react';
import * as d3 from "d3";

import './view.scss';

class View extends Component {

    constructor(props){
        super(props);
        console.log(this.props.match.params);
    }
    render() {
        return (
            <div className="centre">
                <h2>TESTING VIEW PAGE</h2>
            </div>
        );
    }
}

export default View;


