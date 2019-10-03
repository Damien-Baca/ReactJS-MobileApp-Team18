import React, {Component} from 'react'
import {Container, Row, Col} from 'reactstrap'
import {Button} from 'reactstrap'
import {Form, Input} from 'reactstrap'
import {sendServerRequestWithBody} from '../../../api/restfulAPI'
import Pane from '../Pane';

export default class Calculator extends Component {
  constructor(props) {
    super(props);

    this.updateLocationOnChange = this.updateLocationOnChange.bind(this);
    this.calculateDistance = this.calculateDistance.bind(this);
    this.createInputField = this.createInputField.bind(this);

    this.state = {
      origin: {latitude: '', longitude: ''},
      destination: {latitude: '', longitude: ''},
      distance: 0,
      errorMessage: null,
      valid1: {latitude: false, longitude: false},
      invalid1: {latitude: false, longitude: false},
      valid2: {latitude: false, longitude: false},
      invalid2: {latitude: false, longitude: false}
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
                Change the units on the <b>Options</b> page.</div>}/>
    );
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
               style={{width: "100%"}}/>
    );

  }

  createForm(stateVar) {
    return (
        <Pane header={stateVar.charAt(0).toUpperCase() + stateVar.slice(1)}
              bodyJSX={
                <Form>
                  {this.createInputField(stateVar, 'latitude')}
                  {this.createInputField(stateVar, 'longitude')}
                </Form>
              }
        />);
  }

  createDistance() {
    return (
        <Pane header={'Distance'}
              bodyJSX={
                <div>
                  <h5>{this.state.distance} {this.props.options.activeUnit}</h5>
                  <Button onClick={this.calculateDistance}
                          disabled={ !(this.state.valid1.latitude && this.state.valid1.longitude && this.state.valid2.latitude && this.state.valid2.longitude) }
                  >Calculate</Button>
                </div>}
        />
    );
  }

  calculateDistance() {
    const tipConfigRequest = {
      'type': 'distance',
      'version': 2,
      'origin': this.props.convertCoordinates(this.state.origin.latitude,this.state.origin.longitude),
      'destination': this.props.convertCoordinates(this.state.destination.latitude,this.state.destination.longitude),
      'earthRadius': this.props.options.units[this.props.options.activeUnit]
    };

    sendServerRequestWithBody('distance', tipConfigRequest,
        this.props.settings.serverPort)
    .then((response) => {
      if (response.statusCode >= 200 && response.statusCode <= 299) {
        this.setState({
          distance: response.body.distance,
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

  updateLocationOnChange(stateVar, field, value){ //origindest, target.name, target.value

    if (field === '') { //empty
      this.setValidState(stateVar, field, value, false, false, false, false);
    } else if (this.validation(field, value) ) { //if coord is good
      this.setValidState(stateVar, field, value, true, false, true, false);
    } else { //bad coord
      this.setValidState(stateVar, field, value, false, true, false, true);
    }
  }


  setValidState(stateVar, field, value, valid1, invalid1, valid2, invalid2) {
    let location = Object.assign({}, this.state[stateVar]);
    location[field] = value;
    let cloneValid1 = Object.assign({}, this.state.valid1);
    cloneValid1[field] = valid1;
    let cloneInvalid1 = Object.assign({}, this.state.invalid1);
    cloneInvalid1[field] = invalid1;
    let cloneValid2 = Object.assign({}, this.state.valid2);
    cloneValid2[field] = valid2;
    let cloneInvalid2 = Object.assign({}, this.state.invalid2);
    cloneInvalid2[field] = invalid2;
    this.setState({
      [stateVar]: location,
      valid1: cloneValid1,
      invalid1: cloneInvalid1,
      valid2: cloneValid2,
      invalid2: cloneInvalid2
    });

  }
}
