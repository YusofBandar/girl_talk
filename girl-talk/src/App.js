import React, { Component } from 'react';

import { Redirect,Route, BrowserRouter as Router, Switch } from "react-router-dom"

import Index from "./pages/index/index";
import View from "./pages/view/view";

import './app.scss';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/index" component={Index} />
          <Route path="/view/:track" component={View} />
          <Redirect exact to="/index" />
        </Switch>
      </Router>
    );
  }
}

export default App;


