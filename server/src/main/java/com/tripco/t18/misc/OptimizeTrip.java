package com.tripco.t18.misc;
import java.util.Arrays;
import java.util.Map;
import com.tripco.t18.misc.GreatCircleDistance;

public class OptimizeTrip {
  public static Map[] shortTrip(Map[] places, Double earthRadius) {
    int[] bestTrip = new int[places.length]; int bestDistance = Integer.MAX_VALUE;
    int bestZeroOffset = -1; DistanceMatrix matrix = new DistanceMatrix(places, earthRadius);

    for (int i = 0; i < places.length; ++i) {
      boolean[] visited = new boolean[places.length]; int[] trip = new int[places.length]; int currentLocation = i;
      int distanceSum = 0; visited[currentLocation] = true; trip[0] = currentLocation; int zeroOffset = -1;

      for (int j = 1; j < places.length; ++j) { if(currentLocation == 0) { zeroOffset = j - 1;
        }
        int localMinIndex = -1; int localMin = Integer.MAX_VALUE;

        for (int k = 0; k < places.length; ++k) {
          if (matrix.get(currentLocation, k) < localMin && !visited[k]) {
            localMinIndex = k; localMin = matrix.get(currentLocation, k);
          }
        }

        currentLocation = localMinIndex; distanceSum += localMin;
        visited[currentLocation] = true; trip[j] = currentLocation;
      }

      distanceSum += matrix.get(trip[trip.length - 1], trip[0]);

      if (distanceSum < bestDistance) {
        bestTrip = trip; bestDistance = distanceSum; bestZeroOffset = zeroOffset;
      }
    }

    Map[] newPlaces = new Map[places.length]; int newIndex = 0;

    for (int i = 0; i < places.length; ++i) {
      newPlaces[newIndex++] = places[bestTrip[(i + bestZeroOffset) % places.length]];
    }

    return newPlaces;
  }
}
