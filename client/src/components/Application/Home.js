import React, {Component} from 'react';
import {Container, Row, Col, Form, FormGroup, Label, Input, Button} from 'reactstrap';
import 'leaflet/dist/leaflet.css';
import Pane from './Pane'
import DestinationMap from "../DestinationMap";
import DestinationList from "../DestinationList";
import {sendServerRequestWithBody} from '../../api/restfulAPI'

/*
 * Renders the home page.
 */
export default class Home extends Component {
  constructor(props) {
    super(props);

    this.handleLoadJSON = this.handleLoadJSON.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.fileCallback = this.fileCallback.bind(this);
    this.handleClearDestinations = this.handleClearDestinations.bind(this);
    this.storeUserLocation = this.storeUserLocation.bind(this);
    this.reportGeoError = this.reportGeoError.bind(this);
    this.sumDistances = this.sumDistances.bind(this);
    this.handleRemoveDestination = this.handleRemoveDestination.bind(this);
    this.handleReverseDestinations = this.handleReverseDestinations.bind(this);

    this.state = {
      errorMessage: null,
      userLocation: {
        name: 'Colorado State University',
        latitude: this.csuOvalGeographicCoordinates().lat,
        longitude: this.csuOvalGeographicCoordinates().lng
      },

      newDestination: {name: '', latitude: '', longitude: ''},
      distances: null,
      optimizations: null,
      fileContents: null,
      mapBoundaries: {
        maxLat: '',
        minLat: '',
        maxLon: '',
        minLon: ''
      },
      valid: {name: false, latitude: false, longitude: false},
      invalid: {name: false, latitude: false, longitude: false},
    };

    this.handleGetUserLocation();
  }

  render() {
    return (
        <Container>
          {this.state.errorMessage}
          <Row>
            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
              {this.renderMapPane()}
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
              {this.renderIntro()}
              {this.renderDestinations()}
            </Col>
          </Row>
        </Container>
    );
  }

  renderMapPane() {
    return (
        <Pane header={'Where Am I?'}
              bodyJSX={this.renderMap()}/>
    );
  }

