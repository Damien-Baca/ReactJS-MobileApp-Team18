package com.tripco.t18.TIP;

import com.tripco.t18.misc.SqlQuery;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/** Defines the TIP locations object.
 * For use with restful API services,
 * An object is created from the request JSON by the MicroServer using GSON.
 * The buildResponse method is called to send a database query and return the results.
 * The MicroServer constructs the response JSON from the object using GSON.
 * For unit testing purposes,
 * An object is created using the constructor below with appropriate parameters.
 * The buildResponse method is called to find appropriate responses.
 */

public class TIPLocations extends TIPHeader {
  private String match;
  private Map[] narrow;
  private Integer limit;
  private Integer found;
  private Map[] places;

  private final transient Logger log = LoggerFactory.getLogger(TIPLocations.class);

  TIPLocations(Integer version, String match, Map[] narrow, Integer limit) {
    this();
    this.requestVersion = version;
    this.match = match;
    this.limit = (limit == null) ? 100 : limit;
    this.narrow = (narrow.length == 0) ? null : narrow;
  }

  TIPLocations() { this.requestType = "location";
  }

  /*
   * This is where the SQL querying takes place. I'll probably create a class to
   * handle the queries separately. Essentially, the match variable will hold the
   * matchable string, and any thing that matches will be stores in the places
   * variable. There is an optional limit to the number of matches found in the
   * variable matches, and the number of matches found is reported with the
   * found variable.
   */

  @Override
  public void buildResponse() {
    SqlQuery query = new SqlQuery();
    Map<String, String>[] result;
    result = query.locationQuery(match, narrow, limit);

    found = Integer.parseInt(result[0].get("found"));

    ArrayList<Map<String, String>> workingPlaces = new ArrayList<>(
        Arrays.asList(result).subList(1, result.length));

    places = workingPlaces.toArray(new Map[workingPlaces.size()]);

    log.trace("buildResponse -> {}", this);
  }
}
