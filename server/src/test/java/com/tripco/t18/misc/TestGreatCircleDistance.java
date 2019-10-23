package com.tripco.t18.misc;

import java.util.HashMap;
import java.util.Map;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class TestGreatCircleDistance {
  private final Double earthRadiusMiles= 3958.8;
  private final Double earthRadiusKilometer= 6371.0;
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

  @Test
  public void testPositiveDistance(){
    origin.replace("latitude","0");
    origin.replace("longitude","0");
    int[] Values ={0,1,2,3,4,5,6,-6,-5,-4,-3,-2,-1};
    for (int num: Values){
        destination.replace("latitude", Integer.toString(num*15));
        destination.replace("longitude", Integer.toString(num*30));
        int currentDistance = test.calculateDistance(origin, destination, earthRadiusMiles);
        int minimumDistance = 0;
        assertTrue("All distances should be positive", minimumDistance <= currentDistance);
    }
  }

  @Test
  public void testDistance() {
    int actual,expect;
    origin.replace("latitude","40.576179");
    origin.replace("longitude","-105.080773");
    destination.replace("latitude","35.701182");
    destination.replace("longitude","139.709557");
    expect = 5755;
    actual = test.calculateDistance(origin,destination,earthRadiusMiles);
    assertEquals("CSU to Shinjuku",expect,actual);
    origin.replace("latitude","48.858442");
    origin.replace("longitude","2.294432");
    destination.replace("latitude","-33.856646");
    destination.replace("longitude","151.215404");
    expect = 10541;
    actual = test.calculateDistance(origin,destination,earthRadiusMiles);
    assertEquals("Paris to Sydney",expect,actual);
    origin.replace("latitude","40.5753");
    origin.replace("longitude","-105.0972");
    destination.replace("latitude","-12.045407");
    destination.replace("longitude","-77.022807");
    expect = 4055;
    actual = test.calculateDistance(origin,destination,earthRadiusMiles);
    assertEquals("Krazy Karls to Lima",expect,actual);
    origin.replace("latitude","-34.654227");
    origin.replace("longitude","-58.5693034");
    destination.replace("latitude","-36.844260");
    destination.replace("longitude","174.770019");
    expect = 6425;
    actual = test.calculateDistance(origin,destination,earthRadiusMiles);



    assertEquals("Buenos Aires to Auckland",expect,actual);
  }
}
