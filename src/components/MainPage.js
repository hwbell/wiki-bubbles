import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// components 
import { Button, Form, FormGroup, Input } from 'reactstrap';
import ModalButton from './ModalButton';
import TopHits from './TopHits';
import SiteInformation from './SiteInformation';
import SearchResults from './SearchResults';
import TopCountries from './TopCountries';

// functions
import {
  getSearchFormatDate
} from '../functions/dataTools'

// styling
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';

// animation with pose
// define the container with children behavior and then the children
// with enter / exit information
import posed from 'react-pose';

const Container = posed.div({
  enter: { staggerChildren: 50 },
  exit: { staggerChildren: 50, staggerDirection: -1 }
});

const Div = posed.div({
  enter: { x: 0, opacity: 1 },
  exit: { x: 0, opacity: 0 }
});

const Hr = posed.hr({
  enter: { x: 0, opacity: 1 },
  exit: { x: 0, opacity: 0 }
});

var Rainbow = require('rainbowvis.js');

const fetch = require('node-fetch');


export default class MainPage extends Component {

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getSearchResults = this.getSearchResults.bind(this);

    this.state = {
      search: 'mars'
    }

  }

  componentDidMount() {
    this.getSearchResults(this.state.search);
  }




  // for the titles and snippets
  getSearchResults(search) {
    // const search = 'mogget';
    const targetUrl = "https://en.wikipedia.org/w/api.php?action=query&meta=siteinfo&siprop=statistics&generator=search&prop=extracts&exchars=450&explaintext=1&exlimit=10&exintro=1&format=json&sortby=relevance&origin=*&gsrsearch="
    const searchUrl = targetUrl + search;

    // make the fetch to the api 
    fetch(searchUrl, { method: 'GET' })
      .then(res => res.json()) // expecting a json response
      .then((json) => {
        console.log(json)

        // parse the site info, from passing the siprop=statistics in the url
        // just need to add commas to the gigantic numbers
        let stats = json.query.statistics;
        Object.keys(stats).forEach((stat) => {
          let number = stats[`${stat}`];
          stats[`${stat}`] = number.toLocaleString();
        })


        // now sort the articles by the index property
        let pages = json.query.pages;
        let pageKeys = Object.keys(pages);
        let sortedPages = [];

        for (let i = 0; i < pageKeys.length; i++) {
          // for each number find the result with that index and add to new array
          let sortedIndex = i;

          for (let j = 0; j < pageKeys.length; j++) {

            // get the value
            let key = pageKeys[j];
            let value = pages[`${key}`].index;

            // compare
            if (sortedIndex === value) {
              sortedPages.push(pages[`${key}`])
            }
          }

        }

        // save to state
        this.setState({
          pages: sortedPages,
          stats
          // search
        });

      })

      .catch(e => {
        console.log(e);
        return e;
      });


  }

  handleChange(value) {

    this.setState({
      search: value
    });

    // navigate back to search
    const searchNode = ReactDOM.findDOMNode(this.refs.search);
    window.scrollTo({
      top: searchNode.offsetTop,
      left: 0,
      behavior: 'smooth'
    });
  }

  handleSubmit(e) {
    if (e) { e.preventDefault(); }
    this.getSearchResults(this.state.search);
  }

  render() {

    return (
      // convers the whole screen
      <Container style={styles.container}>

        {/* use second container 
          to make margin of the content simpler
         */}
        <div style={styles.contentContainer}>

          {this.state.stats &&
            <SiteInformation
              stats={this.state.stats}
            />}

          <Hr id="search" ref="search"></Hr>

          <Div style={styles.searchContainer}>

            <p className="text-center" style={styles.title}>
              Search the encyclopedia
            </p>

            <Form className="row" style={styles.input} onSubmit={this.handleSubmit}>
              <FormGroup>
                <Input className="input" style={styles.searchInput} type="text" name="name" id="contactname" placeholder={this.state.search}
                  onChange={(e) => this.handleChange(`${e.target.value}`)}
                />
              </FormGroup>

              <Button color="link"
                type="submit"
                style={styles.button}>
                <i className={`fas fa-search-plus`} style={styles.icon}></i>
              </Button>
            </Form>

            {this.state.pages &&

              <SearchResults
                pages={this.state.pages}
                date={this.state.date}
              />

            }
          </Div>

          <Hr id="tophits"></Hr>

          <TopHits
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            date={this.state.date}
          />

          <Hr id="topedits"></Hr>
          
          <TopCountries />

          <Hr id="topedits"></Hr>

        </div>
      </Container>
    );
  }
}

const styles = {
  container: {
    // border: '1px solid black',
    paddingTop: '100px',
    // padding: 30,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.8)',

  },
  contentContainer: {
    margin: '40px',
    marginTop: '0px'
  },
  searchContainer: {
    padding: '30px',
    paddingTop: '60px'
  },
  title: {
    fontFamily: 'Quicksand',
    fontSize: '22px',
    fontWeight: 600,
    // marginTop: '15px',
    color: 'rgb(7, 100, 206)'
  },
  input: {
    // border: '1px solid black'
    // width: '40%',
    // margin: '4vh 4vw'
  },
  searchInput: {
    // backgroundColor: 'rgba(0,0,144,0.1)',
    borderColor: 'rgba(0,0,255,0.2)',
    fontSize: '14px',
    margin: '10px',
    width: '200px'
  },
  button: {
    height: '34px',
    border: 'none',
    marginTop: '12px'
    // margin: '0px'
  },
  icon: {
    fontSize: '22px'
  },
  searchResults: {
    marginBottom: '40px'
  },
  result: {
    width: '100%'
  }
}