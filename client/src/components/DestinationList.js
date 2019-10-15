import React, {Component} from 'react';
import {Button, ListGroup, ListGroupItem, Row} from "reactstrap";

export default class DestinationList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (this.renderDestinationList());
  }

  renderDestinationList() {
    return (
        <ListGroup>
          {this.renderClearDestinations()}
          {this.renderReverseDestinations()}
          {this.generateList()}
        </ListGroup>
    );
  }

  renderClearDestinations() {
    return (
        <ListGroupItem>
          <Button className='btn-csu h-5 w-100 text-left'
                  size={'sm'}
                  name='clear_destinations'
                  key={"button_clear_all_destinations"}
                  value='Clear Destinations'
                  active={false}
                  disabled={this.props.destinations.length < 1}
                  onClick={() => this.props.handleClearDestinations()}
          >Clear Destinations</Button>
        </ListGroupItem>
    );
  }

  renderReverseDestinations() {
    return (
      <ListGroupItem>
        <Button className='btn-csu h-5 w-100 text-left'
                size={'sm'}
                name='reverse_destinations'
                key={"button_reverse_destinations"}
                value='Reverse Destinations'
                active={this.props.destinations.length > 0}
                disabled={this.props.destinations.length < 1}
                onClick={() => this.props.handleReverseDestinations()}
        >Reverse Destination Order</Button>
      </ListGroupItem>
    );
  }


  generateList() {
    return (
        this.props.destinations.map((destination, index) => (
            <ListGroupItem key={'destination_' + index}>
              <Row>
                {destination.name}, {destination.latitude}, {destination.longitude}
              </Row>
              {this.renderConditionalDistance(index)}
              <Row>
                <Button className='btn-csu h-5 w-50 text-left'
                        size={'sm'}
                        name={'remove_' + index}
                        key={"button_" + destination.name}
                        value='Remove Destination'
                        active={false}
                        onClick={() => this.props.handleRemoveDestination(index)}
                >Remove</Button>
              </Row>
            </ListGroupItem>
        ))
    );
  }

  renderConditionalDistance(index) {
    if (this.props.distances !== null) {
      return (
          <Row>
            Distance to Next Destination: {this.props.distances[index]},
            Cumulative Trip Distance: {this.props.sumDistances(index)}
          </Row>
      );
    }
    return (
        <Row>
          Distances not yet calculated.
        </Row>
    )
  }
}