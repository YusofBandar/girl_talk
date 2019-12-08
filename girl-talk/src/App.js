import React, { Component } from 'react';
import { HashRouter, Route} from "react-router-dom";

import Index from "./pages/index/index";
import View from "./pages/view/view";

import './app.scss';

class App extends Component {
  render() {
    return (
      <HashRouter>
       <Route exact path="/" component={Index} />
       <Route path="/view/:album" component={View} />
     </HashRouter>
    );
  }
}

export default App;


