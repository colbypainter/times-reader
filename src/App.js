import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './App.css';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <div className="App-header">
            <h2>NYT Web Reader</h2>
          </div>
          <p className="App-intro">
            Read the news...for yer health!
          </p>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
