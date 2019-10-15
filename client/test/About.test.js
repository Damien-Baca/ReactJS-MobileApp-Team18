import './enzyme.config.js'
import React from 'react'
import {mount} from 'enzyme'
import About from '../src/components/Application/About/About';

function testgenerateCardGroupsEmptylist(){
  let emptyObj={}

  const exampleWrapper= mount(<About/>);
  let actualResult=exampleWrapper.instance().generateCardGroups(emptyObj);

  expect(actualResult)===0;
}
test(`Testing the generateCardGroups function with an empty list`,testgenerateCardGroupsEmptylist);