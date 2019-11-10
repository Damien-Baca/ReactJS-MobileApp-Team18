package com.tripco.t18.misc;

import java.util.Map;
import org.junit.Test;
import static org.junit.Assert.assertEquals;

public class TestSqlQuery {
  @Test
  public void testConfigQuery() {
    SqlQuery testQuery = new SqlQuery();
    int expectedCount = (testQuery.localDatabase() ? 2 : 247);

    int actualCount = testQuery.configQuery().length;

    assertEquals("Expect 248 results for list of countries.", expectedCount, actualCount);
  }

  @Test
  public void testLocationsNameQuery() {
    SqlQuery testQuery = new SqlQuery();
    int expectedCount = (testQuery.localDatabase() ? 6 : 39114);

    Map<String, String>[] queryResult = testQuery.locationQuery("airport", null, 10);
    int actualCount = Integer.parseInt(queryResult[0].get("found"));

    assertEquals("Expect 39114 results from \"airport\".", expectedCount, actualCount);
  }

  @Test
  public void testLocationsLatitudeQuery() {
    SqlQuery testQuery = new SqlQuery();
    int expectedCount = (testQuery.localDatabase() ? 9 : 12604);

    Map<String, String>[] queryResult = testQuery.locationQuery("40", null, 10);
    int actualCount = Integer.parseInt(queryResult[0].get("found"));

    assertEquals("Expect 12604 results from \"40\".", expectedCount, actualCount);
  }
}
