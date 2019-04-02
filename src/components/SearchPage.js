import React, { Component } from 'react';

// components 
import { Button, Form, FormGroup, Input } from 'reactstrap';
import ModalButton from './ModalButton';
import TopHits from './TopHits';

// styling
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';

// animation
import posed from 'react-pose';
var Rainbow = require('rainbowvis.js');

const fetch = require('node-fetch');


class SearchPage extends Component {

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getSearchResults = this.getSearchResults.bind(this);
    this.getTopArticles = this.getTopArticles.bind(this);

    this.state = {
      search: 'mars'
    }

  }

  componentDidMount() {
    this.getSearchResults(this.state.search);
    this.getTopArticles();
  }



  // // for the data in the initial graph
  getTopArticles() {
    // fetch the data from the api and put it in this form:
    // [["Sun", 32], ["Mon", 46], ["Tue", 28]] for the column chart from chartkick

    // get today into the format for the url -- 2015100100 = 10/01/2015. We'll leave the hours as 00.
    const today = new Date();

    // do two days since they don't have data yet for today, and sometimes don't have it for yesterday either
    today.setDate(today.getDate() - 2);

    // have to correct the month by 1 since it is 0-indexed
    let monthNum = today.getMonth() + 1;
    let month = monthNum < 10 ? '0' + monthNum.toString() : monthNum.toString();

    let date = today.getDate();

    let day = date < 10 ? '0' + date.toString() : date.toString();
    let year = today.getFullYear().toString();

    // a simple proxy is needed to avoid cors issues. I created one cloned from the 
    // cors-anywhere.git project
    // const proxyUrl = 'https://blooming-hamlet-51081.herokuapp.com/';
    const searchUrl = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/${year}/${month}/${day}`;
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
        let topArticles = json.items[0].articles.slice(2, 13);

        // initalize rainbowvis to color each group dynamically
        var myRainbow = new Rainbow();

        // get min and max
        let max = topArticles[0].views;
        let min = topArticles[topArticles.length - 1].views;
        console.log(typeof (min), typeof (max))

        myRainbow.setNumberRange(min, max); // set range based on data
        myRainbow.setSpectrum('#E1F5FE', '#F8BBD0');

        topArticles.forEach((article, i) => {
          let title = article.article.replace(/_/g, ' '); // make the _ into spaces
          if (title !== 'Special:CreateAccount' && i < 10) {
            let color = myRainbow.colourAt(article.views);
            data.push([title, article.views, color, null]);
          }

        });

        console.log(data)

        this.setState({
          topArticles: data,
          date: `${year}-${month}-${date}`
        })

      })
      .catch(e => {
        console.log(e);
        return e;
      });

  }


  // for the titles and snippets
  getSearchResults(search) {
    // const search = 'mogget';
    const targetUrl = "https://en.wikipedia.org/w/api.php?action=query&meta=siteinfo&siprop=statistics&generator=search&prop=extracts&exchars=450&explaintext=1&exlimit=10&exintro=1&format=json&sortby=relevance&origin=*&gsrsearch="
    const searchUrl = targetUrl + search;

    fetch(searchUrl, { method: 'GET' })
      .then(res => res.json()) // expecting a json response
      .then((json) => {
        console.log(json)

        // now format the data for the graph
        let data = Object.keys(json.query.pages).map((index, i) => {

          let extract = json.query.pages[`${index}`].extract;
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
  }

  handleSubmit(e) {
    e.preventDefault();
    this.getSearchResults(this.state.search);
  }

  render() {

    return (
      <div id="search" className="container" style={styles.container}>

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

          <div style={styles.searchResults}>
            {Object.keys(this.state.pages).map((index, i) => {

              let extract = this.state.pages[`${index}`].extract;
              let title = this.state.pages[`${index}`].title;

              return (
                <div key={i} style={styles.result} className="row">
                  {/* <Button color="info">
                        <p><strong>{title}</strong></p>
                      </Button>

                      <p>{extract}</p> */}
                  <ModalButton
                    date={this.state.date}
                    title={title}
                    extract={extract}
                  />

                </div>
              )
            })}
          </div>

        }

        <hr id="tophits"></hr>

        {this.state.topArticles && <TopHits date={this.state.date} data={this.state.topArticles} />}

        <div>
          Note: Without a forward slash at the end of subfolder addresses, you might generate two requests to the server. Many servers will automatically add a forward slash to the end of the address, and then create a new request.
          </div>
        <div>
          Note: Without a forward slash at the end of subfolder addresses, you might generate two requests to the server. Many servers will automatically add a forward slash to the end of the address, and then create a new request.
          </div>
        <div>
          Note: Without a forward slash at the end of subfolder addresses, you might generate two requests to the server. Many servers will automatically add a forward slash to the end of the address, and then create a new request.
          </div>
        <div>
          Note: Without a forward slash at the end of subfolder addresses, you might generate two requests to the server. Many servers will automatically add a forward slash to the end of the address, and then create a new request.
          </div>
        <div>
          Note: Without a forward slash at the end of subfolder addresses, you might generate two requests to the server. Many servers will automatically add a forward slash to the end of the address, and then create a new request.
          </div>
        <div>
          Note: Without a forward slash at the end of subfolder addresses, you might generate two requests to the server. Many servers will automatically add a forward slash to the end of the address, and then create a new request.
          </div>

      </div>
    );
  }
}

export default SearchPage;

const styles = {
  container: {
    paddingTop: '100px',
    backgroundColor: 'rgba(255,255,255,0.7)'
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