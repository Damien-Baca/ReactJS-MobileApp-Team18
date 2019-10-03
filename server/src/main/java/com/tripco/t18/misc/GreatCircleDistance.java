package com.tripco.t18.misc;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.lang.Math;
import java.util.Map;

/** Determines the distance between geographic coordinates.
 */
public class GreatCircleDistance {
  public int calculateDistance(Map origin, Map destination, float earthRadius) {
    double origin_lat = to_radians(Double.parseDouble((String) origin.get("latitude")));
    double origin_lon = to_radians(Double.parseDouble((String) origin.get("longitude")));

    double dest_lat = to_radians(Double.parseDouble((String) destination.get("latitude")));
    double dest_lon = to_radians(Double.parseDouble((String) destination.get("longitude")));
    double delta_lon = Math.abs(dest_lon - origin_lon);

    double numerator = Math.pow(Math.cos(dest_lat) * Math.sin(delta_lon), 2);
    numerator += Math.pow(
        Math.cos(origin_lat) * Math.sin(dest_lat) - Math.sin(origin_lat) * Math.cos(dest_lat) * Math
            .cos(delta_lon), 2);
    numerator = Math.sqrt(numerator);

    double denominator =
        Math.sin(origin_lat) * Math.sin(dest_lat) + Math.cos(origin_lat) * Math.cos(dest_lat) * Math
            .cos(delta_lon);
    double arc = Math.atan2(numerator,denominator);

    return Math.round((int) (arc * earthRadius));
  }

  public double to_radians(double degrees) {
    double pi = Math.PI;
    return degrees * (pi/180);
  }
}
