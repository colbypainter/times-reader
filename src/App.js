import React, { Component } from 'react';
import './App.css';
import 'roboto-npm-webfont';
import { Grid, Row, Col, Navbar, ListGroup, ListGroupItem, 
        Button, Form, FormControl, FormGroup, ControlLabel, HelpBlock, 
        Alert, Table, Panel, Media, MediaLeft, MediaBody, MediaHeading } from 'react-bootstrap';


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
              // Keep only the array of article results
              callback(data.results);
            } catch(e) {
              console.log(e.message);
              callback(e.message);
            }
        });
      }
    getRequest(myUrl, this.updateResults);
  }
  
  // Not currently using this 
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
  
  render() {
    var results = this.props.results;
    var storyCards = [];
    // For now, cap the results at 10. Handle this differently to provide More Stories button
    var maxStories = 10;
    if (results.length < 10) {
      maxStories = results.length;
    }
    for(var i=0; i < maxStories; i++) {
      try {
        var thumbnail = results[i].multimedia["1"].url;
      } catch(e) {
        console.log(e.message);
        thumbnail = "";
      }
      storyCards.push(
      
      <Panel>
        <Media>
          <Media.Left>
            <img width={150} height={150} src={thumbnail} alt="NYT"/>
          </Media.Left>
          <Media.Body>
            <Media.Heading>{results[i].title}</Media.Heading>
            <p>{results[i].url}</p>
            <p>{results[i].byline}</p>
            <p>{results[i].published_date}</p>
            <p>{results[i].abstract}</p>
          </Media.Body>
        </Media>
      </Panel>
    
      );
    }
    return(
      <div>
        {storyCards}
      </div>
      );
  }
}

export default App;
