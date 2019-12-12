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
  private int bestZeroOffset;

  public void inplaceReverse(int[] newTrip, int i1, int i2) {
    while(i1 < i2) {
      int temp   = newTrip[i1];
      newTrip[i1] = newTrip[i2];
      newTrip[i2] = temp;
      i1++; i2--;
    }
  }

  public Map[] reorderPlaces(int[] newTrip, int zeroOffset)
  {
  	Map[] newPlaces = new Map[places.length];
	for (int i = 0; i < places.length; ++i) {
      newPlaces[i] = places[newTrip[(i + zeroOffset) % places.length]];
    }
    return newPlaces;
  }

  public Map[] shortTrip(Map[] places, Double earthRadius) {
    this.places = places;
    this.earthRadius = earthRadius;
    this.bestTrip = new int[places.length];
    this.currentTrip = new int[places.length];

    int zeroOffset = nearestNeighbor(false,false);
    return reorderPlaces(bestTrip, zeroOffset);
  }

  public Map[] shortestTrip(Map[] places, Double earthRadius) {
    this.places = places;
    this.earthRadius = earthRadius;
    this.bestTrip = new int[places.length];
    this.currentTrip = new int[places.length];

    int zeroOffset = nearestNeighbor(false,true);
    return reorderPlaces(bestTrip, zeroOffset);
  }

  public Map[] shorterTrip(Map[] places, Double earthRadius) {
    this.places = places;
    this.earthRadius = earthRadius;
    this.bestTrip = new int[places.length];
    this.currentTrip = new int[places.length];

    int zeroOffset = nearestNeighbor(true, false);
    return reorderPlaces(bestTrip, bestZeroOffset);
  }

  public void twoOpt(int[] trip, DistanceMatrix matrix, int zeroOffset)
  {
	boolean improvement = true;

	int[] newTrip = new int[trip.length];
    for(int i : trip)
    	newTrip[i] = trip[(i + zeroOffset) % places.length];

  	while(improvement) {
    	improvement = false;
	    for (int i = 0; i <= newTrip.length - 4; i++) {
	    	for(int k = i + 2; k <= newTrip.length - 2; k++) {
	    		double delta = matrix.get(newTrip[i],newTrip[k]) + matrix.get(newTrip[i+1],newTrip[k+1]) - matrix.get(newTrip[i],newTrip[i+1]) - matrix.get(newTrip[k],newTrip[k+1]);
	        	if(delta < 0) {
	        		inplaceReverse(newTrip, i+1, k);
	        		improvement = true;
	        	}
	    	}
		}
	}
	for(int i = 0; i < newTrip.length; i++) {
		if(newTrip[i] == 0) {
			zeroOffset = i;
			break;
		}
	}

	int tripDistance = 0;
	for(int i = 0; i < newTrip.length; i++) {
		tripDistance += matrix.get(newTrip[i], (i == newTrip.length -1) ? newTrip[0] : newTrip[i+1]);
	}

	if(tripDistance < bestDistance)
	{
		for (int n = 0; n < newTrip.length; ++n) {
          bestTrip[n] = newTrip[n];
        }
        bestDistance = tripDistance;
        bestZeroOffset = zeroOffset;
	}

  }

