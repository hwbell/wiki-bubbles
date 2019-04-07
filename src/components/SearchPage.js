import React, { Component } from 'react';

// components 
import { Button, Form, FormGroup, Input } from 'reactstrap';
import ModalButton from './ModalButton';
import TopHits from './TopHits';
import SiteInformation from './SiteInformation';

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


class SearchPage extends Component {

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getSearchResults = this.getSearchResults.bind(this);
    this.getTopArticles = this.getTopArticles.bind(this);
    this.getTopEdits = this.getTopEdits.bind(this);

    this.state = {
      search: 'mars'
    }

  }

  componentDidMount() {
    this.getSearchResults(this.state.search);
    this.getTopArticles();
  }



  // // for the data in the 'most viewed wiki pages' graph
  getTopArticles() {
    // fetch the data from the api and put it in this form:
    // [["Sun", 32], ["Mon", 46], ["Tue", 28]] for the column chart from chartkick

    // get today into the format for the url -- 2015100100 = 10/01/2015. We'll leave the hours as 00.
    const today = new Date();

    // do two days since they don't have data yet for today, and sometimes don't have it for yesterday either
    today.setDate(today.getDate() - 2);
    let date = getSearchFormatDate(today);
    let dateStr = date.slice(0, 4) + '/' + date.slice(4, 6) + '/' + date.slice(6, 8);

    // a simple proxy is needed to avoid cors issues. I created one cloned from the 
    // cors-anywhere.git project
    // const proxyUrl = 'https://blooming-hamlet-51081.herokuapp.com/';
    const searchUrl = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/${dateStr}`;
    console.log(searchUrl)

    fetch(searchUrl, {
      method: 'GET',
      crossDomain: true
    })
      .then(res => res.json())
      .then((json) => {
        console.log(json);

        // set up format for the google chart - from react-google-charts docs
        let data = [
          [
            'Wiki Page',
            'Views',
            { role: 'style' },
            {
              sourceColumn: 0,
              role: 'annotation',
              type: 'string',
              calc: 'stringify',
            },
          ]
          // data groups added here as ['Title', value, '#hexcolor', null],
        ]

        // lose the first 2 as its always 'Main Page' and 'Special:Search', and just get the top 11,
        // from which we'll lose the Special:CreateAccount page(below), leaving the top 10
        let topArticles = json.items[0].articles.slice(2, 14);

        // initalize rainbowvis to color each group dynamically
        var myRainbow = new Rainbow();

        // get min and max
        let max = topArticles[0].views;
        let min = topArticles[topArticles.length - 1].views;
        console.log(typeof (min), typeof (max))

        myRainbow.setNumberRange(min, max); // set range based on data
        myRainbow.setSpectrum('#BBDEFB', '#FFCCFF');

        topArticles.forEach((article, i) => {
          let title = article.article.replace(/_/g, ' '); // make the _ into spaces
          if (title !== 'Special:CreateAccount' && title !== 'Special:Search' && i < 10) {
            let color = myRainbow.colourAt(article.views);
            data.push([title, article.views, color, null]);
          }

        });

        console.log(data)

        this.setState({
          topArticles: data,
          date: dateStr
        })

      })
      .catch(e => {
        console.log(e);
        return e;
      });

  }

  getTopEdits() {

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

        // now format the data for the graph
        let data = Object.keys(json.query.pages).map((index, i) => {

          let title = json.query.pages[`${index}`].title;
          let value = json.query.pages[`${index}`].index;

          return (
            // from the chartkick docs, this should be the format for each group
            [title, value]
          )
        });

        // save to state
        this.setState({
          pages: json.query.pages,
          data,
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
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  handleSubmit(e) {
    if (e) { e.preventDefault(); }
    this.getSearchResults(this.state.search);
  }

  render() {

    return (
      <Container className="container" style={styles.container}>

        {this.state.stats &&
          <SiteInformation
            stats={this.state.stats}
          />}

        <Hr id="search"></Hr>

        <Div style={styles.searchContainer}>
          <Form className="row" style={styles.input} onSubmit={this.handleSubmit}>
            <FormGroup>
              <Input className="input" style={styles.searchInput} type="text" name="name" id="contactname" placeholder="search"
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

            <Div style={styles.searchResults}>
              {Object.keys(this.state.pages).map((index, i) => {

                let extract = this.state.pages[`${index}`].extract;
                let title = this.state.pages[`${index}`].title;

                return (
                  <Div key={i} style={styles.result} className="row">
                    {/* <Button color="info">
                        <p><strong>{title}</strong></p>
                      </Button>

                      <p>{extract}</p> */}
                    <ModalButton
                      date={this.state.date}
                      title={title}
                      extract={extract}
                    />

                  </Div>
                )
              })}
            </Div>

          }
        </Div>

        <Hr id="tophits"></Hr>

        {this.state.topArticles &&
          <TopHits
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            date={this.state.date}
            data={this.state.topArticles}
          />}

        <Hr id="toedits"></Hr>


      </Container>
    );
  }
}

export default SearchPage;

const styles = {
  container: {
    // border: '1px solid black',
    paddingTop: '120px',
    backgroundColor: 'rgba(255,255,255,0.8)',
    width: '100%',
    // padding: 0
  },
  searchContainer: {
    paddingTop: '60px'
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