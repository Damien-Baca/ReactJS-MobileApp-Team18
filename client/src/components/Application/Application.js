import React, {Component} from 'react';
import {Container} from 'reactstrap';

import Home from './Home/Home';
import Options from './Options/Options';
import Calculator from './Calculator/Calculator';
import About from './About/About';
import Settings from './Settings/Settings';
import {
  getOriginalServerPort,
  sendServerRequest,
  sendServerRequestWithBody
} from '../../api/restfulAPI';
import ErrorBanner from './ErrorBanner';
import 'coordinate-parser';
import 'ajv'

/* Renders the application.
 * Holds the destinations and options state shared with the trip.
 */
export default class Application extends Component {
  constructor(props) {
    super(props);

    this.updatePlanOption = this.updatePlanOption.bind(this);
    this.updateClientSetting = this.updateClientSetting.bind(this);
    this.createApplicationPage = this.createApplicationPage.bind(this);
    this.addDestinations = this.addDestinations.bind(this);
    this.removeDestination = this.removeDestination.bind(this);
    this.setDestinations = this.setDestinations.bind(this);
    this.reverseDestinations = this.reverseDestinations.bind(this);
    this.convertCoordinates = this.convertCoordinates.bind(this);
    this.validateCoordinates = this.validateCoordinates.bind(this);
    this.validation = this.validation.bind(this);
    this.swapDestinations = this.swapDestinations.bind(this);
    this.sendServerRequest = this.sendServerRequest.bind(this);
    this.handleServerResponse = this.handleServerResponse.bind(this);
    this.validateSchema = this.validateSchema.bind(this);

    this.state = {
      serverConfig: null,
      planOptions: {
        units: {'miles': 3958.8, 'kilometers': 6371, 'nautical miles': 3440.1},
        activeUnit: 'miles',
        optimizations: ['none', 'short', 'shorter', 'shortest'],
        activeOptimization: 'short',
        formats: ['json', 'csv'],
        activeFileFormat: 'json'
      },
      clientSettings: {
        serverPort: getOriginalServerPort()
      },
      placeAttributes: [],
      destinations: [],
      filter: [''],
      typeFilter: [],
      countryFilter: [],
      errorMessage: null
    };

    this.updateServerConfig();
  }

  render() {
    let pageToRender = this.state.serverConfig ? this.props.page : 'settings';

    return (
        <div className='application-width'>
          {this.state.errorMessage}{this.createApplicationPage(pageToRender)}
        </div>
    );
  }

  updateClientSetting(field, value) {
    if (field === 'serverPort') {
      this.setState({clientSettings: {serverPort: value}},
          this.updateServerConfig);
    } else {
      let newSettings = Object.assign({}, this.state.planOptions);
      newSettings[field] = value;
      this.setState({clientSettings: newSettings});
    }
  }

  updatePlanOption(option, value) {
    let optionsCopy = Object.assign({}, this.state.planOptions);
    optionsCopy[option] = value;
    this.setState({'planOptions': optionsCopy});
  }

  updateServerConfig() {
    sendServerRequest('config', this.state.clientSettings.serverPort).then(
        config => {
          console.log(config);
          this.processConfigResponse(config);
        });
  }

  createErrorBanner(statusText, statusCode, message) {
    return (
        <ErrorBanner statusText={statusText}
                     statusCode={statusCode}
                     message={message}/>
    );
  }

  createApplicationPage(pageToRender) {
    switch (pageToRender) {
      case 'calc':
        return this.renderCalculator();

      case 'options':
        return (
          <Options options={this.state.planOptions}
                   config={this.state.serverConfig}
                   updateOption={this.updatePlanOption}/>
                   );

      case 'about':
        return <About/>;

      case 'settings':
        return (
            <Settings settings={this.state.clientSettings}
                      serverConfig={this.state.serverConfig}
                      updateSetting={this.updateClientSetting}/>
        );

      default:
        return this.renderHome();
    }
  }

  renderCalculator() {
    return (
      <Calculator options={this.state.planOptions}
                  settings={this.state.clientSettings}
                  createErrorBanner={this.createErrorBanner}
                  convertCoordinates={this.convertCoordinates}
                  validation={this.validation}
                  sendServerRequest={this.sendServerRequest}/>
    );
  }

  renderHome() {
    return (
        <Home options={this.state.planOptions}
              destinations={this.state.destinations}
              settings={this.state.clientSettings}
              typeFilter={this.state.typeFilter}
              countryFilter={this.state.countryFilter}
              placeAttributes={this.state.placeAttributes}
              swapDestinations={this.swapDestinations}
              addDestinations={this.addDestinations}
              removeDestination={this.removeDestination}
              setDestinations={this.setDestinations}
              reverseDestinations={this.reverseDestinations}
              createErrorBanner={this.createErrorBanner}
              convertCoordinates={this.convertCoordinates}
              validation={this.validation}
              validateCoordinates={this.validateCoordinates}
              sendServerRequest={this.sendServerRequest}/>
    );
  }

  processConfigResponse(config) {
    this.validateSchema(config);

    if (config.statusCode >= 200 && config.statusCode <= 299) {
      this.configSet(config);
    } else {
      this.setState({
        serverConfig: null,
        errorMessage:
            <Container>
              {this.createErrorBanner(config.statusText, config.statusCode,
                  `Failed to fetch config from ${this.state.clientSettings.serverPort}. Please choose a valid server.`)}
            </Container>
      });
    }
  }

