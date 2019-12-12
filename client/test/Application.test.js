import './enzyme.config.js'
import React from 'react'
import {shallow} from 'enzyme'
import Application from '../src/components/Application/Application'

const destinationsStub = [];
const newDestinations = [{
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

function testInitialState() {
  mockConfigResponse();

  const app = shallow(<Application/>);

  let actualConfig = app.state().serverConfig;
  let expectedConfig = null;
  expect(actualConfig).toEqual(expectedConfig);

  let actualOptions = app.state().planOptions;
  let expectedOptions = {
    optimizations: ['none', 'short', 'shorter', 'shortest'],
    activeOptimization: 'short',
    units: {kilometers: 6371, miles: 3958.8, 'nautical miles': 3440.1},
    activeUnit: 'miles',
    formats: ['json', 'csv'],
    activeFileFormat: 'json'
  };

  expect(actualOptions).toEqual(expectedOptions);
}

function mockConfigResponse() {
  fetch.mockResponse(JSON.stringify(
      {
        status: 200,
        statusText: 'OK',
        body: {
          'placeAttributes': ["latitude", "longitude", "serverName"],
          'requestType': "config",
          'requestVersion': 5,
          'serverName': "t18"
        },
        type: 'basic',
        url: 'http://localhost:8088/api/config',
        redirected: false,
        ok: true
      }));
}

test("Testing Application's initial state", testInitialState);

function testUpdateOption() {
  const app = shallow(<Application/>);

  app.instance().updatePlanOption("activeUnit", "miles");

  let actualUnit = app.state().planOptions.activeUnit;
  let expectedUnit = "miles";
  expect(actualUnit).toEqual(expectedUnit);
}

test("Testing Application's updatePlanOption function", testUpdateOption);

function testAddDestination() {
  const app = shallow(<Application/>);
  let expectedDestinations = newDestinations;

  app.instance().addDestinations(newDestinations);

  let actualDestinations = app.state().destinations;

  expect(actualDestinations).toEqual(expectedDestinations);
}

test("Testing Application's addDestination function.", testAddDestination);

function testRemoveDestination() {
  const app = shallow(<Application/>);
  let expectedDestinations = Object.assign([],app.state().destinations);

  app.instance().addDestinations([newDestinations[0]]);
  app.instance().addDestinations([newDestinations[1]]);
  app.instance().addDestinations([newDestinations[2]]);
  app.instance().removeDestination(1);
  app.instance().removeDestination(0);
  app.instance().removeDestination(0);
  let actualDestinations = app.state().destinations;

  expect(actualDestinations).toEqual(expectedDestinations);
}

test("Testing Application's removeDestination function.", testRemoveDestination);

function testClearDestinationList() {
  const app = shallow(<Application/>);
  let expected = Object.assign([], app.state().destinations);

  app.instance().addDestinations([newDestinations[0]]);
  app.instance().addDestinations([newDestinations[1]]);
  app.instance().addDestinations([newDestinations[2]]);
  app.instance().removeDestination(-1);
  let actual = app.state().destinations;

  expect(actual).toEqual(expected);
}

test('Testing clearDestination.', testClearDestinationList);

function testReverseDestinations() {
  const app = shallow(<Application/>);
  app.state().destinations = Object.assign([], newDestinations);
  let expected = Object.assign([],
      newDestinations.slice(1)).reverse();

  expected.splice(0, 0, newDestinations[0]);

  app.instance().reverseDestinations();
  let actual = Object.assign([], app.state().destinations);

  expect(actual).toEqual(expected);
}

test('Testing reverseDestinations.', testReverseDestinations);

function testSetDestinations() {
  const app = shallow(<Application/>);
  app.state().destinations = Object.assign([], newDestinations);
  let expected = Object.assign([], newDestinations.reverse());
  let names = [];
  newDestinations.forEach((destination) => {
    names.push(destination.name);
  });

  app.instance().setDestinations(names);
  let actual = Object.assign([], app.state().destinations);

  expect(actual).toEqual(expected);
}

test('Testing setDestinations', testSetDestinations);

function testSwapDestinations() {
  const app = shallow(<Application/>);
  app.state().destinations = destinationsStub;
  let expected = newDestinations;

  app.instance().addDestinations([newDestinations[0]]);
  app.instance().addDestinations([newDestinations[2]]);
  app.instance().addDestinations([newDestinations[1]]);
  app.instance().swapDestinations(2, 1);
  let actual = app.state().destinations;

  expect(actual).toEqual(expected);
}

test('Testing swapDestinations', testSwapDestinations);

function testValidationTrue() {
  const app = shallow(<Application/>);
  let expected = true;
  let actual = app.instance().validation('longitude', '105');

  expect(actual).toEqual(expected);
}

test('Testing true validation', testValidationTrue);

function testValidationFalse() {
  const app = shallow(<Application/>);
  let expected = false;
  let actual = app.instance().validation('30S', '105S');

  expect(actual).toEqual(expected);
}

test('Testing false validation', testValidationFalse);

function testConvertCoordinates() {
  const app = shallow(<Application/>);
  let expected = {latitude: "40",longitude: "110"};
  let actual = app.instance().convertCoordinates("N 40","E 110");
  expect(actual).toEqual(expected);

}

test('Testing convertCoordinates', testConvertCoordinates);