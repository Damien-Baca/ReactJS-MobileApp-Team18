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
                  onClick={() => this.handleClearDestinations()}
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
                onClick={() => this.handleReverseDestinations()}
        >Reverse Destination Order</Button>
      </ListGroupItem>
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

  generateList() {
    return (
        this.props.destinations.map((destination, index) => (
            <ListGroupItem key={'destination_' + index}>
              <Row style={{display:"flex"}}>
                {destination.name}, {destination.latitude}, {destination.longitude} {this.generateMoveUpButton(index)}
              </Row>
                {this.renderConditionalDistance(index)}
              <Row>
                {this.generateRemoveButton(index)}
                {this.generateNewOriginButton(index)}
                {this.generateMoveDownButton(index)}
              </Row>
            </ListGroupItem>
        ))
    );
  }

  generateRemoveButton(index) {
    return (
        <Button className='btm-csu h-5 w-25 text-left'
                style={{marginRight: 'auto'}}
                size={'sm'}
                name={'remove_' + index}
                key={"button_remove_" + index}
                value='Remove Destination'
                active={false}
                onClick={() => this.handleRemoveDestination(index)}
        >Remove</Button>
    );
  }

  generateNewOriginButton(index) {
    return (
        <Button className='nt-csu h-5 w-25 text-left'
                size={'sm'}
                name={'set_origin_' + index}
                key={"button_set_origin_" + index}
                value='Set As Origin'
                active={true}
                disabled={index === 0}
                onClick={() => this.handleSwapDestinations(index, 0)}
        >Set As Origin</Button>
    );
  }

  generateMoveUpButton(index) {
    return (
        <Button className='btn-csu h-5 w-25 text-right'
                style={{marginLeft: 'auto'}}
                size={'sm'}
                name={'move_up_' + index}
                key={"button_move_up" + index}
                value='Move Up'
                active={true}
                disabled={this.props.destinations.length <= 1 || index === 0}
                onClick={() => {this.handleSwapDestinations(index, index - 1)}}
        >Move Up</Button>
    );
  }

  generateMoveDownButton(index) {
    return (
        <Button className='btn-csu h-5 w-25 text-right'
                style={{marginLeft: 'auto'}}
                size={'sm'}
                name={'move_down_' + index}
                key={"button_move_down" + index}
                value='Move Down'
                active={true}
                disabled={this.props.destinations.length <= 1 ||
                index === this.props.destinations.length - 1}
                onClick={() => {this.handleSwapDestinations(index, index + 1)}}
        >Move Down</Button>
    );
  }

  handleClearDestinations() {
    this.props.removeDestination(-1);
    this.props.resetDistances();
  }

  handleReverseDestinations() {
    this.props.reverseDestinations();
    this.props.resetDistances();
  }

  handleRemoveDestination(index) {
    this.props.removeDestination(index);
    this.props.resetDistances();
  }

  handleSwapDestinations(index1, index2) {
    this.props.swapDestinations(index1, index2);
    this.props.resetDistances();
  }


}