import React from 'react';
import { Button, Form, FormGroup, Input } from 'reactstrap';

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

  render() {
    return (
      <div>

        <p className="text-center" style={styles.title}>
          Search the Encyclopedia
        </p>

        <Form className="row" style={styles.input} onSubmit={this.props.handleSubmit}>
          <FormGroup>
            <Input className="input" style={styles.searchInput} type="text" name="name" id="contactname" placeholder={this.props.search}
              onChange={(e) => this.props.handleChange(`${e.target.value}`)}
            />
          </FormGroup>

          <Button color="link"
            type="submit"
            style={styles.button}>
            <i className={`fas fa-search-plus`} style={styles.icon}></i>
          </Button>
        </Form>

      </div>
    )
  }
}

const styles = {
  title: {
    fontFamily: 'Quicksand',
    fontSize: '22px',
    fontWeight: 600,
    // marginTop: '15px',
    color: 'rgb(7, 100, 206)'
  },
  searchInput: {
    // backgroundColor: 'rgba(0,0,144,0.1)',
    borderColor: 'rgba(0,0,255,0.2)',
    fontSize: '14px',
    margin: '10px',
    width: '200px'
  },
  icon: {
    fontSize: '22px'
  },
}

