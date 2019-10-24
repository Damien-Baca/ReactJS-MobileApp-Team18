package com.tripco.t18.misc;
import java.util.Map;
import com.tripco.t18.misc.GreatCircleDistance;

public class OptimizeTrip {
  public static Map[] shortTrip(Map[] places, double earthRadius) {
    int[] bestTrip = new int[places.length];
    int bestDistance = Integer.MAX_VALUE;
    int bestZeroIndex = -1;
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
      int distanceSum = 0;
      visited[currentLocation] = true;
      trip[0] = currentLocation;
      int zeroIndex = -1;

      for (int j = 1; j < places.length; ++j) {
        int localMinIndex = 0;
        int localMin = Integer.MAX_VALUE;

        for (int k = 0; k < places.length; k++) {
          if (distanceMatrix[currentLocation][k] < localMin && !visited[k]) {
            localMinIndex = k;
            localMin = distanceMatrix[currentLocation][k];
            if (k == 0) {
              zeroIndex = j;
            }
          }
        }

        currentLocation = localMinIndex;
        distanceSum += localMin;
        visited[currentLocation] = true;
        trip[j] = currentLocation;
      }

      if (distanceSum < bestDistance) {
        bestTrip = trip;
        bestDistance = distanceSum;
        bestZeroIndex = zeroIndex;
      }
    }

    Map[] newPlaces = new Map[places.length];
    int newIndex = 0;

    for (int i = 0; i < places.length; ++i) {
      newPlaces[newIndex++] = places[bestTrip[(i + bestZeroIndex) % places.length]];
    }

    return newPlaces;
  }
}
