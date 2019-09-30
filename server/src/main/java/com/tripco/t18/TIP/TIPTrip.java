package com.tripco.t18.TIP;

import com.tripco.t18.misc.GreatCircleDistance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;
import java.util.ArrayList;

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
  private ArrayList<Map> places;
  private Integer[] distances;

  private final transient Logger log = LoggerFactory.getLogger(TIPDistance.class);


  TIPTrip(int version, Map options, ArrayList<Map> places) {
    this();
    this.requestVersion = version;
    this.options = options;
    this.places = places;
    this.distances = new ArrayList<>();
  }


  private TIPTrip() { this.requestType = "trip"; }


  @Override
  public void buildResponse() {
    this.distances.set([1, 2, 3]);
    log.trace("buildResponse -> {}", this);
  }


  public ArrayList<Integer> getDistances() {
    return distances;
  }

  public ArrayList<Map> getPlaces() { return places; }
}