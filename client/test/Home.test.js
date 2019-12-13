import './enzyme.config.js'
import React from 'react'
import Home from '../src/components/Application/Home'
import {mount} from 'enzyme'

const destinations = [];
const options = {
  units: {'miles': 3958.8, 'kilometers': 6371, 'nautical miles': 3440.1},
  activeUnit: 'miles',
  optimizations: ['none', 'short'],
  activeOptimization: 'none',
  formats: ['json', 'csv'],
  activeFileFormat: 'json'
};
const initialState = {
  errorMessage: null,
  markerFlag: true,
  userLocation: {
    name: 'Colorado State University',
    latitude: 40.576179,
    longitude: -105.080773
  },
  distances: null,
  optimizations: null
};
const inputNames = [
  'name',
  'latitude',
  'longitude',
  'json_file',
  'query_match',
   undefined,
   undefined
];
const buttonNamesInitial = [

  'toggleAllMarkers',
  'togglePolyline',
  'toggleIconColors',
  'add_new_destination',
  'add_user_destination',
  'exportFile',
  'save_kml',
  'calculate',
  'optimize',
  'submit_query',
  'clear_destinations',
  'reverse_destinations',
];
const validationDummy = () => {
  return true;
};
const createErrorBannerDummy = () => {
  return null;
};

function testInitialState() {
  const home = mount((<Home destinations = {destinations}
                            options={options}
                            createErrorBanner={createErrorBannerDummy}/>));
  let expected = initialState;
  let actual = home.state();

  expect(actual).toEqual(expected);
}

test('Testing inital state.', testInitialState);

function testCreateInputFields() {
  const home = mount((<Home destinations={destinations}
                            options={options}
                            validation={validationDummy}
                            createErrorBanner={createErrorBannerDummy}/>));
  let expectedInputs = inputNames;

  let numberOfInputs = home.find('Input').length;
  expect(numberOfInputs).toEqual(inputNames.length);

  let actualInputs = [];
  home.find('Input').map((input) => actualInputs.push(input.prop('name')));

  expect(actualInputs).toEqual(expectedInputs);
}

test('Testing Input rendering.', testCreateInputFields);

function testCreateButtons() {
  const home = mount((<Home destinations={destinations}
                            options={options}
                            createErrorBanner={createErrorBannerDummy}/>));
  let expectedButtons = buttonNamesInitial;

  let numberOfButtons = home.find('Button').length;
  expect(numberOfButtons).toEqual(expectedButtons.length);

  let actualButtons = [];
  home.find('Button').map((input) => actualButtons.push(input.prop('name')));

  expect(actualButtons).toEqual(expectedButtons);
}

test('Testing Button rendering.', testCreateButtons);
