import React from 'react';
import { Tooltip } from 'reactstrap';

// components
import InformationIcon from './InformationIcon';

export default class SiteInformation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // tooltipOpen: false
    };

  }

  componentDidMount() {
    // change 
  }

  // renderIcons() {
  //   // make the object into an array and stringify the numbers with comma separation
  //   let statsArray = Object.keys(this.props.stats).map((stat) => {
  //     return this.props.stats[`${stat}`]
  //   })
  // }

  render() {
    return (

      <div style={styles.container}>

        <p className="text-center" style={styles.title}>
          As of today, Wikipedia has:
        </p>

        <div className="" style={styles.infoContainer}>

          <InformationIcon
            iconClass={'fas fa-file'}
            info={{ text: 'pages', count: this.props.stats.pages }}
            tooltipOpen={this.state.tooltipOpen}
          />

          <InformationIcon
            iconClass={'fas fa-newspaper'}
            info={{ text: 'articles', count: this.props.stats.articles }}
            tooltipOpen={this.state.tooltipOpen}
          />

          <InformationIcon
            iconClass={'fas fa-images'}
            info={{ text: 'images', count: this.props.stats.images }}
            tooltipOpen={this.state.tooltipOpen}
          />

          <InformationIcon
            iconClass={'fas fa-edit'}
            info={{ text: 'edits', count: this.props.stats.edits }}
            tooltipOpen={this.state.tooltipOpen}
          />

          <InformationIcon
            iconClass={'fas fa-users'}
            info={{ text: 'users', count: this.props.stats.users }}
            tooltipOpen={this.state.tooltipOpen}
          />


          <InformationIcon
            iconClass={'fas fa-chalkboard-teacher'}
            info={{ text: 'active users', count: this.props.stats.activeusers }}
            toggle={this.toggle}
            tooltipOpen={this.state.tooltipOpen}
          />
        </div>



      </div>
    )
  }
}

const styles = {
  container: {
    width: '100%',
    // border: '1px solid black'
  },
  infoContainer: {
    // border: '1px solid black',
    width: '90%',
    width: '100%'
  },
  title: {
    fontFamily: 'Quicksand',
    fontSize: '22px',
    fontWeight: 600,
    // marginTop: '15px',
    color: 'rgb(7, 100, 206)'
  },
  icon: {
    fontSize: 50,
    // margin: '15px'
  },
  text: {
    // margin: '15px',
    fontSize: '20px',
    fontWeight: 600,
    fontFamily: 'Sarabun'
  }
}

