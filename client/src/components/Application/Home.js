import React, {Component} from 'react';
import {Container, Row, Col} from 'reactstrap';
import 'leaflet/dist/leaflet.css';
import Pane from './Pane'
import DestinationMap from "../DestinationMap";
import DestinationControls from "../DestinationControls";
import DestinationList from "../DestinationList";
import {sendServerRequestWithBody} from '../../api/restfulAPI'

/*
 * Renders the home page.
 */
export default class Home extends Component {
  constructor(props) {
    super(props);

    this.handleLoadJSON = this.handleLoadJSON.bind(this);
    this.fileCallback = this.fileCallback.bind(this);
    this.handleClearDestinations = this.handleClearDestinations.bind(this);
    this.storeUserLocation = this.storeUserLocation.bind(this);
    this.reportGeoError = this.reportGeoError.bind(this);
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
              bodyJSX={<DestinationMap
                  userLocation={this.state.userLocation}
                  destinations={this.props.destinations}/>}/>
    );
  }

  renderIntro() {
    return (
        <Pane header={'Bon Voyage!'}
              bodyJSX={<DestinationControls
                  distances={this.state.distances}
                  destinations={this.props.destinations}
                  newDestination={this.state.newDestination}
                  sumDistances={this.sumDistances}
                  fileCallback={this.fileCallback}
                  handleLoadJSON={this.handleLoadJSON}
                  handleUserDestination={this.handleUserDestination}
                  updateNewDestinationOnChange={this.updateNewDestinationOnChange}
                  calculateDistances={this.calculateDistances}/>}/>
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
    this.props.removeDestination(index);
    this.resetDistances();
  }

  handleClearDestinations() {
    this.props.clearDestinations();
    this.resetDistances();
  }

  handleReverseDestinations() {
    this.props.reverseDestinations();
    this.resetDistances();
  }

  fileCallback(string) {
    this.setState({fileContents: string});
  }

  resetDistances() {
    this.setState({
      distances: null
    });
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
      'version': 3,
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


/* not currently used, may be used in future sprints.
  coloradoGeographicBoundaries() {
    // northwest and southeast corners of the state of Colorado
    return L.latLngBounds(L.latLng(41, -109), L.latLng(37, -102));
  }*/

  csuOvalGeographicCoordinates() {
    return L.latLng(40.576179, -105.080773);
  }
}