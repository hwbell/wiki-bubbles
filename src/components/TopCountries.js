import React from 'react';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

// import the chart
import { Chart } from 'react-google-charts';

// functions
import {
  getSearchFormatDate,
  getMidRangeFromBucket
} from '../functions/dataTools'

const { getCode, getName } = require('country-list');
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
    this.getTopCountries();
  }

  // // for the data in the 'most viewed wiki pages' graph
  getTopCountries() {
    // fetch the data from the api and put it in this form:
    // [["Sun", 32], ["Mon", 46], ["Tue", 28]] for the column chart from chartkick

    // get today into the format for the url -- 2015100100 = 10/01/2015. We'll leave the hours as 00.
    const today = new Date();

    // do two days since they don't have data yet for today, and sometimes don't have it for yesterday either
    today.setDate(today.getDate() - 2);
    let date = getSearchFormatDate(today);
    let dateStr = date.slice(0, 4) + '/' + date.slice(4, 6);

    // a simple proxy is needed to avoid cors issues. I created one cloned from the 
    // cors-anywhere.git project
    // const proxyUrl = 'https://blooming-hamlet-51081.herokuapp.com/';
    const searchUrl = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top-by-country/en.wikipedia/all-access/2015/10`;
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
          ['Task', 'Hours per Day']
          // data groups pushed here as ['Title', value, '#hexcolor', null],
        ]
        // let colors = [
        //   // colors pushed to this array
        // ]


        let topCountries = json.items[0].countries.slice(0, 10);

        // initalize rainbowvis to color each group dynamically
        // var myRainbow = new Rainbow();

        // // get min and max
        // let max = getMidRangeFromBucket(topCountries[0].views);
        // let min = getMidRangeFromBucket(topCountries[topCountries.length - 1].views);

        // myRainbow.setNumberRange(min, max); // set range based on data
        // myRainbow.setSpectrum('#BBDEFB', '#FFCCFF');

        // push each result into the array
        topCountries.forEach((result, i) => {

          let title = getName(result.country);
          let views = result.views_ceil;
          
          // let color = '#' + myRainbow.colourAt(views);
          // colors.push(color);
          data.push([title, views]);

        });

        console.log(data)
        const colors = [
          '#F8BBD0',
          '#E1BEE7',
          '#D1C4E9',
          '#9FA8DA',
          '#90CAF9',
          '#81D4FA',
          '#80DEEA',
          '#80CBC4',
          '#A5D6A7',
          '#C5E1A5',
        ];

        this.setState({
          data,
          colors,
          date: dateStr
        })

      })
      .catch(e => {
        console.log(e);
        return e;
      });

  }

  render() {
    console.log(this.state.colors)

    return (
      <div style={styles.container}>

        <p className="text-center" style={styles.title}>
          Which countries Wiki the hardest?
        </p>
        {/* <p className="text-center" style={styles.subtitle}>
          {`on the day of ${this.props.date}`}
        </p> */}


        {this.state.data && 
        <div className="col" style={styles.chartHolder}>

          <Chart
            chartType="PieChart"
            loader={<div>Loading Chart</div>}
            data={this.state.data}
            options={{
              width: '100%',
              height: 400,
              backgroundColor: 'none',
              tooltip: { textStyle: { color: 'rgb(7, 100, 206)', fontName: 'Sarabun' } },
              legend: { 
                position: 'right', 
                alignment: 'center',
                textStyle: {
                  fontName: 'Sarabun', bold: 0, fontSize: 14
                }
              },
              colors: this.state.colors,
              chartArea: { width: '100%', height: '100%' },
            }}
            rootProps={{ 'data-testid': '1' }}
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
    margin: '30px',
    marginTop: '0px',
    color: 'rgb(7, 100, 206)'
  },
  chartHolder: {
    margin: '30px'
  }
}

