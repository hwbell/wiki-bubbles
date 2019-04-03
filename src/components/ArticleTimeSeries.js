import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

// import the chart
import { Chart } from 'react-google-charts';

const fetch = require('node-fetch');

// this function takes a javascript Date obj and returns it in the wikipages 
// format - i.e. '2015100100' being 0ct 01, 2015, 0hrs
const getSearchFormatDate = (dateObj) => {

  // have to correct the month by 1 since it is 0-indexed
  let monthNum = dateObj.getMonth() + 1;
  let month = monthNum < 10 ? '0' + monthNum.toString() : monthNum.toString();

  let date = dateObj.getDate();
  let day = date < 10 ? '0' + date.toString() : date.toString();

  let year = dateObj.getFullYear().toString();

  return `${year}${month}${day}00`
}

export default class ArticleTimeSeries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 
    };

    this.getTimeSeriesData = this.getTimeSeriesData.bind(this);
  }

  componentDidMount() {
    // set the date range, using 2 days ago as the endpoint

    // set the endpoint
    let endDate = new Date();
    endDate.setDate(endDate.getDate() - 2);

    // set the starting date 30 days earlier
    let startDate = new Date(endDate.getTime()); // copy the original
    startDate.setDate(endDate.getDate() - 30); // set the date to t-30

    this.setState({
      startDate,
      endDate
    }, () => {
      // get the time series data from the pageviews api
      this.getTimeSeriesData(this.props.article);
    })

  }

  getTimeSeriesData(article) {
    // get the date range
    const startDate = this.state.startDate;
    const endDate = this.state.endDate;

    console.log(startDate)

    let startDateStr = getSearchFormatDate(startDate);
    let endDateStr = getSearchFormatDate(endDate);

    // replace the spaces with _
    let articleStr = article.replace(/ /g, '_')

    const searchUrl = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/${articleStr}/daily/${startDateStr}/${endDateStr}`;
    console.log(searchUrl)

    // fetch the data from the api and put it in this form:
    // [ ['timepoint', value], ['timepoint', value], etc... ]

    fetch(searchUrl, {
      method: 'GET',
      crossDomain: true
    })
      .then(res => res.json())
      .then((json) => {
        console.log(json);

        // set up format for the google chart - from react-google-charts docs
        let data = [
          ['Date', 'Page views']
        ]

        let dataPoints = json.items;

        // get the ticks for the graph, normally there are too many
        let ticks = [0, 8, 16, 24, dataPoints.length - 1];
        let graphTicks = [];

        // get min and max ?

        dataPoints.forEach((article, i) => {
          // get '2019-04-02' from '2019040200'
          let timestamp = article.timestamp.slice(4, 6) + '-' + article.timestamp.slice(6, 8);

          // save in the graph format
          data.push([timestamp, article.views]);

          if (!!ticks.indexOf(i)) {
            graphTicks.push(timestamp);
          }

        });

        this.setState({
          data,
          graphTicks
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
          Views in last 30 days
        </p>

        {this.state.data &&
          <Chart
            style={{ margin: 'auto auto' }}
            width={'100%'}
            height={'100%'}
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={this.state.data}
            options={{
              legend: { position: 'none' },
              chartArea: { width: '80%', height: '80%' },
              // title: 'Views in last 30 days',
              // titleTextStyle: { fontName: 'Sarabun', bold: 0, fontSize: 20, color: 'black' },
              // hAxis: { title: 'Date', titleTextStyle: { color: '#333' } },
              tooltip: { textStyle: { color: 'rgb(7, 100, 206)', fontName: 'Sarabun' } },
              vAxis: {
                textStyle: { fontName: 'Sarabun', bold: 0, fontSize: 12, color: 'grey' },
              },
              hAxis: {
                textStyle: { fontName: 'Sarabun', bold: 0, fontSize: 12, color: '#B5C2DC' },
              },
            }}

            // For tests
            rootProps={{ 'data-testid': '1' }}
          />}
      </div>
    )
  }
}

const styles = {
  container: {
    width: '100%',
    height: '300px',
    margin: '10px'
  }, 
  title: {
    fontFamily: 'Quicksand',
    fontSize: '20px',
    fontWeight: 600,
    marginTop: '30px',
    color: 'rgb(7, 100, 206)'
  },
}

