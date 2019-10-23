import React, {Component} from 'react'
import {Container, Row, Col} from 'reactstrap'
import {Button} from 'reactstrap'
import {Form, Input} from 'reactstrap'
import Pane from '../Pane';

export default class Calculator extends Component {
  constructor(props) {
    super(props);

    this.updateLocationOnChange = this.updateLocationOnChange.bind(this);
    this.calculateDistance = this.calculateDistance.bind(this);
    this.createInputField = this.createInputField.bind(this);
    this.setDistance = this.setDistance.bind(this);

    this.state = {
      origin: {latitude: '', longitude: ''},
      destination: {latitude: '', longitude: ''},
      distance: 0,
      errorMessage: null,
      valid: {
        originlatitude: false,
        originlongitude: false,
        destinationatitude: false,
        destinationlongitude: false
      },
      invalid: {
        originlatitude: false,
        originlongitude: false,
        destinationlatitude: false,
        destinationlongitude: false
      },
    };
  }
  render() {
    return (
        <Container>
          {this.state.errorMessage}
          <Row>
            <Col>
              {this.createHeader()}
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={6} md={4} lg={3}>
              {this.createForm('origin')}
            </Col>
            <Col xs={12} sm={6} md={4} lg={3}>
              {this.createForm('destination')}
            </Col>
            <Col xs={12} sm={6} md={4} lg={3}>
              {this.createDistance()}
            </Col>
          </Row>
        </Container>
    );
  }

  createHeader() {
    return (
        <Pane header={'Calculator'}
              bodyJSX={<div>Determine the distance between the origin and
                destination.
                Change the units on the <b>Options</b> page.</div>}/>);
  }

  createInputField(stateVar, coordinate) {
    let updateStateVarOnChange = (event) => {
      this.updateLocationOnChange(stateVar, event.target.name,
          event.target.value)
    };

    let capitalizedCoordinate = coordinate.charAt(0).toUpperCase()
        + coordinate.slice(1);
    return (
        <Input name={coordinate} placeholder={capitalizedCoordinate}
               id={`${stateVar}${capitalizedCoordinate}`}
               value={this.state[stateVar][coordinate]}
               onChange={updateStateVarOnChange}
               valid={this.state.valid[stateVar+coordinate]}
               invalid={this.state.invalid[stateVar+coordinate]}
               style={{width: "100%"}}
        />);
  }

  createForm(stateVar) {
    return (
        <Pane header={stateVar.charAt(0).toUpperCase() + stateVar.slice(1)}
              bodyJSX={
                <Form>
                  {this.createInputField(stateVar, 'latitude')}
                  {this.createInputField(stateVar, 'longitude')}
                </Form>}
        />);
  }

  createDistance() {
    return (
        <Pane header={'Distance'}
              bodyJSX={
                <div>
                  <h5>{this.state.distance} {this.props.options.activeUnit}</h5>
                  <Button onClick={this.calculateDistance}
                          disabled={ !(this.state.valid.originlatitude && this.state.valid.originlongitude && this.state.valid.destinationlatitude && this.state.valid.destinationlongitude) } //TODO
                  >Calculate</Button>
                </div>}
        />);
  }

  calculateDistance() {
    const tipRequest = {
      'type': 'distance',
      'version': 3,
      'origin': this.props.convertCoordinates(this.state.origin.latitude,this.state.origin.longitude),
      'destination': this.props.convertCoordinates(this.state.destination.latitude,this.state.destination.longitude),
      'earthRadius': this.props.options.units[this.props.options.activeUnit]
    };

    this.props.sendServerRequest('distance', tipRequest, this.setDistance);
  }

  setDistance(newDistance) {
    this.setState({
      errorMessage: newDistance.errorMessage,
      distance: newDistance.distance
    });
  }

  updateLocationOnChange(stateVar, field, value){ //origindest, target.name, target.value
    if (value === '') { //empty
      this.setValidState(stateVar, field, value, false, false);
    } else if (this.props.validation(field, value) ) { //if coord is good
      this.setValidState(stateVar, field, value, true, false);
    } else { //bad coord
      this.setValidState(stateVar, field, value, false, true);
    }
  }

  setValidState(stateVar, field, value, valid, invalid) {
    let location = Object.assign({}, this.state[stateVar]);
    location[field] = value;
    let validClone = Object.assign({}, this.state.valid);
    validClone[stateVar+field] = valid;
    let invalidClone = Object.assign({}, this.state.invalid);
    invalidClone[stateVar+field] = invalid;
    this.setState({
      [stateVar]: location,
      valid: validClone,
      invalid: invalidClone
    });
  }
}
