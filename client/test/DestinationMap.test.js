import './enzyme.config.js'
import React from 'react'
import DestinationMap from "../src/components/Application/DestinationMap";
import {shallow} from 'enzyme'

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
const testUserLocation = {
      name: 'Colorado State University',
      latitude: 40.576179,
      longitude: -105.080773
};

function testItineraryBounding() {
  let dmap = shallow(<DestinationMap
                      userLocation={testUserLocation}
                      destinations={[]}/>);

  let margin = 0.02;
  let expectedBound = L.latLngBounds(
      L.latLng(testUserLocation.latitude + margin,
          testUserLocation.longitude - margin),
      L.latLng(testUserLocation.latitude - margin,
          testUserLocation.longitude + margin));

  let actualBound =  dmap.instance().itineraryBounds();

  expect(actualBound).toEqual(expectedBound);
}

test('Test itierary bounding.', testItineraryBounding);