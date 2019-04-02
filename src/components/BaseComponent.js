import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import ReactChartkick, { PieChart } from 'react-chartkick';
import Chart from 'chart.js'
ReactChartkick.addAdapter(Chart);

export default class PieGraph extends React.Component {
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

  render(){
    return (
      <div>
        
      </div>
    )
  }
}

const styles = {

}

