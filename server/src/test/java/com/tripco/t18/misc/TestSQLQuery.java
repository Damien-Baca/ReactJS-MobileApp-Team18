package com.tripco.t18.misc;

import java.util.Map;
import org.junit.Test;
import static org.junit.Assert.assertEquals;

public class TestSQLQuery {
  @Test
  public void testNameQuery() {
    SQLQuery testQuery = new SQLQuery();
    int expectedCount = (testQuery.localDatabase() ? 5 : 297);

    Map<String, String>[] queryResult = testQuery.sendQuery("airport", 10);
    int actualCount = Integer.parseInt(queryResult[0].get("found"));

    assertEquals("Expect 5 results from \"airport\".", expectedCount, actualCount);
  }

  @Test
  public void testLatitudeQuery() {
    SQLQuery testQuery = new SQLQuery();
    int expectedCount = (testQuery.localDatabase() ? 9 : 223);

    Map<String, String>[] queryResult = testQuery.sendQuery("40", 10);
    int actualCount = Integer.parseInt(queryResult[0].get("found"));

    assertEquals("Expect 9 results from \"40\".", expectedCount, actualCount);
  }
}
