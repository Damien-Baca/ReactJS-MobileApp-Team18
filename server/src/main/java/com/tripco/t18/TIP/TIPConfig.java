package com.tripco.t18.TIP;

import com.tripco.t18.misc.SqlQuery;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;




/** This class defines the Config response that provides the client
 * with server specific configuration information.
  * When used with restful API services,
 * An object is created from the request JSON by the MicroServer using GSON.
 * The buildResponse method is called to set the configuration information.
 * The MicroServer constructs the response JSON from the object using GSON.
 * When used for testing purposes,
 * An object is created using the constructor below.
 * The buildResponse method is called to set the configuration information.
 * The getDistance method is called to obtain the distance value for comparisons.
 */
public class TIPConfig extends TIPHeader {
  private String serverName;
  private List<String> placeAttributes;
  private List<String> optimizations;
  private List<Map<String, Object>> filters = new ArrayList<>();

  private final transient Logger log = LoggerFactory.getLogger(TIPConfig.class);

  public TIPConfig() {
    this.requestType = "config";
    this.requestVersion = 4;
  }

  @Override
  public void buildResponse() {
    this.serverName = "T18 THE FIGHTING MONGOOSES";
    this.placeAttributes = Arrays.asList("name","id","latitude","longitude","altitude",
        "municipality","region","country","continent","type");
    this.optimizations = Arrays.asList("none", "short");

    setFilters();

    log.trace("buildResponse -> {}", this);
  }

  private void setFilters() {
    Map<String, Object> typeFilters = new HashMap<>();
    String[] typeValues = {"airport","heliport","balloonport","closed"};
    typeFilters.put("name", "type");
    typeFilters.put("values", typeValues);
    filters.add(typeFilters);

    Map<String, Object> countryFilters = new HashMap<>();
    SqlQuery query = new SqlQuery();
    String[] countryValues = query.configQuery();
    countryFilters.put("name", "countries");
    countryFilters.put("values", countryValues);
    filters.add(countryFilters);
  }

  String getServerName() {
    return this.serverName;
  }

  List<String> getPlaceAttributes() {
    return this.placeAttributes;
  }

}
