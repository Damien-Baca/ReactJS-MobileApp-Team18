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
    this.handleExportFile = this.handleExportFile.bind(this);
    this.storeUserLocation = this.storeUserLocation.bind(this);
    this.reportGeoError = this.reportGeoError.bind(this);
    this.resetDistances = this.resetDistances.bind(this);
    this.calculateDistances = this.calculateDistances.bind(this);
    this.sumDistances = this.sumDistances.bind(this);
    this.sendServerRequest = this.sendServerRequest.bind(this);
    this.setDistances = this.setDistances.bind(this);
    this.renderMapPane = this.renderMapPane.bind(this);
    this.renderDestinations = this.renderDestinations.bind(this);
    this.renderDestinationQuery = this.renderDestinationQuery.bind(this);
    this.renderDestinationControls = this.renderDestinationControls.bind(this);

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
                  destinations={this.props.destinations}/>}/>
    );
  }

  renderDestinationControls() {
    return (
        <Pane header={'Bon Voyage!'}
              bodyJSX={<DestinationControls
                  userLocation={this.state.userLocation}
                  distances={this.state.distances}
                  destinations={this.props.destinations}
                  addDestination={this.props.addDestination}
                  validation={this.props.validation}
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
            addDestination={this.props.addDestination}
            resetDistances={this.resetDistances}
            sendServerRequest={this.sendServerRequest}/>
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
                clearDestinations={this.props.clearDestinations}
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

    var saveTrip = {
      "requestType"    : "trip",
      "requestVersion" : 3,
      "options"        : {"optimization" : "none"},
      "places"         : this.props.destinations,
      "distances"      : this.state.distances
    }

    if(this.state.optimizations != null)
      saveTrip.options["optimization"] = this.state.optimizations;
    
    var json = JSON.stringify(saveTrip);
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

  async calculateDistances() {
    let convertedDestinations = [];
    this.props.destinations.forEach((destination) => {
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
        'optimization': 'none'
      },
      'places': convertedDestinations,
      'distances': []
    };

    this.sendServerRequest('trip', tipRequest, this.setDistances);
  }

  setDistances(newDistances) {
    if (newDistances !== null) {
      this.setState({
        errorMessage: newDistances.errorMessage,
        distances: newDistances.distances
      })
    }
  }

  sendServerRequest(type, tipRequest, callback) {
    let tipConfigRequest = {
      requestType: type,
      requestVersion: 3,
    };

    Object.entries(tipRequest).forEach((entry) => {
      tipConfigRequest[entry[0]] = entry[1];
    });

    sendServerRequestWithBody(type, tipConfigRequest,
        this.props.settings.serverPort).then((response) => this.handleServerResponse(response, callback));
  }

  handleServerResponse(response, callback) {
      if (response.statusCode >= 200 && response.statusCode <= 299) {
        let returnState =  Object.assign({}, {
          errorMessage: null
        });
        Object.entries(response.body).forEach((entry) => {
          returnState[entry[0]] = entry[1];
        });

        callback(returnState);
      } else {
        this.setState({
          errorMessage: this.props.createErrorBanner(
              response.statusText,
              response.statusCode,
              `Request to ${this.props.settings.serverPort} failed.`
          )
        });
      }
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