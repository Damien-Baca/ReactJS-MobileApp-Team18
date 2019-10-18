import './enzyme.config.js'
import React from 'react'
import DestinationQuery from "../src/components/Application/DestinationQuery";
import {shallow} from 'enzyme'

const newPlaces = [{
  name: 'Fort Collins',
  latitude: '40.5853',
  longitude: '-105.0844'
}, {
  name: 'Fish Lake National Park',
  latitude: '38.6816',
  longitude: '-112.3338'
}, {
  name: 'Disney Land',
  latitude: '33.812511',
  longitude: '-117.918976'
}];
const testUserLocation = {
  name: 'Colorado State University',
  latitude: 40.576179,
  longitude: -105.080773
};

function testSetPlaces() {
  let dQuery = shallow(<DestinationQuery/>);
  let expectedFound = newPlaces.length;
  let expectedPlaces = newPlaces;

  let testPlaces = {
    found: expectedFound,
    places: Object.assign([], expectedPlaces)
  };

  dQuery.instance().setPlaces(testPlaces);

  let actualFound = dQuery.state().found;
  expect(actualFound).toEqual(expectedFound);

  let actualPlaces = dQuery.state().places;

  expect(actualPlaces).toEqual(expectedPlaces);
}

test('Testing found and place setting.', testSetPlaces);