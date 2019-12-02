import './enzyme.config.js'
import React from 'react'
import DestinationList from "../src/components/Application/DestinationList";
import {mount} from 'enzyme'

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
const distanceStub = null;

function testListButtonRendering() {
  const expectedButtons = [
    'clear_destinations',
    'reverse_destinations',
  ];

  let dlist = mount((<DestinationList
                      destinations={newDestinations}
                      distances={distanceStub}
                      />));

  let expectedNumberOfButtons = (expectedButtons.length);

  let actualNumberOfButtons = dlist.find('Button').length;
  expect(actualNumberOfButtons).toEqual(expectedNumberOfButtons);

  let actualButtons = [];
  dlist.find('Button').map((input) => actualButtons.push(input.prop('name')));

  expect(actualButtons).toEqual(expectedButtons);
}

test('Testing Input rendering.', testListButtonRendering);
