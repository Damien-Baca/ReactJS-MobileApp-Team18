import React, {Component} from 'react';
import {Container} from 'reactstrap';

import Home from './Home';
import Options from './Options/Options';
import Calculator from './Calculator/Calculator';
import About from './About/About';
import Settings from './Settings/Settings';
import {getOriginalServerPort, sendServerRequest} from '../../api/restfulAPI';
import ErrorBanner from './ErrorBanner';

/* Renders the application.
 * Holds the destinations and options state shared with the trip.
 */
export default class Application extends Component {
  constructor(props) {
    super(props);

    this.updatePlanOption = this.updatePlanOption.bind(this);
    this.updateClientSetting = this.updateClientSetting.bind(this);
    this.createApplicationPage = this.createApplicationPage.bind(this);
    this.addDestination = this.addDestination.bind(this);
    this.removeDestination = this.removeDestination.bind(this);

    this.state = {
      serverConfig: null,
      planOptions: {
        units: {'miles': 3959, 'kilometers': 6371},
        activeUnit: 'miles'
      },
      clientSettings: {
        serverPort: getOriginalServerPort()
      },
      //FIXME test value
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
        return <Calculator options={this.state.planOptions}
                           settings={this.state.clientSettings}
                           createErrorBanner={this.createErrorBanner}/>;
      case 'options':
        return <Options options={this.state.planOptions}
                        config={this.state.serverConfig}
                        updateOption={this.updatePlanOption}/>;

      case 'about':
        return <About/>;

      case 'settings':
        return <Settings settings={this.state.clientSettings}
                         serverConfig={this.state.serverConfig}
                         updateSetting={this.updateClientSetting}/>;
      default:
        return <Home options={this.state.planOptions}
                     destinations={this.state.destinations}
                     addDestination={this.addDestination}
                     removeDestination={this.removeDestination}/>;
    }
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

  addDestination(newDestination, index = (this.state.destinations.length)) {
    console.log(`Adding destination ${newDestination.name}, ${newDestination.latitude}, ${newDestination.longitude} at ${index}`);
    if (newDestination.name !== '') {
      this.state.destinations.splice(index, 0, newDestination);
      this.setState({
        destinationList: this.state.destinations
      });
    }
  }

  removeDestination(index) {
    this.state.destinations.splice(index, 1);
    this.setState({
      destinations: this.state.destinations
    });
  }
}
