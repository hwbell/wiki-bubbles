import React from 'react';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

// import the chart
import { Chart } from 'react-google-charts';

// functions
import {
  getSearchFormatDate
} from '../functions/dataTools'

// other tools
var Rainbow = require('rainbowvis.js');
const fetch = require('node-fetch');

export default class TopHits extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 
    };

    // this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
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

        console.log('top articles: ')
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
        let topArticles = json.items[0].articles.slice(2, 12);

        // initalize rainbowvis to color each group dynamically
        var myRainbow = new Rainbow();

        // get min and max
        let max = topArticles[0].views;
        let min = topArticles[topArticles.length - 1].views;

        myRainbow.setNumberRange(min, max); // set range based on data
        myRainbow.setSpectrum('#AED6F1', '#43289b');

        topArticles.forEach((article, i) => {
          let title = article.article.replace(/_/g, ' '); // make the _ into spaces
          if (title !== 'Special:CreateAccount' && title !== 'Special:Search' && i < 16) {
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

  render() {
    return (
      <div style={styles.container}>
        
        <p className="text-center" style={styles.title}>
          Most popular Wiki pages
        </p>
        <p className="text-center" style={styles.subtitle}>
          {`${this.state.date}`}
        </p>


        {this.state.topArticles && <div className="col">

          <Chart
            chartType="BarChart"
            loader={<div>Loading Chart</div>}
            data={this.state.topArticles}
            options={{
              backgroundColor: 'none',
              legend: 'none',
              chartArea: { top: 0, right: 0, width: '80%', height: '90%' },
              vAxis: {
                  textStyle: { fontName: 'Sarabun', bold: 0, fontSize: 12, color: 'grey', textShadow: 'none',
                  float: 'right' },
                },
                hAxis: {
                  textStyle: { fontName: 'Sarabun', bold: 0, fontSize: 12, color: 'grey' },
                },
            }}

            // the event will register what was clicked and pop up a modal of the article, same as 
            chartEvents={[
              {
                eventName: 'select',
                callback: ({ chartWrapper }) => {
                  const chart = chartWrapper.getChart()
                  const selection = chart.getSelection()
                  
                  let newSearch = this.state.topArticles[selection[0].row+1][0];

                  this.props.handleChange(newSearch);
                  this.props.handleSubmit();
                },
              },
            ]}
            // For tests
            rootProps={{ 'data-testid': '6' }}
          />
        </div>}
        
      </div>
    )
  }
}

const styles = {
  container: {

    padding: '60px 20px 0px 20px',
    backgroundColor: 'rgba(255,255,255,0.4)'
  },
  title: {
    fontFamily: 'Quicksand',
    fontSize: '22px',
    fontWeight: 600,
    // marginTop: '30px',
    color: 'rgb(7, 100, 206)'
  },
  subtitle: {
    fontFamily: 'Quicksand',
    fontSize: 18,
    marginTop: '10px',
    marginBottom: '25px',
    color: 'rgb(7, 100, 206)'
  }
}

