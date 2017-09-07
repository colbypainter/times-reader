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
    this.setState({
      section: newSection
    }, function(){
      console.log("test: " + this.state.section);
      this.apiRequest();
    });
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
          <Sections section={this.state.section} 
                    results={this.state.results}
                    changeSection={this.changeSection} 
                    updateResults={this.updateResults}/>
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
        <FormGroup controlId="sectionSelectGroup">
          <ControlLabel>Choose Section</ControlLabel>
          <FormControl componentClass="select" onChange={this.props.changeSection}>
            <option value="home" eventKey={1} >Home</option>
            <option value="opinion" eventKey={2} >Opinion</option>
            <option value="world" eventKey={3} >World</option>
            <option value="national" eventKey={4} >National</option>
            <option value="politics" eventKey={5} >Politics</option>
            <option value="upshot" eventKey={6} >Upshot</option>
            <option value="nyregion" eventKey={7} >NY Region</option>
            <option value="business" eventKey={8} >Business</option>
            <option value="technology" eventKey={9} >Technology</option>
            <option value="science" eventKey={10} >Science</option>
            <option value="health" eventKey={11} >Health</option>
            <option value="sports" eventKey={12} >Sports</option>
            <option value="arts" eventKey={13} >Arts</option>
            <option value="books" eventKey={14} >Books</option>
            <option value="movies" eventKey={15} >Movies</option>
            <option value="theater" eventKey={16} >Theater</option>
            <option value="sundayreview" eventKey={17} >Sunday Review</option>
            <option value="fashion" eventKey={18} >Fashion</option>
            <option value="tmagazine" eventKey={19} >T Magazine</option>
            <option value="food" eventKey={20} >Food</option>
            <option value="travel" eventKey={21} >Travel</option>
            <option value="magazine" eventKey={22} >Magazine</option>
            <option value="realestate" eventKey={23} >Real Estate</option>
            <option value="automobiles" eventKey={24} >Automobiles</option>
            <option value="obituaries" eventKey={25} >Obituaries</option>
            <option value="insider" eventKey={26} >Insider</option>
          </FormControl>
        </FormGroup>


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
