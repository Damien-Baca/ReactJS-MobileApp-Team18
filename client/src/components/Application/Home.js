import React, {Component} from 'react';
import {Container, Row, Col, ListGroup, ListGroupItem, Form, FormGroup, Label, Input, Button} from 'reactstrap';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import {Map, Marker, Popup, TileLayer} from 'react-leaflet';
import Pane from './Pane'
import validateCoordinates from "./Application";

/*
 * Renders the home page.
 */
export default class Home extends Component {
  constructor(props) {
    super(props);

    this.onFileChange = this.onFileChange.bind(this);
    this.fileCallback = this.fileCallback.bind(this);
    this.storeUserLocation = this.storeUserLocation.bind(this);

    this.fileContents = "";

    this.state = {
      userLocation: {
        name: 'Colorado State University',
        latitude: this.csuOvalGeographicCoordinates().lat,
        longitude: this.csuOvalGeographicCoordinates().lng

      },

      newDestination: {name: '', latitude: '', longitude: ''},
      valid: {name: false, latitude: false, longitude: false},
      invalid: {name: false, latitude: false, longitude: false},
    };

    this.getUserLocation();
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((this.storeUserLocation));
    } else {
    }
  }

  storeUserLocation(position) {
    let newUserLocation = {
      name: 'You Are Here',
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };

    this.setState({
      userLocation: newUserLocation
    })
  }

  render() {
    return (
        <Container>
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
              bodyJSX={this.renderAddDestination()}/>
    );
  }

  renderDestinations() {
    return (
        <Pane header={'Destinations:'}
              bodyJSX={this.renderDestinationList()}/>
    );
  }

  renderDestinationList() {
    return (
        <ListGroup>
          {this.renderList()}
        </ListGroup>
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
                onClick={() => this.handleNewDestination()}
                disabled={ !(this.state.valid.latitude && this.state.valid.longitude)
                          || (this.state.newDestination.name === '')}
            >
              Add
            </Button>
            <hr/>
            <input type='file' id='fileItem' onChange={event => this.onFileChange(event)}/>
          </FormGroup>
        </Form>
    );
  }

  fileCallback(string) {
    this.fileContents = string;
    console.log(this.fileContents);
  }

  onFileChange(event) {
    let callback = this.fileCallback;
    let fileIn = event.target;
    if(fileIn) {
      let file = fileIn.files[0];
      let reader = new FileReader();

      reader.onloadend = function() {
        callback(this.result);
      };

      reader.readAsText(file);
      }
    }

  generateCoordinateInput() {
    return (Object.keys(this.state.newDestination).map((field) => (
        <Input type='text'
               name={field}
               id={`add_${field}`}
               placeholder={field.charAt(0).toUpperCase() + field.substring(1, field.length)}
               value={this.state.newDestination[field]}
               valid={ this.state.valid[field] } //THIS.STATE.VALID[FIELD]
               invalid={ this.state.invalid[field] }
               onChange={(event) => this.updateNewDestinationOnChange(event)}/>
    )));
  }

  handleNewDestination() {
    this.props.addDestination(Object.assign({}, this.state.newDestination));
    let superFalse = {latitude:false, longitude: false};
    this.setState({
      newDestination: {name: '', latitude: '', longitude: ''},
      valid: superFalse,
      invalid: superFalse
    });
  }

  updateNewDestinationOnChange(event) {

    if (event.target.value === '' || event.target.name === 'name' ) { //empty or field is name
      this.setValidState(event.target.name, event.target.value, false, false);
    } else if (this.validation(event.target.name, event.target.value) ) { //if coord is good
      this.setValidState(event.target.name, event.target.value, true, false);
    } else { //bad coord
      this.setValidState(event.target.name, event.target.value, false, true);
    }
  }

  validation(name, value){
    let valid = false;
    if (name === 'name')  {valid = true;}
    else if (name === 'latitude') {
      valid = this.props.validateCoordinates(value, 0);
    } else if (name === 'longitude') {
      valid = this.props.validateCoordinates(0, value);
    }
    return valid;
  }

  setValidState(name, value, valid, invalid) {
    let update = Object.assign({}, this.state.newDestination);
    update[name] = value;
    let cloneValid = Object.assign({}, this.state.valid);
    cloneValid[name] = valid;
    let cloneInvalid = Object.assign({}, this.state.invalid);
    cloneInvalid[name] = invalid;
    this.setState({
      newDestination: update,
      valid: cloneValid,
      invalid: cloneInvalid
    });
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
