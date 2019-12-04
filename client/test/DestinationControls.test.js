import './enzyme.config.js'
import React from 'react'
import DestinationControls from "../src/components/Application/Home/DestinationControls";
import {mount} from 'enzyme'

const destinations = [];
const validationDummy = () => {return true;};
const sumDistancesDriver = () => {return null};

function testUpdateDestinationName() {
  const dcont = mount((<DestinationControls
                            destinations={destinations}
                            sumDistances={sumDistancesDriver}/>));
  let newName = {
    target: {
      name: 'name',
      value: 'Fort Collins'
    }
  };
  let expected = newName.target.value;

  dcont.instance().updateNewDestinationOnChange(newName);
  let actual = dcont.state().newDestination.name;

  expect(actual).toEqual(expected);
}

test('Testing newDestination name update.', testUpdateDestinationName);

function testUpdateLatitude() {
  const dcont = mount((<DestinationControls
                            destinations={destinations}
                            validation={validationDummy}
                            sumDistances={sumDistancesDriver}/>));
  let newLat = {
    target: {
      name: 'latitude',
      value: 24.42
    }
  };
  let expected = newLat.target.value;

  dcont.instance().updateNewDestinationOnChange(newLat);
  let actual = dcont.state().newDestination.latitude;

  expect(actual).toEqual(expected);
}

test('Testing newDestination latitude update.', testUpdateLatitude);

function testUpdateLongitude() {
  const dcont = mount((<DestinationControls
                            destinations={destinations}
                            validation={validationDummy}
                            sumDistances={sumDistancesDriver}/>));
  let newLon = {
    target: {
      name: 'longitude',
      value: 42.24
    }
  };
  let expected = newLon.target.value;

  dcont.instance().updateNewDestinationOnChange(newLon);
  let actual = dcont.state().newDestination.longitude;

  expect(actual).toEqual(expected);
}

test('Testing newDestination longitude update.', testUpdateLongitude);