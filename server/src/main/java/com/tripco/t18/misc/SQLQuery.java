package com.tripco.t18.misc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.ResultSet;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

public class SQLQuery {
  // db configuration information
  private final static String myDriver = "com.mysql.jdbc.Driver";
  private final static String myUrl = "jdbc:mysql://faure.cs.colostate.edu/cs314";
  private final static String user = "cs314-db";
  private final static String pass = "eiK5liet1uej";
  private final static String[] identifiers = {"name","latitude","longitude",
      "id","altitude","municipality","type"};

  // fill in SQL queries to count the number of records and to retrieve the data
  private static String count = "";
  private static String search = "";

  public Map[] sendQuery(String query, Integer limit) {
    String cleanQuery = "'%" +query.replaceAll("[^A-Za-z0-9]","_") +"%'";
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

    for (String identifier : identifiers) {
      searchQuery += identifier + " like " + query + " or ";
    }

    return searchQuery.substring(0, searchQuery.length() - 3);
  }

  private String addLimit(String query, Integer limit) {
    return query  + "limit " + limit + ";";
  }

  @SuppressWarnings("unchecked")
  private static Map<String, String>[] constructResults(ResultSet countResult, ResultSet queryResult) throws SQLException {
    countResult.next();
    Integer found = countResult.getInt(1);
    ArrayList<Map<String, String>> workingResults = new ArrayList<>();
    workingResults.add(new HashMap<String, String>() {{put("found", found.toString());}});

    while (queryResult.next()) {
      HashMap<String, String> nextResult = new HashMap<>();

      for (String identifier : identifiers) {
        nextResult.put(identifier, queryResult.getString(identifier));
      }

      workingResults.add(nextResult);
    }

    return (Map<String, String>[]) workingResults.toArray(new Map[workingResults.size()]);
  }
}
