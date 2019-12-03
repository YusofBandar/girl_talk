import React, { Component } from 'react';

import { Redirect,Route, BrowserRouter as Router, Switch } from "react-router-dom"

import Index from "./pages/index";

import './app.scss';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/index" component={Index} />
          <Redirect exact to="/index" />
        </Switch>

      </Router>
    );
  }
}

export default App;


