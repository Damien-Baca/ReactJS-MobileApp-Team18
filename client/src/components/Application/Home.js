import React, {Component} from 'react';
import {Container, Row, Col} from 'reactstrap';
import 'leaflet/dist/leaflet.css';
import Pane from './Pane'
import DestinationMap from "./DestinationMap";
import DestinationControls from "./DestinationControls";
import DestinationList from "./DestinationList";
import DestinationQuery from "./DestinationQuery";

/*
 * Renders the home page.
 */
export default class Home extends Component {
  constructor(props) {
    super(props);

    this.handleLoadJSON = this.handleLoadJSON.bind(this);
    this.handleExportFile = this.handleExportFile.bind(this);
    this.storeUserLocation = this.storeUserLocation.bind(this);
    this.reportGeoError = this.reportGeoError.bind(this);
    this.resetDistances = this.resetDistances.bind(this);
    this.calculateDistances = this.calculateDistances.bind(this);
    this.sumDistances = this.sumDistances.bind(this);
    this.setDistances = this.setDistances.bind(this);
    this.setErrorBanner = this.setErrorBanner.bind(this);
    this.renderMapPane = this.renderMapPane.bind(this);
    this.renderDestinations = this.renderDestinations.bind(this);
    this.renderDestinationQuery = this.renderDestinationQuery.bind(this);
    this.renderDestinationControls = this.renderDestinationControls.bind(this);
    this.addJsonValues = this.addJsonValues.bind(this);

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
    if (this.props.destinations.length !== 0) {
      this.convertDestinations();
    }

    return (
        <Container>
          {this.state.errorMessage}
          <Row>
            {this.generateColumn(this.renderMapPane, this.renderDestinationControls)}
            {this.generateColumn(this.renderDestinationQuery, this.renderDestinations)}
          </Row>
        </Container>
    );
  }

  renderMapPane() {
    return (
        <Pane header={'Where Am I?'}
              bodyJSX={<DestinationMap
                  userLocation={this.state.userLocation}
                  destinations={this.convertDestinations()}
                  convertCoordinates={this.props.convertCoordinates}/>}/>
    );
  }

  renderDestinationControls() {
    return (
        <Pane header={'Bon Voyage!'}
              bodyJSX={<DestinationControls
                  userLocation={this.state.userLocation}
                  distances={this.state.distances}
                  destinations={this.props.destinations}
                  addDestinations={this.props.addDestinations}
                  validation={this.props.validation}
                  optimization={this.props.options.activeOptimization}
                  sumDistances={this.sumDistances}
                  resetDistances={this.resetDistances}
                  handleLoadJSON={this.handleLoadJSON}
                  handleExportFile={this.handleExportFile}
                  handleUserDestination={this.handleUserDestination}
                  calculateDistances={this.calculateDistances}/>
              }/>
    );
  }

  renderDestinationQuery() {
    return (
      <Pane header={'Database Query'}
            bodyJSX={<DestinationQuery
                setErrorBanner={this.setErrorBanner}
                addDestinations={this.props.addDestinations}
                resetDistances={this.resetDistances}
                sendServerRequest={this.props.sendServerRequest}/>
                }/>
    );
  }

  renderDestinations() {
    return (
        <Pane header={'Destinations:'}
              bodyJSX={<DestinationList
                destinations={this.props.destinations}
                removeDestination={this.props.removeDestination}
                reverseDestinations={this.props.reverseDestinations}
                swapDestinations={this.props.swapDestinations}
                distances={this.state.distances}
                resetDistances={this.resetDistances}
                sumDistances={this.sumDistances}/>
              }/>
    );
  }

  generateColumn(renderA, renderB) {
    return (
        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
          {renderA()}
          {renderB()}
        </Col>
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
    this.setState({
      errorMessage: this.props.createErrorBanner(
          "GEOLOCATOR ERROR:",
          error.code,
          error.message
      )
    });
  }

  handleExportFile() {
    let saveTrip = {
      "requestType"    : "trip",
      "requestVersion" : 3,
      "options"        : {"optimization" : "none"},
      "places"         : this.props.destinations,
      "distances"      : this.state.distances
    };

    if(this.state.optimizations != null)
      saveTrip.options["optimization"] = this.state.optimizations;
    
    let json = JSON.stringify(saveTrip);
    if (window.navigator && window.navigator.msSaveOrOpenBlob)  {
      let blob = new Blob([json], {type: "octet/stream"});
      window.navigator.msSaveOrOpenBlob(blob, "exportedTrip.json");
    } else {
        let file = new File([json], "exportedTrip.json", {type: "octet/stream"});
        let exportUrl = URL.createObjectURL(file);
        window.location.assign(exportUrl);
        URL.revokeObjectURL(exportUrl);
    }
  }

  handleLoadJSON(fileContents) {
    if (fileContents) {
      try {
        let newTrip = JSON.parse(fileContents);
        this.addJsonValues(newTrip);

      } catch (e) {
        this.setErrorBanner( this.props.createErrorBanner(
              "File Error",
              0,
              "File has invalid JSON TIP Trip format."
          ));
      }
    } else {
      this.setErrorBanner( this.props.createErrorBanner(
            "File Error",
            0,
            "No file has been selected."
        ));
    }
  }

  resetDistances() {
    this.setState({
      distances: null
    });
  }

  calculateDistances(optimization) {
    let convertedDestinations = [];
    Object.assign([], this.props.destinations).forEach((destination) => {
      let convertedDestination = {name: destination.name};
      Object.assign(convertedDestination,
          this.props.convertCoordinates(destination.latitude,
              destination.longitude));
      convertedDestinations.push(convertedDestination);
    });

    const tipRequest = {
      'options': {
        'title': 'My Trip',
        'earthRadius': String(
            this.props.options.units[this.props.options.activeUnit]),
        'optimization': optimization
      },
      'places': convertedDestinations,
      'distances': []
    };

    this.props.sendServerRequest('trip', tipRequest, this.setDistances);
  }

  setDistances(newDistances) {
    if (newDistances !== null) {
      this.setState({
        errorMessage: newDistances.errorMessage,
        distances: newDistances.distances
      });

      if (newDistances.options.optimization === 'short') {
        let nameList = [];
        newDistances.places.forEach((place) => {
          nameList.push(place.name);
        });
        this.props.setDestinations(nameList);
      }
    }
  }

  setErrorBanner(error) {
    this.setState({
      errorMessage: error
    });
  }

  sumDistances(index = this.state.distances.length - 1) {
    const reducer = (sum, current) => { return sum + current; };

    return Object.assign([], this.state.distances).slice(0,
        index + 1).reduce(reducer);
  }

  convertDestinations() {
    let markerList = [];
    this.props.destinations.forEach((destination) => {
      markerList.push(Object.assign({}, destination))
    });

    markerList.forEach((destination) => {
      let convertedLatLong = this.props.convertCoordinates(
          destination.latitude, destination.longitude);
      destination.latitude = convertedLatLong.latitude;
      destination.longitude = convertedLatLong.longitude;
    });

    return markerList;
  }


  addJsonValues(newTrip) {
    let newState = {
      errorMessage: null,
      optimizations: newTrip.options.optimizations
    };

    this.props.addDestinations(newTrip.places);

    if (newTrip.hasOwnProperty('distances')) {
      newState['distances'] = newTrip.distances
    }

    this.setState(newState);
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