package com.tripco.t18.TIP;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;

public class TIPLocation extends TIPHeader {
  private Integer requestVersion;
  private String match;
  private Integer limit;
  private Integer found;
  private Map[] places;

  private final transient Logger log = LoggerFactory.getLogger(TIPLocation.class);

  TIPLocation(Integer version, String match, Integer limit) {
    this();
    this.requestVersion = version;
    this.match = match;
    this.limit = limit;
  }

  TIPLocation(Integer version, String match) {
    this(version, match, Integer.MAX_VALUE);
  }

  TIPLocation() { this.requestType = "location"; }

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
    // stub
    log.trace("buildResponse -> {}", this);
  }
}