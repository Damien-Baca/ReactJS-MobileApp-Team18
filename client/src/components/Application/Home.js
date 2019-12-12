import React, {Component} from 'react';
import {Container, Row, Col} from 'reactstrap';
import 'leaflet/dist/leaflet.css';
import Pane from './Pane'
import DestinationMap from "./DestinationMap";
import DestinationControls from "./DestinationControls";
import DestinationList from "./DestinationList";
import DestinationQuery from "./DestinationQuery";
import 'ajv'

/*
 * Renders the home page.
 */
export default class Home extends Component {
  constructor(props) {
    super(props);

    this.ExportCSV = this.ExportCSV.bind(this);
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
      markerFlag: true,
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
            <Col>
              {this.renderMapPane()}
            </Col>
              {this.generateColumn(this.renderDestinationControls, this.renderDestinationQuery)}
            <Col>
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
                  handleMarkerToggle={this.props.handleMarkerToggle}
                  userLocation={this.state.userLocation}
                  destinations={this.convertDestinations()}
                  convertCoordinates={this.props.convertCoordinates}/>}/>
    );
  }

  renderDestinationControls() {
    return (
        <Pane header={'Bon Voyage!'}
              bodyJSX={<DestinationControls
                  createErrorBanner={this.props.createErrorBanner}
                  setErrorBanner={this.setErrorBanner}
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
      <Pane header={'Find a Location'}
            bodyJSX={<DestinationQuery
                typeFilter={this.props.typeFilter}
                countryFilter={this.props.countryFilter}
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
                markerKill={this.props.markerKill}
                distances={this.state.distances}
                placeAttributes={this.props.placeAttributes}
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

  ExportPlace(place) {
    let csv_file = "";
    if(place.hasOwnProperty("name"))
      csv_file += place["name"];
    csv_file += ",";

    if(place.hasOwnProperty("latitude"))
      csv_file += place["latitude"];
    csv_file += ",";

    if(place.hasOwnProperty("longitude"))
      csv_file += place["longitude"];
    csv_file += ",";

    if(place.hasOwnProperty("id"))
      csv_file += place["id"];
    csv_file += ",";

    if(place.hasOwnProperty("altitude"))
      csv_file += place["altitude"];
    csv_file += ",";

    if(place.hasOwnProperty("municipality"))
      csv_file += place["municipality"];
    csv_file += ",";

    if(place.hasOwnProperty("type"))
      csv_file += place["type"];
    csv_file += ",";

    return csv_file;
  }

  ExportCSV() {
    let csv_file = "";
    let cumulative = 0;

    csv_file += "name,latitude,longitude,id,altitude,municipality,type,distance,cumulative\n";
    for(let i = 0; i < this.props.destinations.length; i++)
    {
      csv_file += this.ExportPlace(this.props.destinations[i]);
      
      if(this.state.distances === null || i === 0) {
        csv_file += "0,0,\n";
      } else {
        cumulative += this.state.distances[i-1];
        csv_file   += this.state.distances[i-1] + ",";
        csv_file   += cumulative + ",\n";
      }
    }
    csv_file += this.ExportPlace(this.props.destinations[0]);

    if(this.state.distances === null) {
      csv_file += "0,0,\n";
    } else {
      cumulative += this.state.distances[this.state.distances.length - 1];
      csv_file   += this.state.distances[this.state.distances.length - 1] + "," + cumulative + ",\n";
    }

    return csv_file;
  }

  handleExportFile() {
    let saveTrip = { "requestType"    : "trip", "requestVersion" : 5,
      "options"        : {"optimization" : "none"},
      "places"         : this.props.destinations,
      "distances"      : this.state.distances
    };

    if(this.state.optimizations != null)
      saveTrip.options["optimization"] = this.state.optimizations;

    let data = "";
    let fileName = "default.txt";

    if(this.props.options.activeFileFormat == 'json') {
      data = JSON.stringify(saveTrip);
      fileName = "Trip.json";
    }

    if(this.props.options.activeFileFormat == 'csv') {
      data = this.ExportCSV();
      fileName = "Trip.csv";
    }
    
    if (window.navigator && window.navigator.msSaveOrOpenBlob)  {
      let blob = new Blob([data], {type: "octet/stream"});
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
        let file = new File([data], fileName, {type: "octet/stream"});
        let exportUrl = URL.createObjectURL(file);
        window.location.assign(exportUrl);
        URL.revokeObjectURL(exportUrl);
    }
  }

  handleLoadJSON(fileContents) {
    let AJV = require('ajv');
    let ajv = new AJV();
    let schema = require('../../../schemas/TIPTripFileSchema');
    try {
      let newTrip = JSON.parse(fileContents);
      if (ajv.validate(schema, newTrip)) {
        this.addJsonValues(newTrip);
      } else {
        this.setErrorBanner(this.props.createErrorBanner(
            "File Error",
            0,
            "File has invalid JSON TIP Trip format."
        ));
      }
    } catch (e) {
      this.setErrorBanner(this.props.createErrorBanner(
          "File Error",
          0,
          "File has invalid JSON TIP Trip format."
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