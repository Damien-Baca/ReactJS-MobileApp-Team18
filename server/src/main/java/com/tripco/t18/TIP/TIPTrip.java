package com.tripco.t18.TIP;

import com.tripco.t18.misc.GreatCircleDistance;
import com.tripco.t18.misc.OptimizeTrip;
import java.util.ArrayList;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;



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
  private Map[] places;
  private ArrayList<Integer> distances;

  private final transient Logger log = LoggerFactory.getLogger(TIPDistance.class);


  TIPTrip(Integer version, Map options, Map[] places) {
    this();
    this.requestVersion = version;
    this.options = options;

    this.places = places;
    this.distances = new ArrayList<>();
  }

  private TIPTrip() { this.requestType = "trip"; }


  @Override
  public void buildResponse() {
    Double earthRadius = Double.parseDouble((String) options.get("earthRadius"));

    if (options.get("optimization").equals("short")) {
      places = OptimizeTrip.shortTrip(places, earthRadius);
    }

    for (int i = 0; i < this.places.length; ++i) {
      Map origin = places[i];
      Map destination = places[0];
      if (i < (places.length - 1)) {
        destination = places[i + 1];
      }

      this.distances.add(GreatCircleDistance.calculateDistance(origin, destination, earthRadius));
    }
    log.trace("buildResponse -> {}", this);
  }

  public Map getOptions() { return options;
  }

  public ArrayList<Integer> getDistances() { return distances;
  }

  public Map[] getPlaces() { return places;
  }
}