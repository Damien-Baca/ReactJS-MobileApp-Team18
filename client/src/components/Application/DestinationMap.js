import React, {Component} from 'react';
import {Map, Marker, Polyline, Popup, TileLayer} from "react-leaflet";
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

/*
 * Renders a Leaflet Map with Markers and a Polyline.
 */

export default class DestinationMap extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (this.renderLeafletMap());
  }

  renderLeafletMap() {
    return (
        <Map bounds={this.itineraryBounds()}
             style={{height: 500, maxwidth: 700}}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                     attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          {this.generateDestinationMarkers()}
          {this.renderPolyline()}
        </Map>
    )
  }

  generateDestinationMarkers() {
    let markerList = [this.props.userLocation];
    if (this.props.destinations.length > 0) {
      markerList = [];

      this.props.destinations.forEach((destination) => (
          markerList.push(Object.assign({}, {
            latitude: destination.latitude,
            name: destination.name,
            longitude: this.modifyLong(destination.longitude)}))
      ));
    }

    return (
        markerList.map((marker, index) => (
            <Marker
                key={`marker_${index}`}
                position={L.latLng(marker.latitude, marker.longitude)}
                icon={this.generateMarkerIcon()}>
              < Popup
                  className="font-weight-extrabold">{marker.name}</Popup>
            </Marker>
        ))
    );
  }

  renderPolyline() {
    let polylineList = [];
    let polyline = [];
    let origin = [];
    let previousLatLong = [];
    let index = 0;
    let currentLong = 0;
    if(this.props.destinations.length>1) {
      this.props.destinations.forEach((destination) => {
            if (index === 0) {
              origin = [parseFloat(destination.latitude),
                this.modifyLong(parseFloat(destination.longitude))];
              index++;
            }
            if (previousLatLong === []) {
              previousLatLong = origin;
            } else {
              currentLong = this.modifyLong(parseFloat(destination.longitude));
              if (Math.abs(currentLong - previousLatLong[1]) > 180) {
                if (currentLong > previousLatLong[1]) {
                  polyline = [[previousLatLong[0], previousLatLong[1]],
                    [parseFloat(destination.latitude), currentLong - 360]];
                  polylineList.push(polyline);

                  polyline = [[previousLatLong[0], previousLatLong[1] + 360],
                    [parseFloat(destination.latitude), currentLong]];
                  polylineList.push(polyline);
                } else {
                  polyline = [[previousLatLong[0], previousLatLong[1]],
                    [parseFloat(destination.latitude), currentLong + 360]];
                  polylineList.push(polyline);

                  polyline = [[previousLatLong[0], previousLatLong[1] - 360],
                    [parseFloat(destination.latitude), currentLong]];
                  polylineList.push(polyline);
                }
                previousLatLong = [parseFloat(destination.latitude), currentLong];
              } else {
                polyline = [previousLatLong, [parseFloat(destination.latitude),
                  this.modifyLong(parseFloat(destination.longitude))]];
                previousLatLong = polyline[1];
                polylineList.push(polyline);
              }
            }
          }
      );
      if (Math.abs(origin[1] - previousLatLong[1]) > 180) {
        if (origin[1] > previousLatLong[1]) {
          console.log(origin[1] > previousLatLong);
          polyline = [previousLatLong, [origin[0], origin[1] - 360]];
          polylineList.push(polyline);
          polyline = [[previousLatLong[0], previousLatLong[1] + 360], origin];
          polylineList.push(polyline);
        } else {
          polyline = [previousLatLong, [origin[0], origin[1] + 360]];
          polylineList.push(polyline);
          polyline = [[previousLatLong[0], previousLatLong[1] - 360], origin];
          polylineList.push(polyline);
        }
      } else {
        polyline = [previousLatLong, origin];
        polylineList.push(polyline);
      }
      polylineList.splice(0,1);
    }
    console.log(polylineList);
    return (
        polylineList.map((line) => (
            <Polyline
              color={'blue'}
              positions={line}
            />
        ))
    );
  }

  modifyLong(long){
    let retLong=long;
    if(long>180){
      retLong=long-360;
    }
    else if (long < -180) {
      retLong=long+360;
    }
    return retLong;
  }

  itineraryBounds() {
    let boundaries = {
      max: {
        latitude: parseFloat(this.props.userLocation.latitude),
        longitude: parseFloat(this.props.userLocation.longitude)
      },
      min: {
        latitude: parseFloat(this.props.userLocation.latitude),
        longitude: parseFloat(this.props.userLocation.longitude)
      }
    };

    if (this.props.destinations.length > 0) {
      this.destinationsBound(boundaries)
    }

    let margin = 0.02;
    return L.latLngBounds(
        L.latLng(boundaries.max.latitude + margin,
            boundaries.min.longitude - margin),
        L.latLng(boundaries.min.latitude - margin,
            boundaries.max.longitude + margin));
  }

  destinationsBound(boundaries) {
    this.props.destinations.forEach((destination) => {
      Object.keys(boundaries).map((field) => {
        if (field === 'min') {
          boundaries[field] = {
            latitude: Math.max(boundaries[field].latitude,
                parseFloat(destination.latitude)),
            longitude: Math.max(boundaries[field].longitude,
                this.modifyLong(parseFloat(destination.longitude)))
          };
        } else {
          boundaries[field] = {
            latitude: Math.min(boundaries[field].latitude,
                parseFloat(destination.latitude)),
            longitude: Math.min(boundaries[field].longitude,
                this.modifyLong(parseFloat(destination.longitude)))
          };
        }
      })
    });
  }

  generateMarkerIcon() {
    // react-leaflet does not currently handle default marker icons correctly,
    // so we must create our own
    return L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow,
      iconAnchor: [12, 40]  // for proper placement
    })
  }
}