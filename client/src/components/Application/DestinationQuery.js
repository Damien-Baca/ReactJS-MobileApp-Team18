import React, {Component} from 'react';
import {Button, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, Row, ListGroup, ListGroupItem} from 'reactstrap'

export default class DestinationQuery extends Component {
  constructor(props) {
    super(props);

    this.setPlaces = this.setPlaces.bind(this);
    this.generateDropdown = this.generateDropdown.bind(this);
    this.generateDropdownItems = this.generateDropdownItems.bind(this);
    this.renderMatchInput = this.renderMatchInput.bind(this);
    this.renderSubmitButton = this.renderSubmitButton.bind(this);
    this.renderConditionalPlaces = this.renderConditionalPlaces.bind(this);

    this.state = {
      match: '',
      limit: 10,
      found: null,
      places: [],
      activeTypeOpen: false,
      activeCountryOpen: false,
      typeFilter: ['', 'airport', 'heliport', 'balloonport', 'closed'],
      activeType: '',
      countryFilter: ['', 'stop right there'],
      activeCountry: ''
    }
  }

  render() {
    return (
        <Container>
            {this.renderRow(this.renderMatchInput)}
          <Row>
            {this.generateDropdown('activeType', Object.assign([],
                this.state.typeFilter))} : {this.selectFilter(
                    this.state.activeType)}
          </Row>
          <Row>
            {this.generateDropdown('activeCountry', Object.assign([],
                this.state.countryFilter))} : {this.selectFilter(
                    this.state.activeCountry)}
          </Row>
          {this.renderRow(this.renderSubmitButton)}
          {this.renderRow(this.renderConditionalPlaces)}
      </Container>
    );
  }

  renderRow(rFunction) {
    return (
      <Row>{rFunction()}</Row>
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

  generateDropdown(name, filters) {
    return (
      <Dropdown
          isOpen={this.state[name + 'Open']}
          toggle={() => this.setState(
              {[name + "Open"]: !this.state[name + 'Open']}
              )}
          classname={'csu-btn'}
          direction={'right'}>
        <DropdownToggle
            key={`key_${name}_dropdown`}
            name={`${name}_dropdown`}
            caret>{'Filter by ' + name.slice(6).toLowerCase()
        + ':'}</DropdownToggle>
        <DropdownMenu>{this.generateDropdownItems(name, filters)}</DropdownMenu>
      </Dropdown>
    );
  }

  generateDropdownItems(name, items) {
    return (
        items.map((item) => {
          return (
              <DropdownItem
                  onClick={() => this.setState({[name]: item})}
              >{this.selectFilter(item)}</DropdownItem>
          );
        })
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

    this.props.addDestinations([newDestination]);
    this.props.resetDistances();
  }

  handleServerSubmission() {
    let newNarrow = [];
    if (!(this.state.activeType === '')) {
      newNarrow.push({
        'name': 'type',
        'value': this.state.activeType
      })
    }

    if (!(this.state.activeCountry === '')) {
      newNarrow.push({
        'name': 'country',
        'value': this.state.activeCountry
      });
    }

    let query = {
      match: this.state.match,
      narrow: newNarrow,
      limit: this.state.limit,
      found: 0,
      places: this.state.places
    };

    this.props.sendServerRequest('locations', query, this.setPlaces)
  }

  selectFilter(filter) {
    return (filter === '' ? 'no filter' : filter);
  }

  setPlaces(newPlaces) {
    this.props.setErrorBanner(newPlaces.errorMessage);

    this.setState( {
      found: newPlaces.found,
      places: newPlaces.places
    })
  }
}