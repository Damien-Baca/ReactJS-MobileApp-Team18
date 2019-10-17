import React, {Component} from 'react';
import {Button, Container, Row} from 'reactstrap'
import {sendServerRequestWithBody} from "../../api/restfulAPI";

export default class DestinationQuery extends Component {
  constructor(props) {
    super(props);

    this.setPlaces = this.setPlaces.bind(this);

    this.state = {
      match: '',
      limit: 100,
      found: 0,
      places: []
    }
  }

  render() {
    return (
      <Container>
        <Row>
          {this.renderSubmitButton()}
        </Row>
      </Container>
    );
  }

  renderSubmitButton() {
    console.log('Rendering query');
    return (
      <Button
          name='submit_query'
          onClick={() => this.handleServerSubmission()}
          disabled={this.state.match === ''}
      >Submit Query</Button>
    );
  }

  handleServerSubmission() {
    let query = Object.assign({}, this.state);

    this.props.sendServerRequest('locations', query, this.setPlaces)
  }

  setPlaces(newPlaces) {
    this.setState( {
      found: newPlaces.found,
      places: newPlaces.places
    })
  }
}