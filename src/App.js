import React, { Component, Fragment } from 'react';
import logo from './logo.svg';
import SimpleAppBar from './components/ui/SimpleAppBar'
import Converter from './components/Converter'
import './App.css';

class App extends Component {
  render() {
    return (
      <Fragment>
        <SimpleAppBar />
        <Converter />
      </Fragment>
    );
  }
}

export default App;
