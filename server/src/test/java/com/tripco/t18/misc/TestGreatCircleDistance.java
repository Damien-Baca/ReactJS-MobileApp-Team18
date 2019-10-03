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
    int expect = 0;
    int actual = test.calculateDistance(origin,origin,earthRadiusMiles);
    assertEquals("traveled nowhere",expect,actual);
  }
  @Test
  public void testMeetOnTheOtherSide(){
    origin.replace("latitude","0");
    origin.replace("longitude","180");
    destination.replace("latitude","0");
    destination.replace("longitude","-180");
    int expect = 0;
    int actual = test.calculateDistance(origin,destination,earthRadiusMiles);
    assertEquals("man 180 and -180 are close",expect,actual);
  }

  @Test
  public void testNPoleWithDifferentLong(){
    origin.replace("latitude","90");
    origin.replace("longitude","0");
    destination.replace("latitude","90");
    destination.replace("longitude","110");
    int expect = 0;
    int actual = test.calculateDistance(origin,destination,earthRadiusMiles);
    assertEquals("Turn around",expect,actual);
  }

  @Test
  public void testBackAndForth(){
    origin.replace("latitude","40");
    origin.replace("longitude","-105");
    destination.replace("latitude","40");
    destination.replace("longitude","105");
    int resultOne = test.calculateDistance(origin,destination,earthRadiusMiles);
    int resultTwo = test.calculateDistance(destination,origin,earthRadiusMiles);
    assertEquals("Walk up hill both ways",resultOne,resultTwo);
  }

}
