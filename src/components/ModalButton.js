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

    if (!this.state.modal) {
      // for images from google
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
                <CarouselCaption captionText={item.caption} captionHeader={item.caption} />
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
      modal: !this.state.modal
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
        <Modal className={this.props.className}
          style={styles.modal}
          isOpen={this.state.modal}
          toggle={this.toggle}>

          <ModalHeader toggle={this.toggle}>
            <p style={styles.title}>{this.props.title}</p>
          </ModalHeader>

          <ModalBody>
            <p style={styles.modalDescription}>{this.props.extract}</p>
          </ModalBody>

          {this.state.slides &&
            <ModalBody>
              
              <Carousel
                activeIndex={activeIndex}
                next={this.next}
                previous={this.previous}
              >
                <CarouselIndicators 
                  style={{margin: '0px'}}
                  items={this.state.items} 
                  activeIndex={activeIndex} 
                  onClickHandler={this.goToIndex} />

                {this.state.slides}

                <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
                <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
              
              </Carousel>
            </ModalBody>}

          <ModalFooter>
            <Button color="link"
              style={styles.button}>
              <a target="_blank"
                href={`https://en.wikipedia.org/wiki/${this.props.title}`}>
                Click to read the full article</a>
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const styles = {
  main: {
    width: '100%'
  },

  modal: {
    width: '100%',
    // margin: '50px auto'
  },
  title: {
    fontSize: '26px'
  },
  button: {
    margin: '4px 0px',
    textDecoration: 'none',
  },
  modalDescription: {
    // margin: '10px 15px',
    fontSize: 16,
  },
  image: {
    width: '100%',
  },
  link: {
    color: 'whitesmoke',
  }
}

export default ModalButton;