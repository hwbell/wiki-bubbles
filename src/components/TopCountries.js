import React from 'react';

// styling
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';
// for media queries
import Media from 'react-media';

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
const fetch = require('node-fetch');

// this package is great! makes coloring so easy
var Rainbow = require('rainbowvis.js');

// get rid of the legend for mobile, it takes up too much room
const legend = {
  position: 'right',
  alignment: 'center',
  textStyle: {
    fontName: 'Sarabun', bold: 0, fontSize: 14
  }
}

const mobileLegend = 'none'

export default class TopHits extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

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
    // console.log(searchUrl)

    fetch(searchUrl, {
      method: 'GET',
      crossDomain: true
    })
      .then(res => res.json())
      .then((json) => {
        // console.log(json);

        // set up format for the google chart - from react-google-charts docs
        let pieData = [
          ['Task', 'Hours per Day']
          // data groups pushed here as ['Title', value, '#hexcolor', null],
        ]

        let bubbleData = [
          ['Country', 'population', 'views', 'views per capita']
        ]

        let topCountries = json.items[0].countries.slice(0, 16);
        // console.log(topCountries)

        // make an array of colors for the pie graph with rainbowvis
        // initalize rainbowvis to color each group dynamically
        var myRainbow = new Rainbow();

        // get min and max
        let max = topCountries[0].views_ceil;
        let min = topCountries[topCountries.length - 1].views_ceil;

        myRainbow.setNumberRange(0, max / 3); // set range based on data
        myRainbow.setSpectrum('#AED6F1', '#43289b');

        // just make an array for all colors - I think adding them with each group
        // doesn't work on the pie chart as it does in the bar chart
        let colors = [];

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

            // console.log(title)
            // console.log(population)
            // console.log(views)
            // console.log(perCapita)

            // add to the data array for each chart
            pieData.push([title, views]);
            bubbleData.push([title, adjustedPopulation, adjustedViews, perCapita]);

            // add to the colors array
            let color = myRainbow.colourAt(views);
            colors.push('#' + color)
          }

        });

        console.log(colors)

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


  renderPieChart(legend) {
    return (
      <div className="col" style={styles.chartHolder}>

        <Chart
          chartType="PieChart"
          loader={<div>Loading Chart</div>}
          data={this.state.pieData}
          options={{
            width: '100%',
            height: 400,
            pieSliceText: 'label',
            backgroundColor: 'none',
            tooltip: { textStyle: { color: 'rgb(7, 100, 206)', fontName: 'Sarabun' } },
            legend: legend,
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
              // textPosition: 'in'
            },
            width: '100%',
            height: 400,
            backgroundColor: 'none',
            chartArea: { width: '90%', height: '70%' },
            colorAxis: {
              legend: {
                textStyle: { fontName: 'Sarabun', bold: 0, fontSize: 12, color: 'grey' }
              },
              minValue: 0,
              maxValue: 12,
              colors: ['#AED6F1', '#43289b']
            },
            hAxis: {
              baselineColor: 'white',
              scaleType: 'log',
              minValue: 0,
              title: 'population (millions)',
              titleTextStyle: { fontName: 'Sarabun', italic: 0, bold: 0, fontSize: 16, color: 'grey' },
              textStyle: { fontName: 'Sarabun', bold: 0, fontSize: 12, color: 'grey' },
            },
            vAxis: {
              baselineColor: 'white',
              scaleType: 'mirrorLog',
              maxValue: 6000,
              title: 'page views (millions)',
              titleTextStyle: { fontName: 'Sarabun', italic: 0, bold: 0, fontSize: 16, color: 'grey' },
              textStyle: { fontName: 'Sarabun', bold: 0, fontSize: 12, color: 'grey' },
              textPosition: 'in'
            },

          }}
          rootProps={{ 'data-testid': '2' }}
        />
      </div>
    )
  }

  render() {
    // console.log(this.state.colors)

    return (
      <div style={styles.container}>

        <p className="text-center" style={styles.title}>
          Which countries view the most?
        </p>

        {this.state.pieData &&
          <Media query="(min-width: 599px)">
            {matches =>
              matches ? (
                this.renderPieChart(legend)
              ) : (
                  this.renderPieChart(mobileLegend)
                )
            }
          </Media>}

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
   margin: 0,
   marginBottom: '10vh',
   padding: 0,
    // border: '1px solid black'
  }
}

