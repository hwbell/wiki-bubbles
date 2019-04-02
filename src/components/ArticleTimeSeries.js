import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

// import the chart
import { Chart } from 'react-google-charts';

const fetch = require('node-fetch');

export default class ArticleTimeSeries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };

    // this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    // set the date range, using 2 days ago as the endpoint
    
    // set the endpoint
    let endDate = new Date();
    endDate.setDate(endDate.getDate() - 2);

    // set the starting date 30 days earlier
    let startDate = new Date(endDate.getTime()); // copy the original
    startDate.setDate(endDate.getDate() - 30); // set the date to t-30

    // get the time series data from the pageviews api


  }

  getTimeSeriesData() {
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

  render(){
    return (
      <div>
        
      </div>
    )
  }
}

const styles = {

}

