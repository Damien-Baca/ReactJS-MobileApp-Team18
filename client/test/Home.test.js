import './enzyme.config.js'
import React from 'react'
import {shallow} from 'enzyme'
import Home from '../src/components/Application/Home'

function testInitialState() {
  const home = shallow(<Home/>);
  let initialNewDestination = {name: '', latitude: 0, longitude: 0};

  expect(home.state.newDestination).toEqual(initialNewDestination);
}

function testNewDestinationName() {
  const home = shallow(<Home/>);
  let newName = {
    target: {
      name: 'name',
      value: 'Fort Collins'
    }
  };

  home.updateNewDestinationOnChange(newName);

  expect(home.state.newDestination.name).toEqual(newName.target.name);
}