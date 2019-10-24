package com.tripco.t18.misc;
import java.util.Map;
import com.tripco.t18.misc.GreatCircleDistance;

public class OptimizeTrip {
  public static Map[] shortTrip(Map[] places, double earthRadius) {
    int[] bestTrip = new int[places.length];
    int bestDistance = Integer.MAX_VALUE;
    int[][] distanceMatrix = new int[places.length][places.length];
    GreatCircleDistance calculator = new GreatCircleDistance();

    for (int i = 0; i < places.length; ++i) {
      for (int j = 0; j < places.length; ++j) {
        if (distanceMatrix[i][j] == 0 && i != j) {
          int locationDistance = calculator.calculateDistance(places[i], places[j], earthRadius);
          distanceMatrix[i][j] = locationDistance;
          distanceMatrix[j][i] = locationDistance;
        }
      }
    }

    for (int i = 0; i < places.length; ++i) {
      boolean[] visited = new boolean[places.length];
      int[] trip = new int[places.length];
      int currentLocation = i;
      int tripIndex = 0;
      int distanceSum = 0;
      visited[currentLocation] = true;
      trip[tripIndex++] = currentLocation;

      while(tripIndex < places.length) {
        int localMinIndex = 0;
        int localMin = Integer.MAX_VALUE;

        for (int j = 0; j < places.length; j++) {
          if (distanceMatrix[currentLocation][j] < localMin && !visited[j]) {
            localMinIndex = j;
            localMin = distanceMatrix[currentLocation][j];
          }
        }

        currentLocation = localMinIndex;
        distanceSum += localMin;
        visited[currentLocation] = true;
        trip[tripIndex++] = currentLocation;
      }

      if (distanceSum < bestDistance) {
        bestTrip = trip;
        bestDistance = distanceSum;
      }

    }

    Map[] newPlaces = new Map[places.length];
    int newIndex = 0;

    for (int i : bestTrip) {
      newPlaces[newIndex] = places[i];
      ++newIndex;
    }

    return newPlaces;
  }
}
