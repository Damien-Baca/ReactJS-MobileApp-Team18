package com.tripco.t18.misc;
import java.util.Arrays;
import java.util.Map;
import com.tripco.t18.misc.GreatCircleDistance;

public class OptimizeTrip {
  private Map[] places;
  private Double earthRadius;
  private int[] bestTrip;
  private int[] currentTrip;
  private int bestDistance = Integer.MAX_VALUE;
  private int currentLocation;
  private int currentDistance;

  public void inplaceReverse(places, i1, i2) { // reverse in place
    while(i1 < i2) {
      temp = places[i1]
      places[i1] = places[i2]
      places[i2] = temp
      i1++; i2--
    }
  }

  public Map[] shortTrip(Map[] places, Double earthRadius) {
  	var improvement = false;
    this.places = places;
    this.earthRadius = earthRadius;
    this.bestTrip = new int[places.length];
    this.currentTrip = new int[places.length];

    int zeroOffset = nearestNeighbor();

    Map[] newPlaces = new Map[places.length];

    for (int i = 0; i < places.length; ++i) {
      newPlaces[i] = places[bestTrip[(i + zeroOffset) % places.length]];
    }

	while(improvement) {
	    for (int i = 0; i <= newPlaces.length - 3; ++i) {
	    	for(int k = i + 2; k <= newPlaces.length - 1; k++) {
	    		delta1 = matrix.get(currentTrip[i],currentTrip[k])   + matrix.get(currentTrip[i+1],currentTrip[k+1]) 
	        		   - matrix.get(currentTrip[i],currentTrip[i+1]) - matrix.get(currentTrip[k],currentTrip[k+1]);
	        	if(delta < 0)
	        	{
	        		inplaceReverse(newPlaces, i+1, k);
	        		improvement = true;
	        	}
	
	    	}
		}
	}

    return newPlaces;
  }

  private int nearestNeighbor() {
    DistanceMatrix matrix = new DistanceMatrix(places, earthRadius);
    int bestZeroOffset = -1;

    for (int i = 0; i < places.length; ++i) {
      currentLocation = i;
      currentDistance = 0;
      int zeroOffset = calculateFromCurrentLocation(matrix);

      if (currentDistance < bestDistance) {
        for (int n = 0; n < currentTrip.length; ++n) {
          bestTrip[n] = currentTrip[n];
        }
        bestDistance = currentDistance;
        bestZeroOffset = zeroOffset;
      }
    }

    return bestZeroOffset;
  }

  private int calculateFromCurrentLocation(DistanceMatrix matrix) {
    int zeroOffset = -1;
    boolean[] visited = new boolean[places.length];
    visited[currentLocation] = true;
    currentTrip[0] = currentLocation;

    for (int j = 1; j < places.length; ++j) {
      if (currentLocation == 0) {
        zeroOffset = j - 1;
      }
      int localMinIndex = -1;
      int localMin = Integer.MAX_VALUE;

      for (int k = 0; k < places.length; ++k) {
        if (matrix.get(currentLocation, k) < localMin && !visited[k]) {
          localMinIndex = k;
          localMin = matrix.get(currentLocation, k);
        }
      }

      currentLocation = localMinIndex;
      currentDistance += localMin;
      visited[currentLocation] = true;
      currentTrip[j] = currentLocation;
    }

    currentDistance += matrix.get(currentTrip[currentTrip.length - 1], currentTrip[0]);

    return zeroOffset;
  }
}
