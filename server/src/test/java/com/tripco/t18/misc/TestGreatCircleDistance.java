package com.tripco.t18.misc;

import java.util.HashMap;
import java.util.Map;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.assertEquals;

public class TestGreatCircleDistance {
  private final float earthRadiusMiles=3959;
  private final float earthRadiusKilometer= 6371;
  private Map<String, Object> origin;
  private Map<String, Object> destination;
  private GreatCircleDistance test = new GreatCircleDistance();

  @Before
  public void createLocations(){
    origin=new HashMap<>();
    origin.put("latitude","");
    origin.put("longitude","");
    destination=new HashMap<>();
    destination.put("latitude","");
    destination.put("longitude","");
  }

  @Test
  public void testSameLocation(){
    origin.replace("latitude","40");
    origin.replace("longitude","-105");
    int expect=0;
    int actual=test.calculateDistance(origin,origin,earthRadiusMiles);
    assertEquals("traveled nowhere",expect,actual);
  }
}
