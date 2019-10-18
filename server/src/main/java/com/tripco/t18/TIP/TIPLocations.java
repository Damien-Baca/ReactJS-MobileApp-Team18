package com.tripco.t18.TIP;

import com.tripco.t18.misc.SQLQuery;
import java.util.Arrays;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.ArrayList;
import java.util.Map;

public class TIPLocations extends TIPHeader {
  private String match;
  private Integer limit;
  private Integer found;
  private Map[] places;

  private final transient Logger log = LoggerFactory.getLogger(TIPLocations.class);

  TIPLocations(Integer version, String match, Integer limit) {
    this();
    this.requestVersion = version;
    this.match = match;
    this.limit = limit;
  }

  TIPLocations(Integer version, String match) {
    this(version, match, 100);
  }

  TIPLocations() { this.requestType = "location"; }

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
    SQLQuery query = new SQLQuery();
    Map<String, String>[] result = query.sendQuery(match, limit);
    found = Integer.parseInt(result[0].get("found"));

    ArrayList<Map<String, String>> workingPlaces = new ArrayList<>(
        Arrays.asList(result).subList(1, result.length));

    places = workingPlaces.toArray(new Map[workingPlaces.size()]);

    log.trace("buildResponse -> {}", this);
  }
}
