import React, {Component} from 'react';
import {Container, Row, Col, ListGroup, ListGroupItem, Form, FormGroup, Label, Input, Button} from 'reactstrap';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import {Map, Marker, Popup, TileLayer} from 'react-leaflet';
import Pane from './Pane'
import {sendServerRequestWithBody} from '../../api/restfulAPI'

/*
 * Renders the home page.
 */
export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: null,
      userLocation: {
        name: 'Colorado State University',
        latitude: this.csuOvalGeographicCoordinates().lat,
        longitude: this.csuOvalGeographicCoordinates().lng
      },
      newDestination: {name: '', latitude: '', longitude: ''},
      tripDistances: [-1]
    }
  }

  render() {
    return (
        <Container>
          {this.state.errorMessage}
          <Row>
            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
              {this.renderMap()}
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
              {this.renderIntro()}
              {this.renderDestinations()}
            </Col>
          </Row>
        </Container>
    );
  }

  renderMap() {
    return (
        <Pane header={'Where Am I?'}
              bodyJSX={this.renderLeafletMap()}/>
    );
  }

  renderLeafletMap() {
    // initial map placement can use either of these approaches:
    // 1: bounds={this.coloradoGeographicBoundaries()}
    // 2: center={this.csuOvalGeographicCoordinates()} zoom={10}
    return (
        <Map center={this.convertLatLng(this.state.userLocation.latitude, this.state.userLocation.longitude)} zoom={10}
             style={{height: 500, maxwidth: 700}}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                     attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          {this.renderMarkers()}
        </Map>
    )
  }

  renderMarkers() {
    let markerList = [Object.assign({}, this.state.userLocation)];

    if (this.props.destinations.length > 0) {
      markerList = Object.assign([], this.props.destinations);
    }

    return (
        markerList.map((marker, index) => (
          <Marker
            key={`marker_${index}`}
            position={L.latLng(marker.latitude, marker.longitude)}
            icon={this.markerIcon()}>
            < Popup
                className="font-weight-extrabold">{marker.name}</Popup>
          </Marker>
        ))
    );
  }

  convertLatLng(latitude, longitude) {
    return L.latLng(latitude, longitude);
  }

  renderIntro() {
    return (
        <Pane header={'Bon Voyage!'}
              bodyJSX={this.renderDestinationControls()}/>
    );
  }

  renderDestinations() {
    return (
        <Pane header={'Destinations:'}
              bodyJSX={this.renderDestinationList()}/>
    );
  }

  renderDestinationControls() {
    return (
        <Container>
          <Row>
            {this.renderAddDestination()}
          </Row>
          <Row>
            {this.renderDestinationOptions()}
          </Row>
        </Container>
    );
  }

  renderDestinationList() {
    return (
        <ListGroup>
          {this.renderList()}
        </ListGroup>
    );
  }

  renderAddDestination() {
    return (
        <Form>
          <FormGroup>
            <Label for='add_name'>New Destination</Label>
            {this.generateCoordinateInput()}
            <Button
                className='btn-csu w-100 text-left'
                key={"button_add"}
                active={true}
                onClick={() => this.handleNewDestination()}>
              Add
            </Button>
          </FormGroup>
        </Form>
    );
  }

  renderDestinationOptions() {
    return (
      <Button
          onClick={() => this.calculateDistances()}
      >Calculate Trip Distances</Button>
    );
  }

  renderList() {
    return (
        this.props.destinations.map((destination, index) => (
            <ListGroupItem key={'destination_' + index}>
              <Row>
                {destination.name}, {destination.latitude}, {destination.longitude}
              </Row>
              <Row>
                <Button className='btn-csu h-5 w-50 text-left'
                        size={'sm'}
                        key={"button_" + destination.name}
                        value='Remove'
                        active={false}
                        onClick={() => this.props.removeDestination(index)}
                >Remove</Button>
              </Row>
            </ListGroupItem>
        ))
    );
  }

  generateCoordinateInput() {
    return (Object.keys(this.state.newDestination).map((field) => (
        <Input type='text'
               name={field}
               id={`add_${field}`}
               placeholder={field.charAt(0).toUpperCase() + field.substring(1, field.length)}
               value={this.state.newDestination[field]}
               onChange={(event) => this.updateNewDestinationOnChange(event)}/>
    )));
  }

  handleNewDestination() {
    this.props.addDestination(Object.assign({}, this.state.newDestination));
    this.setState({
      newDestination: {name: '', latitude: '', longitude: ''}
    });
  }

  updateNewDestinationOnChange(event) {
    let update = Object.assign({}, this.state.newDestination);
    update[event.target.name] = event.target.value;

    this.setState({
      newDestination: update
    });
  }

  calculateDistances() {
    const tipConfigRequest = {
      'type': 'trip',
      'version': 2,
      'options': {
        'title': 'My Trip',
        'earthRadius': this.props.options.units[this.props.options.activeUnit],
        'optimization': 'none'
      },
      'destination': this.props.destinations,
      'distances': []
    };

    sendServerRequestWithBody('trip', tipConfigRequest,
        this.props.settings.serverPort).then((response) => {
      if (response.statusCode >= 200 && response.statusCode <= 299) {
        this.setState({
          tripDistances: response.body.distances,
          errorMessage: null
        });
      } else {
        this.setState({
          errorMessage: this.props.createErrorBanner(
              response.statusText,
              response.statusCode,
              `Request to ${this.props.settings.serverPort} failed.`
          )
        });
      }
    });

    console.log(`Distances returned: ${this.state.tripDistances}`);
  }

  coloradoGeographicBoundaries() {
    // northwest and southeast corners of the state of Colorado
    return L.latLngBounds(L.latLng(41, -109), L.latLng(37, -102));
  }

  csuOvalGeographicCoordinates() {
    return L.latLng(40.576179, -105.080773);
  }

  markerIcon() {
    // react-leaflet does not currently handle default marker icons correctly,
    // so we must create our own
    return L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow,
      iconAnchor: [12, 40]  // for proper placement
    })
  }
}
