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

export default class TopEdits extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 
    };

    // this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    this.gettopEdits();
  }

  // // for the data in the 'most viewed wiki pages' graph
  gettopEdits() {
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
    const searchUrl = `https://wikimedia.org/api/rest_v1/metrics/editors/top-by-edits/en.wikipedia/user/all-page-types/2018/01/01`;
    // console.log(searchUrl)

    fetch(searchUrl, {
      method: 'GET',
      crossDomain: true
    })
      .then(res => res.json())
      .then((json) => {
        // console.log(json);

        // set up format for the google chart - from react-google-charts docs
        let data = [
          ['User', 'Edits'],
          // data groups added here as ['Title', value, '#hexcolor', null],
        ]

        // lose the first 2 as its always 'Main Page' and 'Special:Search', and just get the top 11,
        // from which we'll lose the Special:CreateAccount page(below), leaving the top 10
        let topEditors = json.items[0].results[0].top.slice(2, 52);

        // initalize rainbowvis to color each group dynamically
        var myRainbow = new Rainbow();

        // get min and max
        let max = topEditors[0].edits;
        let min = topEditors[topEditors.length - 1].edits;
        // console.log(typeof (min), typeof (max))

        myRainbow.setNumberRange(min, max); // set range based on data
        myRainbow.setSpectrum('#BBDEFB', '#FFCCFF');

        topEditors.forEach((edit, i) => {
          let title = edit.user_text.replace(/_/g, ' '); // make the _ into spaces
          let color = myRainbow.colourAt(edit.edits);
          data.push([title, edit.edits]);

        });

        // console.log(data)
        // data = data.sort(() => Math.random() - 0.5);

        this.setState({
          topEdits: data,
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
          Today's top editors
        </p>
        <p className="text-center" style={styles.subtitle}>
          {`${this.state.date}`}
        </p>



        {this.state.topEdits &&

          <div className="col" style={styles.chartHolder}>
            <p className="float-right" style={styles.winner}>
              {`${this.state.topEdits[1][0]} is killing it!`}
            </p>
            <Chart
              chartType="Histogram"
              loader={<div>Loading Chart</div>}
              data={this.state.topEdits}
              options={{
                // title: `Most viewed edits on ${this.props.date}`,
                width: '100%',
                height: 400,
                backgroundColor: 'none',
                bar: { groupWidth: '80%' },
                legend: { position: 'none' },
                tooltip: { textStyle: { color: 'rgb(7, 100, 206)', fontName: 'Sarabun' } },
                vAxis: {
                  ticks: [15, 20, 25],
                  textStyle: { fontName: 'Sarabun', bold: 0, fontSize: 14, color: 'grey', textShadow: 'none' },
                  textPosition: 'in'
                },
                chartArea: { width: '100%', height: '80%' },
                // legend: { position: 'in' },
                // titlePosition: 'in', axisTitlesPosition: 'in',
                hAxis: {
                  title: 'edits',
                  titleTextStyle: { fontName: 'Sarabun', bold: 0, italic: 0, fontSize: 16, color: 'grey' },
                  textStyle: { fontName: 'Sarabun', bold: 0, fontSize: 12, color: 'grey' },
                },
                // vAxis: { textPosition: 'in' }
              }}

              // the event will register what was clicked and pop up a modal of the edit, same as 
              chartEvents={[
                {
                  eventName: 'select',
                  callback: ({ chartWrapper }) => {
                    const chart = chartWrapper.getChart()
                    const selection = chart.getSelection()

                    let newSearch = this.state.topEdits[selection[0].row + 1][0];

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
  },
  winner: {
    fontFamily: 'Quicksand',
    fontSize: 18,
    fontWeight: 600,
    marginTop: '10px',
    color: 'rgb(7, 100, 206)'
  },
  chartHolder: {
    marginTop: '5vh',
    marginBottom: '8vh'
  }
}

