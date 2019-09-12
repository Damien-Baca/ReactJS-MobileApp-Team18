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
  private Float earthRadius;
  private Integer distance;

  private final transient Logger log = LoggerFactory.getLogger(TIPDistance.class);


  TIPDistance(int version, Map origin, Map destination, float earthRadius) {
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
    double origin_lat = to_radians(Double.parseDouble((String)origin.get("latitude")));
    double origin_lon = to_radians(Double.parseDouble((String)origin.get("longitude")));

    double dest_lat   = to_radians(Double.parseDouble((String)destination.get("latitude")));
    double dest_lon   = to_radians(Double.parseDouble((String)destination.get("longitude")));
    double delta_long = Math.abs(dest_lon - origin_lon);

    double numerator = Math.pow(Math.cos(dest_lat) * Math.sin(delta_long), 2);
    numerator += Math.pow(Math.cos(origin_lat)*Math.sin(dest_lat) - Math.sin(origin_lat)*Math.cos(dest_lat)*Math.cos(delta_long), 2);
    numerator  = Math.sqrt(numerator);

    double denominator = Math.sin(origin_lat)*Math.sin(dest_lat) + Math.cos(origin_lat)*Math.cos(dest_lat)*Math.cos(delta_long);
    double arc = Math.atan(numerator/denominator);

    this.distance = (int)(arc * earthRadius);
    log.trace("buildResponse -> {}", this);
  }


  int getDistance() {
    return distance;
  }


  double to_radians(double degrees) {
    double pi = Math.PI;
    return degrees * (pi/180);
  }
}
