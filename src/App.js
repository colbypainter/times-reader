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
      results: [],
      searchInput: ""
    };

    this.changeSection = this.changeSection.bind(this);
    this.apiRequest = this.apiRequest.bind(this);
    this.updateResults = this.updateResults.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
    this.updateSearchInput = this.updateSearchInput.bind(this);
  }
  
  componentDidMount() {
    this.apiRequest();
  }
  
  changeSection(event) {
    var newSection = event.target.value;
    this.setState({
      section: newSection,
      searchInput: ""
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
              // Keep only the array of article results, ignore the rest of the data
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
  }
  
  updateSearchInput(event) {
    var newSearchInput = event.target.value;
    this.setState((state, props) => ({
      searchInput: newSearchInput
    }));
  }
  
  render() {
    return (
        <div className="App">
          <div className="header">
            <Header />
          </div>
          <div className="container">
            <Row>
              <Sections section={this.state.section} 
                        results={this.state.results}
                        searchInput={this.state.searchInput} 
                        changeSection={this.changeSection} 
                        updateResults={this.updateResults}
                        updateSearchInput={this.updateSearchInput} />
                        
              <SearchInput section={this.state.section} 
                          results={this.state.results}
                          searchInput={this.state.searchInput} 
                          changeSection={this.changeSection} 
                          updateResults={this.updateResults}
                          updateSearchInput={this.updateSearchInput} />
            </Row>
            <Row>
              <Results section={this.state.section} 
                        message={this.state.message}
                        results={this.state.results}
                        searchInput={this.state.searchInput} 
                        apiRequest={this.apiRequest}
                        changeSection={this.changeSection}
                        updateMessage={this.updateMessage}
                        updateResults={this.updateResults}
                        updateSearchInput={this.updateSearchInput} />
            </Row>
          </div>
          <div>
            <Footer />
          </div>
        </div>
    );
  }
  
}

class Header extends Component {
  render() {
    return(
      <Navbar inverse staticTop>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="https://github.com/colbypainter"><span id="header_link">NYT Web Reader</span></a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
      </Navbar>
      );
  }
}

class Sections extends Component {
  render() {
    return(
      <Col md={6}>
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

class SearchInput extends Component {
  render() {
    return(
      <Col md={6}>
        <ControlLabel>Search</ControlLabel>
        <FormControl type="text" id="search_input" value={this.props.searchInput} results={this.props.results} 
                                                        onChange={this.props.updateSearchInput} />
      </Col>
    );
  }
}

class Results extends Component {
  
  render() {
    // Get the results from the API call
    var res = this.props.results;
    // Create an empty array in case we filter via search. 
    // Don't filter values out of res because it will alter state.results. 
    // We want full state.results to remain for re-rendering for new search input without a new API call
    var filteredRes = [];
    // Force input to lower case
    var searchInput = _.toLower(this.props.searchInput);
    // If there's any search input, use it to filter
    if (searchInput !== "") {
      var searchCount = 0;
      for(var i=0; i < res.length; i++) {
        // Mash all the displayed attributes together into a string for comparison
        var resultString = (res[i].title + res[i].byline + res[i].abstract);
        resultString = _.toLower(resultString);
        // See if input matches our big string
        if(_.includes(resultString, searchInput)) {
          // Add matches to our filter array
          filteredRes.push(res[i]);
          searchCount++;
        } 
      }
    }
    // Stories will hold either the unfiltered or filtered results
    var stories;
    // If we filtered at all, use that set of results. Otherwise use the full set.
    if (searchInput !== "") { 
      stories = filteredRes;
    } else {
      stories = res;
    }
    var storyCards = [];
    // For now, cap the results at 10. Handle this differently to provide More Stories button
    var maxStories = 10;
    if (stories.length < 10) {
      maxStories = stories.length;
    }
    
    if (stories.length === 0) {
      return(
        <Panel className="Results-panel" header="TOP STORIES">
          <Media>
            <Media.Body>
              <Media.Heading>No results match your search. Sorry!</Media.Heading>
            </Media.Body>
          </Media>
        </Panel>
        );
    }
    for(var j=0; j < maxStories; j++) {
      try {
        var date = new Date(stories[j].published_date);
        //date = Date.parse(date);
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var year = date.getFullYear();
        
        stories[j].published_date = (month + "/" + day + "/" + year);

        //var time = date.toLocaleTimeString('en-US', options);
        //console.log(month + "/" + day + "/" + year + " " + time);
        
        var thumbnail = stories[j].multimedia["1"].url;
      } catch(e) {
        console.log(e.message);
        // TODO set a default thumbnail
        thumbnail = "";
      }
      storyCards.push(
      
      <Panel>
        <Media>
          <Media.Left>
            <img width={150} height={150} src={thumbnail} alt="NYT"/>
          </Media.Left>
          <Media.Body>
            <Media.Heading>{stories[j].title}</Media.Heading>
            <p>{stories[j].byline}</p>
            <p>Published: {stories[j].published_date}</p>
            <p>{stories[j].abstract}</p>
            <Button className="times-link-btn" href={stories[j].url}>Read at NYTimes.com</Button>
          </Media.Body>
        </Media>
      </Panel>
    
      );
    }
    return(
      <Panel className="Results-panel" header="TOP STORIES">
        {storyCards}
      </Panel>
      );
  }
}

class Footer extends Component {
  render() {
    return(
      <Grid>
        <hr />
        <footer>
          <a href="https://www.linkedin.com/in/colbypainter">Created by: Colby Painter</a>
        </footer>
      </Grid>
      );
  }
}

export default App;
