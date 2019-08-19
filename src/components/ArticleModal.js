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

// animation with pose
// define the container with children behavior and then the children
// with enter / exit information
import posed from 'react-pose';
const Container = posed.div({
  enter: { staggerChildren: 150 },
  exit: { staggerChildren: 150, staggerDirection: -1 }
});

const Div = posed.div({
  enter: { x: -100, opacity: 1 },
  exit: { x: 0, opacity: 0 }
});

const Hr = posed.hr({
  enter: { x: 0, opacity: 1 },
  exit: { x: 0, opacity: 0 }
});

// google image search
const GoogleImages = require('google-images');
const client = new GoogleImages(process.env.REACT_APP_GOOGLE_CSE, process.env.REACT_APP_GOOGLE_KEY);

class ModalButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      activeIndex: 0
    };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);

  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === this.props.items.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === 0 ? this.props.items.length - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }

  render() {
    const { activeIndex } = this.state;

    return (
      <Container>
        <Modal centered={true}
          style={styles.modal}
          isOpen={this.props.modalOpen}
          toggle={this.props.toggle}>

          <ModalHeader>
            <p style={styles.title}>{this.props.title}</p>
            <i className="fas fa-times" style={styles.icon}
              onClick={this.props.toggle}></i>
          </ModalHeader>

          <ModalBody>

            {/* <p style={styles.modalDescription}>{this.props.extract}</p> */}

            <a style={styles.modalLink} className="link"
              target="_blank"
              href={`https://en.wikipedia.org/wiki/${this.props.title}`}>
              read the full wiki</a>

          </ModalBody>

          {this.props.slides ?
            <Div>
              <ModalBody>

                <Carousel
                  activeIndex={activeIndex}
                  next={this.next}
                  previous={this.previous}
                >
                  <CarouselIndicators
                    style={{ outline: 'black' }}
                    items={this.props.items}
                    activeIndex={activeIndex}
                    onClickHandler={this.goToIndex} />

                  {this.props.slides}

                  <CarouselControl
                    style={{ outline: 'black' }}
                    direction="prev"
                    directionText="Previous"
                    onClickHandler={this.previous} />

                  <CarouselControl
                    style={{ outline: 'black' }}
                    direction="next"
                    directionText="Next"
                    onClickHandler={this.next} />

                </Carousel>
              </ModalBody>
            </Div>
            :
            <ModalBody>
              <Div style={{ height: '200px' }}></Div>
              <p>Unable to fetch images</p>
            </ModalBody>}

          <ModalBody>
            <ArticleTimeSeries article={this.props.title} />
          </ModalBody>

          <ModalFooter style={styles.footer}>
            <Button style={{fontSize: '14px'}} onClick={this.props.toggle}>close</Button>
          </ModalFooter>

        </Modal>
      </Container>
    );
  }
}

const styles = {
  modal: {
    // width: '100%'
  },
  icon: {
    position: 'absolute',
    top: '10px',
    right: '10px'
  },
  title: {
    fontSize: '20px'
  },
  modalLink: {
    fontSize: '14px',
    textDecoration: 'none',
  },
  modalDescription: {
    fontSize: '14px',
  },
  image: {
    width: '100%',
    // minHeight: '400px'
  },
  footer: {
    marginTop: '50px'
  }
}

export default ModalButton;