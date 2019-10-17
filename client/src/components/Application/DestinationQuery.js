import React, {Component} from 'react';
import {Container, Row} from 'reactstrap'

export default class DestinationQuery extends Component {
  constructor(props) {
    super(props);

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
          {'Put stuff here.'}
        </Row>
      </Container>
    );
  }
}