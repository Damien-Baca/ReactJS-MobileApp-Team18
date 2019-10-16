package com.tripco.t18.TIP;

import com.tripco.t18.misc.GreatCircleDistance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;

/** Defines the TIP distance object.
 *
 * For use with restful API services,
 * An object is created from the request JSON by the MicroServer using GSON.
 * The buildResponse method is called to determine the distance.
 * The MicroServer constructs the response JSON from the object using GSON.
 *
 * For unit testing purposes,
 * An object is created using the constructor below with appropriate parameters.
 * The buildResponse method is called to determine the distance.
 * The getDistance method is called to obtain the distance value for comparisons.
 *
 */
public class TIPDistance extends TIPHeader {
  private Map origin;
  private Map destination;
  private Double earthRadius;
  private Integer distance;

  private final transient Logger log = LoggerFactory.getLogger(TIPDistance.class);

  TIPDistance(int version, Map origin, Map destination, double earthRadius){
    this(version, origin, destination, earthRadius, 0);
  }

  TIPDistance(int version, Map origin, Map destination, double earthRadius, int distance) {
    this();
    this.requestVersion = version;
    this.origin = origin;
    this.destination = destination;
    this.earthRadius = earthRadius;
    this.distance = distance;
  }

  private TIPDistance() { this.requestType = "distance"; }


  @Override
  public void buildResponse() {
    this.distance = new GreatCircleDistance().calculateDistance(origin, destination, earthRadius);
    log.trace("buildResponse -> {}", this);
  }


  int getDistance() {
    return distance;
  }
}
