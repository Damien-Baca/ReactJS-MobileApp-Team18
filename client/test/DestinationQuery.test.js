import './enzyme.config.js'
import React from 'react'
import DestinationQuery from "../src/components/Application/Home/DestinationQuery";
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
const generateButtons = [
    "submit_query",
    "clear_results",
    "add_query_0",
    "add_query_1",
    "add_query_2",
];
const setErrorBannerDriver = () => {
  return null;
};

function testSetPlaces() {
  let dQuery = shallow(<DestinationQuery
                        setErrorBanner={setErrorBannerDriver}/>);
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

function testUpdateMatch() {
  let dQuery = shallow(<DestinationQuery
      setErrorBanner={setErrorBannerDriver}/>);
  let expectedMatch = "dave";
  let testEvent = {
    target: {
      value: "dave"
    }
  };

  dQuery.instance().updateMatch(testEvent);

  let actualMatch = dQuery.state().match;

  expect(actualMatch).toEqual(expectedMatch);
}

test('Testing input update for match', testUpdateMatch);

function testGeneratedButtons() {
  let dQuery = shallow(<DestinationQuery
      setErrorBanner={setErrorBannerDriver}/>);
  let expectedButtons = Object.assign([], generateButtons);

  let testPlaces = {
    found: newPlaces.length,
    places: Object.assign([], newPlaces)
  };

  dQuery.instance().setPlaces(testPlaces);

  let numberOfButtons = dQuery.find('Button').length;
  expect(numberOfButtons).toEqual(expectedButtons.length);

  let actualButtons = [];
  dQuery.find('Button').map((input) => actualButtons.push(input.prop('name')));

  expect(actualButtons).toEqual(expectedButtons);
}

test('Testing button generation', testGeneratedButtons);
