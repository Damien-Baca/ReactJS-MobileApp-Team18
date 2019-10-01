import './enzyme.config.js'
import React from 'react'
import {shallow} from 'enzyme'
import Application from '../src/components/Application/Application'

let newDestinations = [{
  name: 'Fort Collins',
  latitude: 40.5853,
  longitude: -105.0844
}, {
  name: 'Fish Lake National Park',
  latitude: 38.6816,
  longitude: -112.3338
}, {
  name: 'Disney Land',
  latitude: 33.812511,
  longitude: -117.918976
}];

function testInitialState() {
  mockConfigResponse();

  const app = shallow(<Application/>);

  let actualConfig = app.state().serverConfig;
  let expectedConfig = null;
  expect(actualConfig).toEqual(expectedConfig);

  let actualOptions = app.state().planOptions;
  let expectedOptions = {
    units: {kilometers: 6371, miles: 3959},
    activeUnit: 'miles'
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
          'requestVersion': 1,
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

  app.instance().addDestination(expectedDestinations[0]);
  app.instance().addDestination(expectedDestinations[1]);
  app.instance().addDestination(expectedDestinations[2]);
  let actualDestinations = app.state().destinations;

  expect(actualDestinations).toEqual(expectedDestinations);
}

test("Testing Application's addDestination function.", testAddDestination);

function testRemoveDestination() {
  const app = shallow(<Application/>);
  let expectedDestinations = app.state().destinations;
  let tempDestinations = newDestinations;

  app.instance().addDestination(tempDestinations[0]);
  app.instance().addDestination(tempDestinations[0]);
  app.instance().addDestination(tempDestinations[0]);
  app.instance().removeDestination(tempDestinations[1]);
  app.instance().removeDestination(tempDestinations[3]);
  app.instance().removeDestination(tempDestinations[2]);
  let actualDestinations = app.state().destinations;

  expect(actualDestinations).toEqual(expectedDestinations);
}

test("Testing Application's removeDestination function.", testRemoveDestination);