public void threeOpt(int[] trip, DistanceMatrix matrix, int zeroOffset)
{
  boolean improvement = true;

  int[] newTrip = new int[trip.length];
    for(int i : trip)
      newTrip[i] = trip[(i + zeroOffset) % places.length];

  while(improvement) 
  {
    improvement = false;
    for (int ci = 0; ci <= newTrip.length - 1; ci++) {
      int i = ci % newTrip.length;
      int i2 = (i + 1) % newTrip.length;
      for(int cj = 1; cj <= newTrip.length - 3; cj++) {
        int j = (i + cj) % newTrip.length;
        int j2 = (j + 1) % newTrip.length;
        for(int ck = cj + 1; ck <= newTrip.length - 1; ck++) {
          int k = (i + ck) % newTrip.length;
          int k2 = (k + 1) % newTrip.length;

          double delta1 = matrix.get(newTrip[i],newTrip[k])  + matrix.get(newTrip[i2],newTrip[k2]) - matrix.get(newTrip[i] ,newTrip[i2]) - matrix.get(newTrip[k],newTrip[k2]);
          double delta2 = matrix.get(newTrip[j],newTrip[k])  + matrix.get(newTrip[j2],newTrip[k2]) - matrix.get(newTrip[j] ,newTrip[j2]) - matrix.get(newTrip[k],newTrip[k2]);
          double delta3 = matrix.get(newTrip[i],newTrip[j])  + matrix.get(newTrip[i2],newTrip[j2]) - matrix.get(newTrip[i] ,newTrip[i2]) - matrix.get(newTrip[j],newTrip[j2]);
          double delval = matrix.get(newTrip[i],newTrip[i2]) + matrix.get(newTrip[j] ,newTrip[j2]) + matrix.get(newTrip[k] ,newTrip[k2]);
          double delta4 = matrix.get(newTrip[i],newTrip[j])  + matrix.get(newTrip[i2],newTrip[k])  + matrix.get(newTrip[j2],newTrip[k2]) - delval;
          double delta5 = matrix.get(newTrip[i],newTrip[k])  + matrix.get(newTrip[j2],newTrip[i2]) + matrix.get(newTrip[j] ,newTrip[k2]) - delval;
          double delta6 = matrix.get(newTrip[i],newTrip[j2]) + matrix.get(newTrip[k] ,newTrip[j])  + matrix.get(newTrip[i2],newTrip[k2]) - delval;
          double delta7 = matrix.get(newTrip[i],newTrip[j2]) + matrix.get(newTrip[k] ,newTrip[i2]) + matrix.get(newTrip[j] ,newTrip[k2]) - delval;

          if(delta4 < 0) {
            inplaceReverse(newTrip, j2, i);
            inplaceReverse(newTrip, k2, j);
            improvement = true;
          }
          else if(delta5 < 0) {
            inplaceReverse(newTrip, i2, k);
            inplaceReverse(newTrip, k2, j);
            improvement = true;
          }
          else if(delta6 < 0) {
            inplaceReverse(newTrip, i2, k);
            inplaceReverse(newTrip, j2, i);
            improvement = true;
          }
          else if(delta7 < 0) {
            inplaceReverse(newTrip, i2, k);
            inplaceReverse(newTrip, k2, j);
            inplaceReverse(newTrip, j2, i);
            improvement = true;
          }
          else if(delta1 < 0) {
            inplaceReverse(newTrip, i2, k);
            improvement = true;
          }
          else if(delta2 < 0) {
            inplaceReverse(newTrip, j2, i);
            improvement = true;
          }
          else if(delta3 < 0) {
            inplaceReverse(newTrip, k2, j);
            improvement = true;
          }
        }
      }
    }
  }

  for(int i = 0; i < newTrip.length; i++) {
    if(newTrip[i] == 0) {
      zeroOffset = i;
      break;
    }
  }

  int tripDistance = 0;
  for(int i = 0; i < newTrip.length; i++) {
    tripDistance += matrix.get(newTrip[i], (i == newTrip.length -1) ? newTrip[0] : newTrip[i+1]);
  }

  if(tripDistance < bestDistance)
  {
    for (int n = 0; n < newTrip.length; ++n) {
          bestTrip[n] = newTrip[n];
        }
        bestDistance = tripDistance;
        bestZeroOffset = zeroOffset;
  }
}

  private int nearestNeighbor(boolean shorter, boolean shortest) {
    DistanceMatrix matrix = new DistanceMatrix(places, earthRadius);
    bestZeroOffset = -1;

    for (int i = 0; i < places.length; ++i) {
      currentLocation = i;
      currentDistance = 0;
      int zeroOffset = calculateFromCurrentLocation(matrix);

      if (currentDistance < bestDistance) 
      {
        if(shorter) {
          twoOpt(currentTrip, matrix, zeroOffset);
        } else if(shortest) {
          threeOpt(currentTrip, matrix, zeroOffset);
        } else {
          for (int n = 0; n < currentTrip.length; ++n) 
          bestTrip[n] = currentTrip[n];

          bestDistance = currentDistance;
          bestZeroOffset = zeroOffset;
        }
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
