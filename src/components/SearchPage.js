import React, { Component } from 'react';

// components 
import { Button, Form, FormGroup, Input } from 'reactstrap';
import ModalButton from './ModalButton';

// styling
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';

// animation
import posed from 'react-pose';

// chartkick charts
import ReactChartkick, { ColumnChart, BarChart } from 'react-chartkick';
import Chart from 'chart.js';
ReactChartkick.addAdapter(Chart);

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

    // do yesterday since they don't have data yet for today
    today.setDate(today.getDate()-1);

    // have to correct the month by 1 since it is 0-indexed
    let month = today.getMonth() + 1;
    let monthStr = month < 10 ? '0' + month.toString() : month.toString();

    let date = today.getDate(); 
    
    let yesterday = date < 10 ? '0' + date.toString() : date.toString();
    let year = today.getFullYear().toString();

    // a simple proxy is needed to avoid cors issues. I created one cloned from the 
    // cors-anywhere.git project
    const proxyUrl = 'https://blooming-hamlet-51081.herokuapp.com/';
    const searchUrl = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/2019/${monthStr}/${yesterday}`;
    console.log(searchUrl)

    fetch(searchUrl, {
      method: 'GET',
      crossDomain: true
    })
      .then(res => res.json())
      .then((json) => {
        console.log(json);

        // lose the first 2 as its always 'Main Page' and 'Special:Search', and just get the top 10
        let topArticles = json.items[0].articles.slice(2, 12);
        let formattedArticles = topArticles.map((article) => {
          return [article.article, article.views]
        })

        this.setState({
          topArticles: formattedArticles
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
      <div className="container" style={styles.container}>

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
          Object.keys(this.state.pages).map((index, i) => {

            let extract = this.state.pages[`${index}`].extract;
            let title = this.state.pages[`${index}`].title;

            return (
              <div key={i} style={styles.result} className="row">
                {/* <Button color="info">
                  <p><strong>{title}</strong></p>
                </Button>

                <p>{extract}</p> */}
                <ModalButton
                  title={title}
                  extract={extract}
                />

              </div>
            )
          })}

          {this.state.topArticles && <BarChart ticks={4} data={this.state.topArticles}/>}


      </div>
    );
  }
}

export default SearchPage;

const styles = {
  container: {
    margin: '3vw',
    marginTop: 100,
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
  result: {
    width: '100%'
  }
}