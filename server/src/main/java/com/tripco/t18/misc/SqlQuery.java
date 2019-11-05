package com.tripco.t18.misc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/** Performs a simple matching query for a database of Colorado locations.
 */
public class SqlQuery {
  // db configuration information
  private final String myDriver = "com.mysql.jdbc.Driver";
  private String myUrl = "";
  private String user = "";
  private String pass = "";
  private boolean local;
  private final String[] databaseIds = {"world.name","latitude","longitude",
      "world.id","altitude","municipality","type","region.name","country.name","continent.name"};
  private final String[] identifiers = {"name","latitude","longitude",
      "id","altitude","municipality","type","region","country","continent"};
  private final String[] joinTables = {"country", "region", "world"};
  private final String[] joinIds = {"continent.id = country.continent",
  "country.id = region.iso_country", "region.id = world.iso_region"};
  private final String[] order = {"continent.name", "country.name", "region.name",
      "world.municipality", "world.name"};
  private Map<String, String>[] filters = null;

  // fill in SQL queries to count the number of records and to retrieve the data
  private String count = "";
  private String search = "";

  // Code Source: https://github.com/csucs314f19/tripco/blob/master/guides/database/DatabaseTesting.md

  /**
   * Initializes an SqlQuery object with the appropriate SQL database URL,
   * user name, and password according to the current environment.
   */
  public SqlQuery() {
    // Here are some environment variables. The first one is set by default in
    // Travis, and the other we set ourselves (see the other guide)
    String isTravis = System.getenv("TRAVIS");
    String isDevelopment = System.getenv("CS314_ENV");

    // If we're running on Travis, use the proper url + credentials
    if (isTravis != null && isTravis.equals("true")) {
      myUrl = "jdbc:mysql://127.0.0.1/cs314";
      user = "root";
      pass = null;
      local = true;
    }

    // else, use our credentials; also account for if we have our own dev
    // environment variable (see the other guide) for connecting through an SSH
    // tunnel
    else if (isDevelopment != null && isDevelopment.equals("development")) {
      myUrl = "jdbc:mysql://127.0.0.1:56247/cs314";
      user = "cs314-db";
      pass = "eiK5liet1uej";
      local = false;
    }

    // Else, we must be running against the production database directly
    else {
      myUrl = "jdbc:mysql://faure.cs.colostate.edu/cs314";
      user = "cs314-db";
      pass = "eiK5liet1uej";
      local = false;
    }
  }

  // Code Source: https://github.com/csucs314f19/tripco/blob/master/guides/database/DatabaseGuide.md

  /**
   * Constructs and sends an SQL query based on input.
   * Precondition: query is not empty and limit is >= 0
   *
   * @param query     A string used to find matches amongst the database
   * @param limit     The maximum number of results returned
   * @return A list of dictionaries containing the relevant results
   */
  public Map[] sendQuery(String query, Map[] narrow, Integer limit) {
    filters = narrow;
    if (narrow != null) {
      for (Map filter : filters) {
        filter.replace("value", cleanTerm((String) filter.get("value")));
      }
    }

    String cleanQuery = cleanTerm(query);
    count = addLimit(constructSearch(cleanQuery, true), limit);
    System.out.println(count);
    search = addLimit(constructSearch(cleanQuery, false), limit);
    System.out.println(search);
    Map[] returnValues;

    // Arguments contain the username and password for the database
    try {
      Class.forName(myDriver);
      // connect to the database and query
      try (Connection conn = DriverManager.getConnection(myUrl, user, pass);
          Statement stCount = conn.createStatement();
          Statement stQuery = conn.createStatement();
          ResultSet rsCount = stCount.executeQuery(count);
          ResultSet rsQuery = stQuery.executeQuery(search)
      ) {
        returnValues = constructResults(rsCount, rsQuery);
      }
    } catch (Exception e) {
      System.err.println("Exception: " + e.getMessage());
      returnValues = null;
    }

    return returnValues;
  }

  private String cleanTerm(String term) {
    return "'%" + term.replaceAll("[^A-Za-z0-9]","_") +"%'";
  }

  private String constructSearch(String query, Boolean count) {
    String searchQuery = "select ";

    searchQuery += constructStart(count) + "\nfrom " + constructJoin() +"\nwhere ";

    if (filters != null) {
      searchQuery += constructFilters();
    }

    searchQuery += constructWhere(query) + constructOrder();

    return searchQuery;
  }

  private String constructJoin() {
    String returnString = "continent";

    for (int i = 0; i < joinTables.length; ++i) {
      returnString += "\ninner join " + joinTables[i] + " on " + joinIds[i];
    }

    return returnString;
  }

  private String constructStart(boolean count) {
    String returnString = "";
    if (count) {
      returnString += "count(*) ";
    } else {
      for (String identifier : databaseIds) {
        returnString += identifier + ",";
      }
      returnString = returnString.substring(0, returnString.length() - 1) + " ";
    }

    return returnString;
  }

  private String constructFilters() {
    String returnString = "";

    for (Map filter : filters) {
      returnString += filter.get("name") + " like " + filter.get("value") + "\nand ";
    }

    return returnString;
  }

  private String constructWhere(String query) {
    String returnString = "(";

    for (String identifier : databaseIds) {
      returnString += identifier + " like " + query + "\nor ";
    }

    returnString = returnString.substring(0, returnString.length() - 4) + ")";

    return returnString;
  }

  private String constructOrder() {
    String returnString = "\norder by ";

    for (String name : order) {
      returnString += name + ", ";
    }

    returnString = returnString.substring(0, returnString.length() - 2) + " asc";

    return returnString;
  }

  private String addLimit(String query, Integer limit) {
    return query  + "\nlimit " + limit + ";";
  }

  @SuppressWarnings("unchecked")
  private Map<String, String>[] constructResults(ResultSet countResult,
      ResultSet queryResult) throws SQLException {
    countResult.next();
    Integer found = countResult.getInt(1);
    ArrayList<Map<String, String>> workingResults = new ArrayList<>();
    workingResults.add(new HashMap<String, String>() {{
        put("found", found.toString());
      }
    });

    while (queryResult.next()) {
      HashMap<String, String> nextResult = new HashMap<>();

      for (int i = 0; i < identifiers.length; ++i) {
        nextResult.put(identifiers[i], queryResult.getString(databaseIds[i]));
      }

      workingResults.add(nextResult);
    }

    return (Map<String, String>[]) workingResults.toArray(new Map[workingResults.size()]);
  }

  public boolean localDatabase() {
    return local;
  }
}
