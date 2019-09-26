import './enzyme.config.js'
import React from 'react'
import {shallow} from 'enzyme'
import Home from '../src/components/Application/Home'

function testInitialState() {
  const home = shallow(<Home/>);
  let initialNewDestination = {name: '', latitude: 0, longitude: 0};

  expect(home.state().newDestination).toEqual(initialNewDestination);
}

test('Testing inital state.', testInitialState());

function testUpdateDestinationName() {
  const home = shallow(<Home/>);
  let newName = {
    target: {
      name: 'name',
      value: 'Fort Collins'
    }
  };

  home.instance().updateNewDestinationOnChange(newName);

  expect(home.state().newDestination.name).toEqual(newName.target.name);
}

test('Testing newDestination name update.', testUpdateDestinationName);

function testUpdateLatitude() {
  const home = shallow(<Home/>);
  let newName = {
    target: {
      name: 'latitude',
      value: 24.42
    }
  };

  home.instance().updateNewDestinationOnChange(newName);

  expect(home.state().newDestination.name).toEqual(newName.target.name);
}

test('Testing newDestination latitude update.', testUpdateLatitude);

function testUpdateLongitude() {
  const home = shallow(<Home/>);
  let newName = {
    target: {
      name: 'longitude',
      value: 42.24
    }
  };

  home.instance().updateNewDestinationOnChange(newName);

  expect(home.state().newDestination.name).toEqual(newName.target.name);
}

test('Testing newDestination longitude update.', testUpdateLongitude);