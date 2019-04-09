import React from 'react';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

// import the chart
import { Chart } from 'react-google-charts';

// functions
import {
  getSearchFormatDate,
  getPopulation
} from '../functions/dataTools'

import countryData from '../assets/json/countries';

// these npm packages are very useful
const { getName } = require('country-list');
var Rainbow = require('rainbowvis.js');
const fetch = require('node-fetch');

export default class TopHits extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 
    };

    this.renderPieChart = this.renderPieChart.bind(this);
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
        let pieData = [
          ['Task', 'Hours per Day']
          // data groups pushed here as ['Title', value, '#hexcolor', null],
        ]

        let bubbleData = [
          ['Country', 'population', 'views', 'views per capita']
        ]

        let topCountries = json.items[0].countries.slice(0, 16);
        console.log(topCountries)
        topCountries.forEach((result, i) => {

          if (result.country !== '--') {
            let title = getName(result.country);
            let views = result.views_ceil;
            let population = Number(getPopulation(title, countryData))
            let perCapita = views / population;

            // we'll display in millions for views and population
            let adjustedViews = views / 1000000; 
            let adjustedPopulation = population / 1000000; 

            // Iran seems to be the one country on the high views list that has 
            // too long of a name, so just fix it here.
            if (title === 'Iran, Islamic Republic of') {
              title = 'Iran';
            } 

            console.log(title)
            console.log(population)
            console.log(views)
            console.log(perCapita)


            pieData.push([title, views]);
            bubbleData.push([title, adjustedPopulation, adjustedViews, perCapita]);
          }

        });

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
          pieData,
          bubbleData,
          colors,
          date: dateStr
        })

      })
      .catch(e => {
        console.log(e);
        return e;
      });
  }

  renderPieChart() {
    return (
      <div className="col" style={styles.chartHolder}>

        <Chart
          chartType="PieChart"
          loader={<div>Loading Chart</div>}
          data={this.state.pieData}
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
      </div>
    )
  }

  renderBubbleChart() {
    return (
      <div className="col" style={styles.chartHolder}>
        <Chart
          chartType="BubbleChart"
          loader={<div>Loading Chart</div>}
          data={this.state.bubbleData}
          options={{
            title: 'increasing per capita views ->',
            titleTextStyle: { fontName: 'Sarabun', italic: 0, bold: 0, fontSize: 16, color: 'grey' },
            bubble: {
              textStyle: {
                fontName: 'Sarabun',
                italic: 0,
                bold: 0,
                fontSize: 12,
                color: '#222757'
              },
              textPosition: 'in'
            },
            width: '100%',
            height: 400,
            backgroundColor: 'none',
            chartArea: { width: '80%', height: '70%' },
            colorAxis: {
              legend: {
                textStyle: { fontName: 'Sarabun', bold: 0, fontSize: 12, color: 'grey' }
              },
              minValue: 0,
              maxValue: 15,
              colors: ['#4FC3F7', '#E91E63']
            },
            sizeAxis: {
              maxValue: 20
            },
            hAxis: {
              scaleType: 'log',
              minValue: 0,
              title: 'population (millions)',
              titleTextStyle: { fontName: 'Sarabun', italic: 0, bold: 0, fontSize: 16, color: 'grey' },
              textStyle: { fontName: 'Sarabun', bold: 0, fontSize: 12, color: 'grey' },
            },
            vAxis: {
              scaleType: 'mirrorLog',
              maxValue: 6000,
              title: 'page views (millions)',
              titleTextStyle: { fontName: 'Sarabun', italic: 0, bold: 0, fontSize: 16, color: 'grey' },
              textStyle: { fontName: 'Sarabun', bold: 0, fontSize: 12, color: 'grey' },
            },
            
          }}
          rootProps={{ 'data-testid': '2' }}
        />
      </div>
    )
  }

  render() {
    console.log(this.state.colors)

    return (
      <div style={styles.container}>

        <p className="text-center" style={styles.title}>
          Which countries view the most?
        </p>

        {this.state.pieData && this.renderPieChart()}

        <p className="text-center" style={styles.title}>
          How does population compare to page views?
        </p>

        {this.renderBubbleChart()}

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
    margin: '20px',
    marginTop: '0px',
    color: 'rgb(7, 100, 206)'
  },
  subtitle: {
    fontFamily: 'Quicksand',
    fontSize: 18,
    marginTop: '10px',
    marginBottom: '25px',
    color: 'rgb(7, 100, 206)'
  },
  chartHolder: {
    marginTop: '5vh',
    marginBottom: '5vh'
  }
}

