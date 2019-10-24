import React, {Component} from 'react';
import {Container} from 'reactstrap';

import Home from './Home';
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

    this.state = {
      serverConfig: null,
      planOptions: {
        units: {'miles': 3958.8, 'kilometers': 6371},
        activeUnit: 'miles',
        optimizations: ['none', 'short'],
        activeOptimization: 'none',
        formats: ['json', 'csv'],
        activeFileFormat: 'json'
      },
      clientSettings: {
        serverPort: getOriginalServerPort()
      },
      destinations: [],
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
              swapDestinations={this.swapDestinations}
              addDestinations={this.addDestinations}
              removeDestination={this.removeDestination}
              setDestiantions={this.setDestinations}
              reverseDestinations={this.reverseDestinations}
              createErrorBanner={this.createErrorBanner}
              convertCoordinates={this.convertCoordinates}
              validation={this.validation}
              validateCoordinates={this.validateCoordinates}
              sendServerRequest={this.sendServerRequest}/>
    );
  }

  processConfigResponse(config) {
    if (config.statusCode >= 200 && config.statusCode <= 299) {
      console.log("Switching to server ", this.state.clientSettings.serverPort);
      this.setState({
        serverConfig: config.body,
        errorMessage: null
      });
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

  addDestinations(newDestinations, index = (this.state.destinations.length)) {
    if (newDestinations.length > 0) {
      let newDestinationList = Object.assign([], this.state.destinations);

      newDestinations.forEach((destination) => {
        newDestinationList.splice(index, 0, {
          name: String(destination.name),
          latitude: String(destination.latitude),
          longitude: String(destination.longitude)
        });
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
    this.setState({
      destinations: Object.assign([], this.state.destinations).reverse()
    });
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
      requestVersion: 3,
    };

    Object.entries(tipRequest).forEach((entry) => {
      tipConfigRequest[entry[0]] = entry[1];
    });

    sendServerRequestWithBody(type, tipConfigRequest,
        this.state.clientSettings.serverPort).then((response) => this.handleServerResponse(response, callback));
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
      return {
        errorMessage: this.createErrorBanner(
            response.statusText,
            response.statusCode,
            `Request to ${this.state.clientSettings.serverPort} failed.`
        )
      };
    }
  }
}