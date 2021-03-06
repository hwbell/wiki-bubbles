import React from 'react';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption
} from 'reactstrap';

// styling
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';

// components
import ArticleTimeSeries from './ArticleTimeSeries';
import ArticleModal from './ArticleModal';

// google image search
const GoogleImages = require('google-images');
const client = new GoogleImages(process.env.REACT_APP_GOOGLE_CSE, process.env.REACT_APP_GOOGLE_KEY);

class ModalButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      activeIndex: 0
    };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);

    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {

  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === this.state.items.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === 0 ? this.state.items.length - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }

  toggle() {

    if (!this.state.modalOpen) {
      // for images from google API
      client.search(this.props.title)
        .then(images => {
          console.log(images)

          let items = [];
          images.forEach((image, i) => {
            items.push(
              {
                src: image.url,
                altText: `Slide ${i}`,
                caption: `Caption ${i}`
              }
            )
          });

          const slides = items.map((item) => {
            return (
              <CarouselItem
                className="carousel-image col"
                onExiting={this.onExiting}
                onExited={this.onExited}
                key={item.src}
              >
                <img src={item.src} alt={item.altText} />
                <CarouselCaption captionText={''} captionHeader={''} />
              </CarouselItem>
            );
          });

          this.setState({
            items,
            slides
          })
        });
    }

    this.setState({
      modalOpen: !this.state.modalOpen
    });

  }

  render() {
    const { activeIndex } = this.state;

    return (
      <div className="" style={styles.main}>

        <Button color="link"
          style={styles.button}
          onClick={this.toggle}>
          <p className="link">{this.props.title}</p>
        </Button>

        {/* button will toggle making this modal visible */}
          <ArticleModal
            modalOpen={this.state.modalOpen}
            toggle={this.toggle}
            title={this.props.title}
            extract={this.props.extract}
            slides={this.state.slides}
            items={this.state.items}
          />

      </div>
    );
  }
}

const styles = {
  main: {
    width: '100%'
  },

  button: {
    margin: '0px',
    padding: '0px',
    textDecoration: 'none',
  },
}

export default ModalButton;