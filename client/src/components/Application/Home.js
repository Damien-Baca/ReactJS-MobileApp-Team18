import React, {Component} from 'react';
import {Container, Row, Col} from 'reactstrap';
import 'leaflet/dist/leaflet.css';
import Pane from './Pane'
import DestinationMap from "./DestinationMap";
import DestinationControls from "./DestinationControls";
import DestinationList from "./DestinationList";
import {sendServerRequestWithBody} from '../../api/restfulAPI'
import DestinationQuery from "./DestinationQuery";

/*
 * Renders the home page.
 */
export default class Home extends Component {
  constructor(props) {
    super(props);

    this.handleLoadJSON = this.handleLoadJSON.bind(this);
    this.storeUserLocation = this.storeUserLocation.bind(this);
    this.reportGeoError = this.reportGeoError.bind(this);
    this.resetDistances = this.resetDistances.bind(this);
    this.calculateDistances = this.calculateDistances.bind(this);
    this.sumDistances = this.sumDistances.bind(this);
    this.handleUserDestination = this.handleUserDestination.bind(this);


    this.state = {
      errorMessage: null,
      userLocation: {
        name: 'Colorado State University',
        latitude: this.csuOvalGeographicCoordinates().lat,
        longitude: this.csuOvalGeographicCoordinates().lng
      },
      distances: null,
      optimizations: null
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
              {this.renderDestinationControls()}
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
              {this.renderDestinationQuery()}
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

  renderDestinationControls() {
    return (
        <Pane header={'Bon Voyage!'}
              bodyJSX={<DestinationControls
                  distances={this.state.distances}
                  destinations={this.props.destinations}
                  addDestination={this.props.addDestination}
                  validation={this.props.validation}
                  sumDistances={this.sumDistances}
                  resetDistances={this.resetDistances}
                  handleLoadJSON={this.handleLoadJSON}
                  handleUserDestination={this.handleUserDestination}
                  calculateDistances={this.calculateDistances}/>}/>
    );
  }

  renderDestinationQuery() {
    return (
      <Pane header={'Database Query'}
            bodyJSX={<DestinationQuery/>}/>
    );
  }

  renderDestinations() {
    return (
        <Pane header={'Destinations:'}
              bodyJSX={<DestinationList
                destinations={this.props.destinations}
                removeDestination={this.props.removeDestination}
                reverseDestinations={this.props.reverseDestinations}
                clearDestinations={this.props.clearDestinations}
                swapDestinations={this.props.swapDestinations}
                distances={this.state.distances}
                resetDistances={this.resetDistances}
                sumDistances={this.sumDistances}/>
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

  handleUserDestination() {
    this.props.addDestination(Object.assign({}, this.state.userLocation));
    this.resetDistances();
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

  handleLoadJSON(fileContents) {
    if (fileContents) {
      try {
        let newTrip = JSON.parse(fileContents);
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

    this.sendServerTripRequest(tipConfigRequest);
  }

  sendServerTripRequest(tipConfigRequest) {
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