import './enzyme.config.js'
import React from 'react'
import Home from '../src/components/Application/Home'
import {mount} from 'enzyme'

const destinations = [];
const inputNames = [
  'name',
  'latitude',
  'longitude',
  'json_file'
];
const buttonNamesInitial = [
  'add_new_destination',
  'add_user_destination',
  'loadJSON',
  'calculate',
  'clear_destinations',
];
const validationDummy = () => {
  return true;
};
const createErrorBannerDummy = () => {
  return null;
};

function testInitialState() {
  const home = mount((<Home destinations = {destinations}
                            createErrorBanner={createErrorBannerDummy}/>));
  let expected = {name: '', latitude: '', longitude: ''};
  let actual = home.state().newDestination;

  expect(actual).toEqual(expected);
}

test('Testing inital state.', testInitialState);

function testUpdateDestinationName() {
  const home = mount((<Home destinations={destinations}
                            validateCoordinates={() => {return true}}
                            createErrorBanner={createErrorBannerDummy}/>));
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
  const home = mount((<Home destinations={destinations}
                            validateCoordinates={validationDummy}
                            validation={validationDummy}
                            createErrorBanner={createErrorBannerDummy}/>));
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
  const home = mount((<Home destinations={destinations}
                            validateCoordinates={validationDummy}
                            validation={validationDummy}
                            createErrorBanner={createErrorBannerDummy}/>));
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

function testCreateInputFields() {
  const home = mount((<Home destinations={destinations}
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
                            createErrorBanner={createErrorBannerDummy}/>));
  let expectedButtons = buttonNamesInitial;

  let numberOfButtons = home.find('Button').length;
  expect(numberOfButtons).toEqual(expectedButtons.length);

  let actualButtons = [];
  home.find('Button').map((input) => actualButtons.push(input.prop('name')));

  expect(actualButtons).toEqual(expectedButtons);
}

test('Testing Button rendering.', testCreateButtons);