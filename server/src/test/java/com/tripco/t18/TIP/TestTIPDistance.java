
package com.tripco.t18.TIP;

import org.junit.Before;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;


/** Verifies the operation of the TIP distance class and its buildResponse method.
 */

public class TestTIPDistance {


// Radius and location values shared by test cases *//*

  private final float radiusMiles = 3958;
  private Map<String, Object> csu;
  private Map<String, Object> denver;
  private final int version = 1;

  @Before
  public void createLocationsForTestCases() {
    csu = new HashMap<>();
    csu.put("latitude", "40.576179");
    csu.put("longitude", "-105.080773");
    csu.put("name", "Oval, Colorado State University, Fort Collins, Colorado, USA");

    denver = new HashMap<>();
    denver.put("latitude", "39.6815");
    denver.put("longitude", "-104.963");
    denver.put("name", "CU Denver, Denver, Colorado, USA");
  }

  @Test
  public void testOriginDestinationSame() {
    TIPDistance trip = new TIPDistance(version, csu, csu, radiusMiles);
//    trip.buildResponse();
    int expect = 0;
    int actual = trip.getDistance();
    assertEquals("origin and destination are the same", expect, actual);

  }

  @Test
  public  void testOriginDestinationnotEquals(){
    TIPDistance trip=new TIPDistance(version, csu, denver, radiusMiles);
//    trip.buildResponse();
    int expect=62;
    int actual=trip.getDistance();
    assertNotEquals("origin and destination are the same",expect,actual);
  }
}

