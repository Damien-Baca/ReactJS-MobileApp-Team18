import './enzyme.config.js'
import React from 'react'
import {shallow} from 'enzyme'
import Application from '../src/components/Application/Application'


function testInitialState() {
  mockConfigResponse();

  const app = shallow(<Application/>);

  let actualConfig = app.state().serverConfig;
  let expectedConfig = null;
  expect(actualConfig).toEqual(expectedConfig);

  let actualOptions = app.state().planOptions;
  let expectedOptions = {
    units: {miles: 3959},
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
  let expectedDestination = {
    name: 'Disney Land',
    latitude: 33.812511,
    longitude: -117.918976
  };

  app.instance().addDestination(expectedDestination);
  let actualDestination = app.state().destination;

  expect(actualDestination).toEqual(expectedDestination);
}

test("Testing Application's addDestination function.", testAddDestination);

function testRemoveDestination() {
  const app = shallow(<Application/>);
  let expectedDestination = [];
  let newDestination = {
    name: 'Disney Land',
    latitude: 33.812511,
    longitude: -117.918976
  };

  app.instance().addDestination(newDestination);
  app.instance().removeDestination(newDestination);
  let actualDestination = app.state().destination;

  expect(actualDestination).toEqual(expectedDestination);
}

test("Testing Application's removeDestination function.", testRemoveDestination);