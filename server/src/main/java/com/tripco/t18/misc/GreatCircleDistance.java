package com.tripco.t18.misc;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.lang.Math;
import java.util.Map;

/** Determines the distance between geographic coordinates.
 */
public class GreatCircleDistance {
  public int calculateDistance(Map origin, Map destination, Double earthRadius) {
    Double origin_lat = to_radians(Double.parseDouble((String) origin.get("latitude")));
    Double origin_lon = to_radians(Double.parseDouble((String) origin.get("longitude")));

    Double dest_lat = to_radians(Double.parseDouble((String) destination.get("latitude")));
    Double dest_lon = to_radians(Double.parseDouble((String) destination.get("longitude")));
    Double delta_lon = Math.abs(dest_lon - origin_lon);

    Double numerator = Math.pow(Math.cos(dest_lat) * Math.sin(delta_lon), 2);
    numerator += Math.pow(
        Math.cos(origin_lat) * Math.sin(dest_lat) - Math.sin(origin_lat) * Math.cos(dest_lat) * Math
            .cos(delta_lon), 2);
    numerator = Math.sqrt(numerator);

    Double denominator =
        Math.sin(origin_lat) * Math.sin(dest_lat) + Math.cos(origin_lat) * Math.cos(dest_lat) * Math
            .cos(delta_lon);
    Double arc = Math.atan2(numerator,denominator);

    return (int) Math.round((arc * earthRadius));
  }

  public Double to_radians(Double degrees) {
    Double pi = Math.PI;
    return degrees * (pi/180);
  }
}
