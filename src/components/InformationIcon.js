import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Tooltip } from 'reactstrap';

import ReactChartkick, { PieChart } from 'react-chartkick';
import Chart from 'chart.js'
ReactChartkick.addAdapter(Chart);

export default class PieGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltipOpen: false
    };

    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    // this.drawChart();
  }

  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }

  render() {

    const target = this.props.info.text.replace(/ /g, '')

    return (
      <div className="row" style={styles.container}>

        {/* <Tooltip placement="right"
          style={styles.tooltip}
          isOpen={this.state.tooltipOpen}
          target={target}
          toggle={this.toggle}>
          {this.props.info.text}
        </Tooltip> */}

        <div style={styles.iconHolder}>
          <i className={this.props.iconClass} id={target} style={styles.icon}></i>
        </div>

        <div style={styles.textHolder}>
          <p className="" style={styles.text}>
            {this.props.info.count}
          </p>
        </div>

        <div style={styles.textHolder}>
          <p className="" style={styles.lesserText}>
            {this.props.info.text}
          </p>
        </div>


      </div>
    )
  }
}

const styles = {
  container: {
    minWidth: '300px',
    margin: 'auto 20px'
  },
  iconHolder: {
    // border: '1px solid black',
    width: '70px',
    margin: '2vw',
  },
  icon: {
    fontSize: 'calc(30px + 1vw)',
    // border: '1px solid black',
    // width: '100px'
    // margin: '15px'
  },
  textHolder: {
    margin: '2vw'
  },
  text: {
    // margin: '15px',
    fontSize: 'calc(12px + 1vw)',
    fontWeight: 600,
    fontFamily: 'Sarabun'
  },
  lesserText: {
    // margin: '15px',
    fontSize: 'calc(12px + 1vw)',
    fontFamily: 'Sarabun'
  },
  tooltip: {
    fontFamily: 'Sarabun',
    fontSize: '14px',
    
  }
}

