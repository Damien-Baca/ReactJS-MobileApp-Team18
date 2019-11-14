import React, {Component} from 'react';
import {Map, Marker, Polyline, Popup, TileLayer} from "react-leaflet";
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import {Button, Container, Row} from "reactstrap";

/*
 * Renders a Leaflet Map with Markers and a Polyline.
 */

export default class DestinationMap extends Component {
  constructor(props) {
    super(props);
    this.state={
      markerFlag: true,
      polylineFlag: true
    }
  }

  render() {
    return (this.renderLeafletMap());
  }

  renderLeafletMap() {
    return (
      <Container>
        <Map bounds={this.itineraryBounds()}
             style={{height: 500, maxwidth: 700}}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                     attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          {this.generateDestinationMarkers()}
          {this.renderPolyline()}
        </Map>
        <Row>
          {this.renderMarkerToggleButton()}
          {this.renderPolylineToggleButton()}
        </Row>
      </Container>
    )
  }

  renderMarkerToggleButton(){
    return(
              <Button
                  className='btn-csu w-10 text-left'
                  name='toggleAllMarkers'
                  key='button_toggleAllMarkers'
                  active={true}
                  onClick={() => this.handleMarkerToggle()}>
                Toggle All Markers
              </Button>
    )
  }
  renderPolylineToggleButton(){
    return(
          <Button
              className='btn-csu w-10 text-left'
              name='togglePolyline'
              key='button_togglePolyline'
              active={true}
              onClick={() => this.handlePolylineToggle()}>
            Toggle Polyline
          </Button>
    )
  }
  handleMarkerToggle() {
    //setstate for all markers
    this.setState({
      markerFlag: !this.state.markerFlag
    });

  }
  handlePolylineToggle() {
    //setstate for polylines
    this.setState({
      polylineFlag: !this.state.polylineFlag
    });
  }




  generateDestinationMarkers() {
    if(this.state.markerFlag) {
      let markerList = [this.props.userLocation];
      if (this.props.destinations.length > 0) {
        markerList = [];

        this.props.destinations.forEach((destination) => (
            markerList.push(Object.assign({}, destination))
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
  }

  renderPolyline() {
    if(this.state.polylineFlag) {
      let polylineList = [];

      if (this.props.destinations.length > 1) {
        let origin = [];
        polylineList.splice(0, 1);

        this.props.destinations.map((destination, index) => {
          if (index === 0) {
            origin = [parseFloat(destination.latitude),
              parseFloat(destination.longitude)];
          }
          polylineList.splice(polylineList.length, 0,
              [parseFloat(destination.latitude),
                parseFloat(destination.longitude)]);
          //} else {
          //  previous = [destination.latitude, destination.longitude];
          //}
        });

        polylineList.splice(polylineList.length, 0, origin);

        return (
            <Polyline
                color={'blue'}
                positions={polylineList}
            >Trip</Polyline>
        );
      }
    }
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
                parseFloat(destination.longitude))
          };
        } else {
          boundaries[field] = {
            latitude: Math.min(boundaries[field].latitude,
                parseFloat(destination.latitude)),
            longitude: Math.min(boundaries[field].longitude,
                parseFloat(destination.longitude))
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