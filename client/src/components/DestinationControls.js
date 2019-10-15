import React, {Component} from 'react';
import {Button, Container, Form, FormGroup, Input, Label, Row} from "reactstrap";

export default class DestinationControls extends Component {
    constructor(props) {
      super(props);

      this.state = {
        newDestination: {name: '', latitude: '', longitude: ''},
        valid: {name: false, latitude: false, longitude: false},
        invalid: {name: false, latitude: false, longitude: false},
        fileContents: null
      };
  }

  render() {
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
    if (this.props.distances !== null) {
      return (
          <Label>Cumulative Trip
            Distance: {this.props.sumDistances()}</Label>
      );
    }

    return (
        <Label>Trip distance not yet calculated.</Label>
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

  renderDestinationOptions() {
    return (
        <Button
            name='calculate'
            onClick={() => this.props.calculateDistances()}
            disabled={this.props.destinations.length === 0}
        >Calculate Trip Distances</Button>
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
            onClick={() => this.props.handleUserDestination()}>
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
            onClick={() => this.props.handleLoadJSON(this.state.fileContents)}>
          Import JSON
        </Button>
    );
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

  updateNewDestinationOnChange(event) {
    if (event.target.value === '' || event.target.name === 'name') { //empty or field is name
      this.setValidState(event.target.name, event.target.value, false, false);
    } else if (this.props.validation(event.target.name, event.target.value)) { //if coord is good
      this.setValidState(event.target.name, event.target.value, true, false);
    } else { //bad coord
      this.setValidState(event.target.name, event.target.value, false, true);
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
    this.props.resetDistances();
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

  onFileChange(event) {
    let callback = (string) => {
      this.setState({fileContents: string});
    };
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
}