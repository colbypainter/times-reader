import React, { Component } from 'react';
import './App.css';
import 'roboto-npm-webfont';
import { Grid, Row, Col, Nav, NavItem, Navbar, ListGroup, ListGroupItem, 
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
          <Sections />
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

class Sections extends Component {
  render() {
    return(
      <Col md={2}>
        <Nav bsStyle="pills" stacked activeKey={1}>
          <NavItem eventKey={1} >Home</NavItem>
          <NavItem eventKey={2} >Opinion</NavItem>
          <NavItem eventKey={3} >World</NavItem>
          <NavItem eventKey={4} >National</NavItem>
          <NavItem eventKey={5} >Politics</NavItem>
          <NavItem eventKey={6} >Upshot</NavItem>
          <NavItem eventKey={7} >NY Region</NavItem>
          <NavItem eventKey={8} >Business</NavItem>
          <NavItem eventKey={9} >Technology</NavItem>
          <NavItem eventKey={10} >Science</NavItem>
          <NavItem eventKey={11} >Health</NavItem>
          <NavItem eventKey={12} >Sports</NavItem>
          <NavItem eventKey={13} >Arts</NavItem>
          <NavItem eventKey={14} >Books</NavItem>
          <NavItem eventKey={15} >Movies</NavItem>
          <NavItem eventKey={16} >Theater</NavItem>
          <NavItem eventKey={17} >Sunday Review</NavItem>
          <NavItem eventKey={18} >Fashion</NavItem>
          <NavItem eventKey={19} >T Magazine</NavItem>
          <NavItem eventKey={20} >Food</NavItem>
          <NavItem eventKey={21} >Travel</NavItem>
          <NavItem eventKey={22} >Magazine</NavItem>
          <NavItem eventKey={23} >Real Estate</NavItem>
          <NavItem eventKey={24} >Automobiles</NavItem>
          <NavItem eventKey={25} >Obituaries</NavItem>
          <NavItem eventKey={26} >Insider</NavItem>
        </Nav>
      </Col>
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
      <Col md={8}>
        {storyCards}
      </Col>
      );
  }
}

export default App;
