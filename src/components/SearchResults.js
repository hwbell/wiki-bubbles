import React, { Component } from 'react';

// components 
import { Button, Form, FormGroup, Input } from 'reactstrap';
import ModalButton from './ModalButton';

// functions
import {
  getSearchFormatDate
} from '../functions/dataTools'

// styling
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';

// animation with pose
// define the container with children behavior and then the children
// with enter / exit information
import posed from 'react-pose';

const Container = posed.div({
  enter: { staggerChildren: 50 },
  exit: { staggerChildren: 50, staggerDirection: -1 }
});

const Div = posed.div({
  enter: { x: 0, opacity: 1 },
  exit: { x: 0, opacity: 0 }
});

const Hr = posed.hr({
  enter: { x: 0, opacity: 1 },
  exit: { x: 0, opacity: 0 }
});

const fetch = require('node-fetch');

export default class SearchResults extends Component {

  constructor(props) {
    super(props);

    this.state = {
      // search: 'mars'
    }

  }

  componentDidMount() {
    // this.getSearchResults(this.props.search);
  }

  render() {

    return (

      <Div style={styles.searchResults}>
        {Object.keys(this.props.pages).map((index, i) => {

          let extract = this.props.pages[`${index}`].extract;
          let title = this.props.pages[`${index}`].title;

          return (
            <Div key={i} style={styles.result} className="row">
              {/* <Button color="info">
                        <p><strong>{title}</strong></p>
                      </Button>

                      <p>{extract}</p> */}
              <ModalButton
                date={this.props.date}
                title={title}
                extract={extract}
              />

            </Div>
          )
        })}

      </Div>

    );
  }
}

const styles = {
  
  searchResults: {
    marginBottom: '40px'
  },
  result: {
    width: '100%'
  }
}