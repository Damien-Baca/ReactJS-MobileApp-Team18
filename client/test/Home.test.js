import './enzyme.config.js'
import React from 'react'
import {shallow} from 'enzyme'
import Home from '../src/components/Application/Home'
import {mount} from 'enzyme';

const destinations = [];

function testInitialState() {
  const home = mount((<Home destinations = {destinations}/>));
  let expected = {name: '', latitude: '', longitude: ''};
  let actual = home.state().newDestination;

  expect(actual).toEqual(expected);
}

test('Testing inital state.', testInitialState);

function testUpdateDestinationName() {
  const home = mount((<Home destinations={destinations}/>));
  let newName = {
    target: {
      name: 'name',
      value: 'Fort Collins'
    }
  };
  let expected = newName.target.value;

  home.instance().updateNewDestinationOnChange(newName);
  let actual = home.state().newDestination.name;

  expect(actual).toEqual(expected);
}

test('Testing newDestination name update.', testUpdateDestinationName);

function testUpdateLatitude() {
  const home = mount((<Home destinations={destinations}/>));
  let newLat = {
    target: {
      name: 'latitude',
      value: 24.42
    }
  };
  let expected = newLat.target.value;

  home.instance().updateNewDestinationOnChange(newLat);
  let actual = home.state().newDestination.latitude;

  expect(actual).toEqual(expected);
}

test('Testing newDestination latitude update.', testUpdateLatitude);

function testUpdateLongitude() {
  const home = mount((<Home destinations={destinations}/>));
  let newLon = {
    target: {
      name: 'longitude',
      value: 42.24
    }
  };
  let expected = newLon.target.value;

  home.instance().updateNewDestinationOnChange(newLon);
  let actual = home.state().newDestination.longitude;

  expect(actual).toEqual(expected);
}

test('Testing newDestination longitude update.', testUpdateLongitude);