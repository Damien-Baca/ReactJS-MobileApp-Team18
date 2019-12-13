package com.tripco.t18.TIP;

import com.tripco.t18.misc.GreatCircleDistance;
import com.tripco.t18.misc.OptimizeTrip;
import java.util.ArrayList;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;



/** Defines the TIP trip object.
 * For use with restful API services,
 * An object is created from the request JSON by the MicroServer using GSON.
 * The buildResponse method is called to determine the distances.
 * The MicroServer constructs the response JSON from the object using GSON.
 * For unit testing purposes,
 * An object is created using the constructor below with appropriate parameters.
 * The buildResponse method is called to determine the distances.
 * The getDistances method is called to obtain the distances value for comparisons.
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

  private TIPTrip() { this.requestType = "trip";
  }

  @Override
  public void buildResponse() {
    Double earthRadius = Double.parseDouble((String) options.get("earthRadius"));
    Object opt = options.get("optimization");

    int num_places = places.length;
    boolean auto = opt.equals("automatic");

    // CONSTANT VALUES SHOULD BE CHANGED AFTER BENCHMARKING!! (Delete This After)
    if ((auto && num_places <= 50) || opt.equals("shortest")) {       // Shortest - 3 Opt
      places = new OptimizeTrip().shortestTrip(places, earthRadius);
    } else if ((auto && num_places <= 200) || opt.equals("shorter")) { // Shorter - 2 Opt
      places = new OptimizeTrip().shorterTrip(places, earthRadius);
    } else if ((auto && num_places <= 1000) || opt.equals("short")) { // Short - NN
      places = new OptimizeTrip().shortTrip(places, earthRadius);
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