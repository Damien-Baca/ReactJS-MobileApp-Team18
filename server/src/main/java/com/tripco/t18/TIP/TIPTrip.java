package com.tripco.t18.TIP;

import com.tripco.t18.misc.GreatCircleDistance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;
import java.util.Arrays;

/** Defines the TIP trip object.
 *
 * For use with restful API services,
 * An object is created from the request JSON by the MicroServer using GSON.
 * The buildResponse method is called to determine the distances.
 * The MicroServer constructs the response JSON from the object using GSON.
 *
 * For unit testing purposes,
 * An object is created using the constructor below with appropriate parameters.
 * The buildResponse method is called to determine the distances.
 * The getDistances method is called to obtain the distances value for comparisons.
 *
 */
public class TIPTrip extends TIPHeader {
  private Map options;
  private List<Map> places;
  private List<int>
  private Float earthRadius;
  private Integer distance;

  private final transient Logger log = LoggerFactory.getLogger(TIPDistance.class);


  TIPTrip(int version, Map origin, Map destination, float earthRadius) {
    this();
    this.requestVersion = version;
    this.origin = origin;
    this.destination = destination;
    this.earthRadius = earthRadius;
    this.distance = 0;
  }


  private TIPDistance() {
    this.requestType = "distance";
  }


  @Override
  public void buildResponse() {
    this.distance = new GreatCircleDistance().calculateDistance(origin, destination, earthRadius);
    log.trace("buildResponse -> {}", this);
  }


  int getDistance() {
    return distance;
  }
}