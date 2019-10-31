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
  private final String[] identifiers = {"name","latitude","longitude",
      "id","altitude","municipality","type"};
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
    search = addLimit(constructSearch(cleanQuery, false), limit);
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

    if (count) {
      searchQuery += "count(*) ";
    } else {
      for (String identifier : identifiers) {
        searchQuery += identifier + ",";
      }
      searchQuery = searchQuery.substring(0, searchQuery.length() - 1) + " ";
    }

    searchQuery += "from colorado where ";

    if (filters != null) {
      for (Map filter : filters) {
        searchQuery += filter.get("name") + " like " + filter.get("value") + " and ";
      }
    }

    searchQuery += "(";

    for (String identifier : identifiers) {
      searchQuery += identifier + " like " + query + " or ";
    }

    searchQuery = searchQuery.substring(0, searchQuery.length() - 4) + ")";

    System.out.println(searchQuery);

    return searchQuery;
  }

  private String addLimit(String query, Integer limit) {
    return query  + "limit " + limit + ";";
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

      for (String identifier : identifiers) {
        nextResult.put(identifier, queryResult.getString(identifier));
      }

      workingResults.add(nextResult);
    }

    return (Map<String, String>[]) workingResults.toArray(new Map[workingResults.size()]);
  }

  public boolean localDatabase() {
    return local;
  }
}
