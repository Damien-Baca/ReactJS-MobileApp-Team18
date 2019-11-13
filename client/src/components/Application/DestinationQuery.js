import React, {Component} from 'react';
import {Button, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, Row, ListGroup, ListGroupItem} from 'reactstrap'
import Select from 'react-select'

export default class DestinationQuery extends Component {
  constructor(props) {
    super(props);

    this.setPlaces = this.setPlaces.bind(this);
    this.generateDropdown = this.generateDropdown.bind(this);
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
      activeTypes: [],
      activeCountries: []
    }
  }

  render() {
    return (
        <Container>
            {this.renderRow(this.renderMatchInput)}
          <Row>
            {this.generateDropdown('activeTypes', Object.assign([],
                this.props.typeFilter))}
          </Row>
          <Row>
            {this.generateDropdown('activeCountries', Object.assign([],
                this.props.countryFilter))}
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
          className='btn-csu'
          name='submit_query'
          key='submit_query'
          onClick={() => this.handleServerSubmission()}
          active={true}
          disabled={this.state.match === ''
          && this.state.activeTypes.length === 0
          && this.state.activeCountries.length === 0}
      >Submit</Button>
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
            className='btn-csu'
            name='clear_results'
            key='clear_results'
            onClick={() => this.setState({places: [], found: null})}
            active={false}
            disabled={this.state.places === []}
        >Clear Results</Button>
      </ListGroupItem>
    );
  }

  generateDropdown(name, filters) {
    const setValue = (value) => {
      let newList = [];
      if (value !== null) {
        value.forEach((item) => {
          newList.push(item.value);
        });
      }
      this.setState({[name]: newList});
    };

    let options = [];
    const styles = {
      input: base => ({
        width: `${10 * this.state[name].length + 100}px`
      })
    };
    Object.assign([], filters).forEach((value) => {
        options.push({value: value, label: value});
    });

    return (
        <Select options={options}
                key={`id_select_${name}`}
                name={`select_${name}`}
                isMulti={true}
                onChange={(value) => {setValue(value)}}
                styles={styles}/>
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
            {entry.continent}, {entry.country}, {entry.region}
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
        <Button className='btn-csu h-5 w-10'
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

    newNarrow.push({
      'name': 'type',
      'values': Object.assign([], this.state.activeTypes)
    });

    newNarrow.push({
      'name': 'country',
      'values': Object.assign([], this.state.activeCountries)
    });

      console.log(newNarrow);

    let query = {
      match: this.state.match,
      narrow: newNarrow,
      limit: this.state.limit,
      found: 0,
      places: this.state.places
    };

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