import React, { Component } from 'react';
import './App.css';
import 'roboto-npm-webfont';
import { Grid, Row, Col, Navbar, ListGroup, ListGroupItem, 
        Button, Form, FormControl, FormGroup, ControlLabel, HelpBlock, 
        Alert, Table, Panel } from 'react-bootstrap';


var request = require('request');
var _ = require('lodash');

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      section: "home",
      results: []
    };

    this.changeSection = this.changeSection.bind(this);
    this.apiRequest = this.apiRequest.bind(this);
    this.updateResults = this.updateResults.bind(this);
  }

  componentDidMount() {
    this.apiRequest();
  }
  
  changeSection(event) {
    var newSection = event.target.value;
    this.setState((state, props) => ({
      section: newSection
    }));
  }
  
  apiRequest() {
    var myUrl = "https://api.nytimes.com/svc/topstories/v2/" + this.state.section + ".json";
    console.log(myUrl);
    request.get({
      url: myUrl,
      qs: {
        'api-key': "59044bcf3f134f5995553747094e4035"
      },
    }, function(err, response, body) {
      if (err) {
        console.log(err);
        //return;
      }
      console.log(body);
      body = JSON.parse(body);
      console.log(body);
      this.updateResults(body);
    });
  }
  
  updateResults(data) {
    var newResults = data;
    this.setState((state, props) => ({
      results: newResults
    }));
  }
  
  render() {
    return (
        <div className="App">
          <div className="header">
            <h2>NYT Web Reader</h2>
          </div>
          <p className="App-intro">
            Read the news...for yer health!
          </p>
        </div>
    );
  }
}

export default App;
