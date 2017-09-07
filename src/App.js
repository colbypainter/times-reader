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
      message: "",
      results: []
    };

    this.changeSection = this.changeSection.bind(this);
    this.apiRequest = this.apiRequest.bind(this);
    this.updateResults = this.updateResults.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
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
    var data;
    function getRequest(url, callback) {  
      request.get({
          url: myUrl,
          qs: {
            'api-key': "59044bcf3f134f5995553747094e4035"
          },
        }, function(err, response, body) {
            console.log(err);
            if(err) {
              console.log("Error: " + err);
              callback(err);
            }
            // TODO I don't like this dual error handling, short-term fix. Revisit this.
            try {
              data = JSON.parse(body);
              console.log(data);
              callback(data);
            } catch(e) {
              console.log(e.message);
              callback(e.message);
            }
        });
      }
    getRequest(myUrl, this.updateResults);
  }
  
  updateMessage(msg) {
    var newMessage = msg;
    this.setState((state, props) => ({
      message: newMessage
    }));
  }
  
  updateResults(data) {
    var newResults = data;
    this.setState((state, props) => ({
      results: newResults
    }));
    console.log(this.state.results);
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
          <Results section={this.state.section} 
                    message={this.state.message}
                    results={this.state.results}
                    apiRequest={this.apiRequest}
                    changeSection={this.changeSection}
                    updateMessage={this.updateMessage}
                    updateResults={this.updateResults} />
        </div>
    );
  }
  
}

class Results extends Component {
  
  componentDidMount() {
    this.props.apiRequest();
  }
  
  render() {
    return(
        <h3>Test</h3>
      );
  }
}

export default App;