  configSet(config) {
    console.log("Switching to server ", this.state.clientSettings.serverPort);
    let newTypes = Object.assign([], this.state.typeFilter);
    let newCountries = Object.assign([], this.state.countryFilter);
    let newPlaceAttributes = [];

    Object.entries(config.body).forEach((entry) => {
      if (entry[0] === "filters") {
        Object.assign([], entry[1][0]["values"]).forEach((type) => {
          newTypes.push(type);
        });
        Object.assign([], entry[1][1]["values"]).forEach((country) => {
          newCountries.push(country);
        });
      } else if (entry[0] === 'placeAttributes') {
        Object.assign([], entry[1]).forEach((attribute) => {
          newPlaceAttributes.push(attribute);
        });
      }
    });

    this.setState({
      serverConfig: config.body,
      placeAttributes: newPlaceAttributes,
      typeFilter: newTypes,
      countryFilter: newCountries,
      errorMessage: null
    });
  }

  addDestinations(newDestinations, index = (this.state.destinations.length)) {
    if (newDestinations.length > 0) {
      let newDestinationList = Object.assign([], this.state.destinations);

      newDestinations.forEach((destination, offset) => {
        newDestinationList.splice(index + offset, 0, destination);
      });

      this.setState({
        destinations: newDestinationList
      });
    }
  }

  removeDestination(index) {
    let newDestinationList = [];

    if (index >= 0) {
      Object.assign(newDestinationList, this.state.destinations);
      newDestinationList.splice(index, 1);
    }

    this.setState({
      destinations: newDestinationList
    });
  }

  reverseDestinations() {
    if (this.state.destinations.length > 0) {
      let newDestinations = [];
      Object.assign(newDestinations,
          this.state.destinations.slice(1).reverse());

      newDestinations.splice(0, 0,
          Object.assign({}, this.state.destinations[0]));

      this.setState({
        destinations: newDestinations
      });
    }
  }

  setDestinations(names) {
    let newDestinationList = [];

    names.forEach((name) => {
      let newDestination = {};

      this.state.destinations.forEach((destination) => {
        if (destination.name === name) {
          newDestination = Object.assign({}, destination);
        }
      });

      newDestinationList.push(newDestination);
    });

    this.setState({
      destinations: newDestinationList
    });
  }

  swapDestinations(index1, index2) {
    let newDestinationList = Object.assign([], this.state.destinations);
    let movedDestination = newDestinationList.splice(index1, 1)[0];
    newDestinationList.splice(index2, 0, movedDestination);

    this.setState({
      destinations: newDestinationList
    });
  }

  validation(name, value){
    let valid = false;
    if (name === 'name')  {valid = true;}
    else if (name === 'latitude') {
      valid = this.validateCoordinates(value, 0);
    } else if (name === 'longitude') {
      valid = this.validateCoordinates(0, value);
    } else {
      valid = this.validateCoordinates(name, value)
    }
    return valid;
  }

  validateCoordinates(latitude, longitude){
    let Coordinates = require('coordinate-parser');
    let isValid = true;
    try {
      new Coordinates(latitude+ " " +longitude);
      //set error banner : null
      return isValid;
    } catch (error) {
      isValid = false;
      //error banner throw
      return isValid;
    }
  }

  convertCoordinates(latitude,longitude) {
    let Coordinates = require('coordinate-parser');
    let converter = new Coordinates(`${latitude} ${longitude}`);
    return {latitude: String(converter.getLatitude()),longitude: String(converter.getLongitude())};
  }

  sendServerRequest(type, tipRequest, callback) {
    let tipConfigRequest = {
      requestType: type,
      requestVersion: 5,
    };

    Object.entries(tipRequest).forEach((entry) => {
      tipConfigRequest[entry[0]] = entry[1];
    });

    let requestType = type;
    if (requestType === "locations") {
      requestType = requestType.slice(0, requestType.length - 1);
    }

    sendServerRequestWithBody(requestType, tipConfigRequest,
        this.state.clientSettings.serverPort).then((response) => this.handleServerResponse(response, callback));
  }

  handleServerResponse(response, callback) {
    if (response.statusCode >= 200 && response.statusCode <= 299) {
      let returnState =  Object.assign({}, {
        errorMessage: null
      });
      this.validateSchema(response);
      Object.entries(response.body).forEach((entry) => {
        returnState[entry[0]] = entry[1];
      });

      callback(returnState);
    } else {
      return {
        errorMessage: this.createErrorBanner(
            response.statusText,
            response.statusCode,
            `Request to ${this.state.clientSettings.serverPort} failed.`
        )
      };
    }
  }

  validateSchema(response) {
    let Ajv = require('ajv');
    let ajv = new Ajv();
    let TIPType = response.body.requestType;
    let TIPSchema;
    switch (TIPType) {
      case 'config':
        TIPSchema = require('../../../schemas/TIPConfigResponseSchema');
        break;
      case 'distance':
        TIPSchema = require('../../../schemas/TIPDistanceResponseSchema');
        break;
      case 'trip':
        TIPSchema = require('../../../schemas/TIPTripFileSchema');
        break;
      case 'locations':
        TIPSchema = require('../../../schemas/TIPLocationsResponseSchema');
        break;
    }
    if(!ajv.validate(TIPSchema,response.body)){
      this.setState({
        errorMessage: this.createErrorBanner(
            "Server Response Error",
            0,
            `Response from server does not match schema`
        )});
    }else{
      this.setState({
        errorMessage: null
      });
    }
  }
}
