package com.tripco.t18.TIP;

import org.junit.Before;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;

/** Verifies the operation of the TIP distance class and its buildResponse method.
 */

public class TestTIPTrip {
  /* Radius and location values shared by test cases */
  private final Map<String, String> options = new HashMap<String, String>() {{
      put("title", "My Trip");
      put("earthRadius", "6371");
      put("optimization", "none");
}};
  private Map<String, Object> csu;
  private final int version = 1;

  @Before
  public void createLocationsForTestCases() {
    csu = new HashMap<>();
    csu.put("latitude", "40.576179");
    csu.put("longitude", "-105.080773");
    csu.put("name", "Oval, Colorado State University, Fort Collins, Colorado, USA");
  }

  @Test
  public void testOriginDestinationSame() {
  }
}
