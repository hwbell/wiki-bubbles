import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

// import the chart
import { Chart } from 'react-google-charts';

export default class TopHits extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 
    };

    // this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    // this.drawChart();
  }

  render() {
    return (
      <div style={styles.container}>

        <p className="text-center" style={styles.title}>
          Most viewed wiki pages
        </p>
        <p className="text-center" style={styles.subtitle}>
          {`on the day of ${this.props.date}`}
        </p>


        <div className="col">
          <Chart
            chartType="BarChart"
            loader={<div>Loading Chart</div>}
            data={this.props.data}
            options={{
              // title: `Most viewed articles on ${this.props.date}`,
              select: this.linkToSelection,
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

            // the event will register what was clicked feed it back to the search
            chartEvents={[
              {
                eventName: 'select',
                callback: ({ chartWrapper }) => {
                  const chart = chartWrapper.getChart()
                  const selection = chart.getSelection()
                  
                  let newSearch = this.props.data[selection[0].row+1][0];

                  this.props.handleChange(newSearch);
                  this.props.handleSubmit();
                },
              },
            ]}
            // For tests
            rootProps={{ 'data-testid': '6' }}
          />
        </div>
        
      </div>
    )
  }
}

const styles = {
  container: {
    marginTop: '10vh',
    marginBottom: '10vh'
  },
  title: {
    fontFamily: 'Quicksand',
    fontSize: '22px',
    fontWeight: 600,
    marginTop: '30px',
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

