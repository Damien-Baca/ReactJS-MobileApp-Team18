package com.tripco.t18.misc;

import java.util.Map;

public class DistanceMatrix {
  int[][] matrix;

  DistanceMatrix(Map[] places, Double earthRadius) {
    matrix = new int[places.length][places.length];

    for (int i = 0; i < places.length; ++i) {
      for (int j = 0; j < places.length; ++j) {
        if (matrix[i][j] == 0 && i != j) {
          int locationDistance = GreatCircleDistance.calculateDistance(places[i], places[j], earthRadius);
          matrix[i][j] = locationDistance;
          matrix[j][i] = locationDistance;
        }
      }
    }
  }

  public int get(int row, int column) {
    return matrix[row][column];
  }
}
