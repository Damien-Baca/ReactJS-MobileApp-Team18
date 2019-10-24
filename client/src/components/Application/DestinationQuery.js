import React, {Component} from 'react';
import {Button, Container, Input, Row, ListGroup, ListGroupItem} from 'reactstrap'

export default class DestinationQuery extends Component {
  constructor(props) {
    super(props);

    this.setPlaces = this.setPlaces.bind(this);

    this.state = {
      match: '',
      limit: 10,
      found: null,
      places: []
    }
  }

  render() {
    return (
      <Container>
        <Row>
          {this.renderMatchInput()}
          {this.renderSubmitButton()}
        </Row>
        <Row>
          {this.renderConditionalPlaces()}
        </Row>
      </Container>
    );
  }

  renderMatchInput() {
    return (
    <Input type='text'
           key={'query_match'}
           name={'query_match'}
           id={`input_query_match`}
           placeholder={""}
           value={this.state.match}
           onChange={(event) => this.updateMatch(event)}/>
    );
  }

  renderSubmitButton() {
    return (
      <Button
          name='submit_query'
          color='info'
          key='submit_query'
          onClick={() => this.handleServerSubmission()}
          disabled={this.state.match === ''}
      >Submit Query</Button>
    );
  }

  renderConditionalPlaces() {
    if (this.state.found != null) {
      if (this.state.places.length > 0) {
        return (
            <ListGroup>
              <ListGroupItem>
                {`Displaying ${Math.min(this.state.limit, this.state.found)}` +
                ` results out of ${this.state.found}`}
              </ListGroupItem>
              {this.renderClearPlaces()}
              {this.generateResultsList()}
            </ListGroup>
        );
      } else {
        return (
            <ListGroup>
              <ListGroupItem>
                {'No result found.'}
              </ListGroupItem>
            </ListGroup>
        );
      }
    }
  }

  renderClearPlaces() {
    return (
      <ListGroupItem>
        <Button
            color='danger'
            name='clear_results'
            key='clear_results'
            onClick={() => this.setState({places: [], found: null})}
            disabled={this.state.places === []}
        >Clear Results</Button>
      </ListGroupItem>
    );
  }

  generateResultsList() {
    let entries = Object.assign([], this.state.places);
    return (
      entries.map((entry, index) => (
        <ListGroupItem>
          <Row>
            {entry.name}, {entry.latitude}, {entry.longitude}
          </Row>
          <Row>
            {entry.altitude}, {entry.id}, {entry.type}, {entry.municipality}
          </Row>
          <Row>
             {this.generateAddDestinationButton(index)}
          </Row>
        </ListGroupItem>
      ))
    );
  }

  generateAddDestinationButton(index) {
    return (
        <Button className='h-5 w-10'
                color='success'
                size={'sm'}
                name={'add_query_' + index}
                key={"button_add_" + index}
                value='Add Destination'
                active={true}
                onClick={() => this.handleAddDestination(index)}
        >Add</Button>
    );
  }

  updateMatch(event) {
    this.setState({
      match: event.target.value
    });
  }

  handleAddDestination(index) {
    let newDestination = {
      name: this.state.places[index].name,
      latitude: this.state.places[index].latitude,
      longitude: this.state.places[index].longitude
    };

    this.props.addDestination(newDestination);
    this.props.resetDistances();
  }

  handleServerSubmission() {
    let query = Object.assign({}, this.state);
    query.found = 0
    this.props.sendServerRequest('locations', query, this.setPlaces)
  }

  setPlaces(newPlaces) {
    this.props.setErrorBanner(newPlaces.errorMessage);

    this.setState( {
      found: newPlaces.found,
      places: newPlaces.places
    })
  }
}