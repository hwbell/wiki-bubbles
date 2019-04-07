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
    this.getTopEdits();
  }

  // // for the data in the 'most viewed wiki pages' graph
  getTopEdits() {
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
    const searchUrl = `https://wikimedia.org/api/rest_v1/metrics/edited-pages/top/en.wikipedia/all-editor-types/content/daily/${dateStr}`;
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

  render() {
    return (
      <div style={styles.container}>
        
        <p className="text-center" style={styles.title}>
          Most popular wiki pages
        </p>
        <p className="text-center" style={styles.subtitle}>
          {`on the day of ${this.props.date}`}
        </p>


        {this.state.topArticles && <div className="col">

          <Chart
            chartType="BarChart"
            loader={<div>Loading Chart</div>}
            data={this.state.topArticles}
            options={{
              // title: `Most viewed articles on ${this.props.date}`,
              width: '100%',
              height: 400,
              bar: { groupWidth: '80%' },
              legend: { position: 'none' },
              tooltip: { textStyle: { color: 'rgb(7, 100, 206)', fontName: 'Sarabun' } },
              vAxis: {
                textStyle: { fontName: 'Sarabun', bold: 0, fontSize: 14, color: 'grey', textShadow: 'none' },
                textPosition: 'in'
              },
              chartArea: { width: '100%', height: '100%' },
              // legend: { position: 'in' },
              // titlePosition: 'in', axisTitlesPosition: 'in',
              hAxis: { 
                textStyle: { fontName: 'Sarabun', bold: 0, fontSize: 12, color: '#B5C2DC' },
                textPosition: 'in' 
              },
              // vAxis: { textPosition: 'in' }
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
    padding: '30px',
    paddingTop: '60px'
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