  renderMap() {
    return (
      <DestinationMap
          userLocation={this.state.userLocation}
          destinations={this.props.destinations}/>
    );
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
              bodyJSX={<DestinationList
                destinations={this.props.destinations}
                distances={this.state.distances}
                sumDistances={this.sumDistances}
                handleRemoveDestination={this.handleRemoveDestination}
                handleClearDestinations={this.handleClearDestinations}
                handleReverseDestinations={this.handleReverseDestinations}/>
              }/>
    );
  }

  renderDestinationControls() {
    return (
        <Container>
          <Row>
            {this.renderConditionalCumulativeDistance()}
          </Row>
          <Row>
            {this.renderAddDestination()}
          </Row>
          <Row>
            {this.renderDestinationOptions()}
          </Row>
        </Container>
    );
  }

  renderConditionalCumulativeDistance() {
    if (this.state.distances !== null) {
      return (
          <Label>Cumulative Trip
            Distance: {this.sumDistances()}</Label>
      );
    }

    return (
        <Label>Trip distance not yet calculated.</Label>
    );
  }

  renderDestinationOptions() {
    return (
        <Button
            name='calculate'
            onClick={() => this.calculateDistances()}
            disabled={this.props.destinations.length === 0}
        >Calculate Trip Distances</Button>
    );
  }

  renderAddDestination() {
    return (
        <Form>
          <FormGroup>
            <Label for='add_name'>New Destination</Label>
            {this.generateCoordinateInput()}
            {this.renderAddDestinationButton()}
            {this.renderAddUserDestinationButton()}
            {this.renderJSONInput()}
            {this.renderAddJSONButton()}
          </FormGroup>
        </Form>
    );
  }

  renderAddDestinationButton() {
    return (
        <Button
            className='btn-csu w-100 text-left'
            name='add_new_destination'
            key='button_add_destination'
            active={true}
            onClick={() => this.handleNewDestination()}
            disabled={!(this.state.valid.latitude && this.state.valid.longitude)
            || (this.state.newDestination.name === '')}>
          Add New Destination
        </Button>
    );
  }

  renderAddUserDestinationButton() {
    return (
        <Button
            className='btn-csu w-100 text-left'
            name='add_user_destination'
            key='button_add_user_destination'
            active={true}
            onClick={() => this.handleUserDestination()}>
          Add User Location
        </Button>
    );
  }

  renderJSONInput() {
    return (
        <Input type='file'
               id='fileItem'
               key='input_json_file'
               name='json_file'
               onChange={event => this.onFileChange(event)}/>
    );
  }

  renderAddJSONButton() {
    return (
        <Button
            className='btn-csu w-100 text-left'
            name='loadJSON'
            key='button_loadJSON'
            active={true}
            onClick={() => this.handleLoadJSON()}>
          Import JSON
        </Button>
    );
  }

  handleGetUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((this.storeUserLocation),
          (this.reportGeoError));
    } else {
      this.setState({
        errorMessage: this.props.createErrorBanner(
            'GEOLOCATOR ERROR:',
            "0",
            `Geolocator not supported by your browser.`
        )
      });
    }
  }

  storeUserLocation(position) {
    let newUserLocation = {
      name: 'You Are Here',
      latitude: String(position.coords.latitude),
      longitude: String(position.coords.longitude)
    };

    this.setState({
      userLocation: newUserLocation
    })
  }

  reportGeoError(error) {
    console.log(error.message);
    this.setState({
      errorMessage: this.props.createErrorBanner(
          "GEOLOCATOR ERROR:",
          error.code,
          error.message
      )
    });
  }

  fileCallback(string) {
    this.setState({fileContents: string});
  }

  onFileChange(event) {
    let callback = this.fileCallback;
    let fileIn = event.target;
    if (fileIn) {
      let file = fileIn.files[0];
      let reader = new FileReader();

      reader.onloadend = function () {
        callback(this.result);
      };

      reader.readAsText(file);
    }
  }

  handleLoadJSON() {
    if (this.state.fileContents) {
      try {
        let newTrip = JSON.parse(this.state.fileContents);
        this.setState({errorMessage: null});

        newTrip.places.forEach((destination) => (
            this.props.addDestination(Object.assign({}, destination))
        ));

        if (newTrip.hasOwnProperty('distances')) {
          let newDist = [];
          Object.assign(newDist, this.state.distances);
          newTrip.distances.forEach((distance) => (
              newDist.push(distance)
          ));
          this.setState({distances: newDist});
        }

        this.setState({optimizations: newTrip.options["optimization"]});

      } catch (e) {
        this.setState({
          errorMessage: this.props.createErrorBanner(
              "File Error",
              0,
              "File has invalid JSON TIP Trip format."
          )
        });
      }
    } else {
      this.setState({
        errorMessage: this.props.createErrorBanner(
            "File Error",
            0,
            "No file has been selected."
        )
      });
    }
  }

  generateCoordinateInput() {
    return (Object.keys(this.state.newDestination).map((field) => (
        <Input type='text'
               key={'input_' + field}
               name={field}
               id={`add_${field}`}
               placeholder={field.charAt(0).toUpperCase() + field.substring(1,
                   field.length)}
               value={this.state.newDestination[field]}
               valid={this.state.valid[field]} //THIS.STATE.VALID[FIELD]
               invalid={this.state.invalid[field]}
               onChange={(event) => this.updateNewDestinationOnChange(event)}/>
    )));
  }

  handleNewDestination() {
    this.props.addDestination(Object.assign({}, this.state.newDestination));
    let superFalse = {latitude: false, longitude: false};
    this.setState({
      newDestination: {name: '', latitude: '', longitude: ''},
      valid: superFalse,
      invalid: superFalse
    });
  }

  handleUserDestination() {
    this.props.addDestination(Object.assign({}, this.state.userLocation));
  }

  updateNewDestinationOnChange(event) {

    if (event.target.value === '' || event.target.name === 'name') { //empty or field is name
      this.setValidState(event.target.name, event.target.value, false, false);
    } else if (this.props.validation(event.target.name, event.target.value)) { //if coord is good
      this.setValidState(event.target.name, event.target.value, true, false);
    } else { //bad coord
      this.setValidState(event.target.name, event.target.value, false, true);
    }
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

  handleRemoveDestination(index) {
    this.setState({
      distances: null
    });
    this.props.removeDestination(index);
  }

  handleClearDestinations() {
    this.props.clearDestinations();
    this.setState({
      distances: null
    });
  }

  handleReverseDestinations() {
    this.props.reverseDestinations();
  }

  calculateDistances() {
    let convertedDestinations = [];
    this.props.destinations.forEach((destination) => {
      let convertedDestination = {name: destination.name};
      Object.assign(convertedDestination,
          this.props.convertCoordinates(destination.latitude,
              destination.longitude));
      convertedDestinations.push(convertedDestination);
    });
    const tipConfigRequest = {
      'type': 'trip',
      'version': 2,
      'options': {
        'title': 'My Trip',
        'earthRadius': String(
            this.props.options.units[this.props.options.activeUnit]),
        'optimization': 'none'
      },
      'places': convertedDestinations,
      'distances': []
    };

    this.handleServerTripRequest(tipConfigRequest);
  }

  handleServerTripRequest(tipConfigRequest) {
    sendServerRequestWithBody('trip', tipConfigRequest,
        this.props.settings.serverPort).then((response) => {
      if (response.statusCode >= 200 && response.statusCode <= 299) {
        this.setState({
          distances: Object.assign([], response.body.distances),
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
  }

  sumDistances(index = this.state.distances.length - 1) {
    const reducer = (sum, current) => {
      return sum + current;
    };

    let distanceSlice = Object.assign([], this.state.distances).slice(0,
        index + 1);

    return distanceSlice.reduce(reducer);

  }

  coloradoGeographicBoundaries() {
    // northwest and southeast corners of the state of Colorado
    return L.latLngBounds(L.latLng(41, -109), L.latLng(37, -102));
  }

  csuOvalGeographicCoordinates() {
    return L.latLng(40.576179, -105.080773);
  }
}