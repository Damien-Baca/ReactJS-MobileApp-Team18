import React, {Component} from 'react';
import {Map, Marker, Polyline, Popup, TileLayer} from "react-leaflet";
import icon from 'leaflet/dist/images/marker-icon.png';
import icon2 from 'leaflet/dist/images/marker-icon-2x.png';
import iconY from './About/images/marker-iconY.png';
import icon2Y from './About/images/marker-icon-2xY.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import {Button, Container, Row} from "reactstrap";

/*
 * Renders a Leaflet Map with Markers and a Polyline.
 */

export default class DestinationMap extends Component {
  constructor(props) {
    super(props);
    this.state={
      markerFlag: false,
      polylineFlag: true,
      iconColor: false,
      prevInd: -1,
      markerSize: []
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
          {this.renderIconColorButton()}
        </Row>
      </Container>
    )
  }
  renderIconColorButton() {
    return(
        <Button
            className='btn-csu w-10 text-left'
            name='toggleIconColors'
            key='button_toggleIconColors'
            active={true}
            onClick={() => this.handleColorToggle()}>
          Toggle Icon Colors
        </Button>
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
  handleColorToggle() {
    this.setState({
      iconColor: !this.state.iconColor
    });
  }



  generateDestinationMarkers() {
    if(this.state.markerFlag) {
      this.markerSize = [];
      let markerList = [this.props.userLocation];
      if (this.props.destinations.length > 0) {
        markerList = [];

      this.props.destinations.forEach((destination) => {
        this.markerSize.push(false);
        markerList.push(Object.assign({}, {
          latitude: destination.latitude,
          name: destination.name,
          longitude: this.modifyLong(destination.longitude)
        }))
      });
    }

      return (
          markerList.map((marker, index) => (
              <Marker
                  key={`marker_${index}`}
                  position={L.latLng(marker.latitude, marker.longitude)}
                  onClick={ () => {
                    let inv = Object.assign( [], this.markerSize);
                    if(index !== this.state.prevInd){
                      inv[index] = !inv[index];
                      this.state.prevInd = index;
                    } else {
                      this.state.prevInd = -1;
                    }
                    this.setState( {markerSize: inv}) }
                  }
                  icon={this.generateMarkerIcon(index)}>
                < Popup
                    className="font-weight-extrabold">{marker.name+'\n'+marker.latitude+' '+marker.longitude}</Popup>
              </Marker>
          ))
      );
    }
  }


  renderPolyline() {
    if(this.state.polylineFlag){
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
        polylineList=polylineList.concat(this.addOtherEarthsPolyline(polylineList));
      }
      return (
          polylineList.map((line) => (
              <Polyline
                  color={'blue'}
                  positions={line}
              />
          ))
      );
    }
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

  addOtherEarthsPolyline(polylineList){
    let newLines=[];
    polylineList.forEach((polyline) => {
      let tempLine=[[polyline[0][0],polyline[0][1]+360],[polyline[1][0],polyline[1][1]+360]];
      newLines.push(tempLine);
      tempLine=[[polyline[0][0],polyline[0][1]-360],[polyline[1][0],polyline[1][1]-360]];
      newLines.push(tempLine);
    });
    return newLines
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
    let maxLat=boundaries.max.latitude + margin;
    let minLat=boundaries.min.latitude - margin;
    let maxLong=boundaries.max.longitude + margin;
    let minLong=boundaries.min.longitude - margin;
    if(maxLong<-140 && Math.abs(maxLong-minLong)>180){maxLong=-110;}
    if(minLong>140 && Math.abs(maxLong-minLong)>180){minLong=110;}
    return L.latLngBounds(
        L.latLng(maxLat, minLong),
        L.latLng(minLat, maxLong));
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


  generateMarkerIcon(index) {
    // react-leaflet does not currently handle default marker icons correctly,
    // so we must create our own
    //lol kill me
    if (!this.state.markerSize[index] && !this.state.iconColor) {
      return L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
        iconAnchor: [12, 40]  // for proper placement
      })
    } else if(this.state.markerSize[index] && !this.state.iconColor) {
      return L.icon({
        iconUrl: icon2,
        shadowUrl: iconShadow,
        iconAnchor: [26, 80]  // for proper placement
      })
    } else if (!this.state.markerSize[index] && this.state.iconColor) {
      return L.icon({
        iconUrl: iconY,
        shadowUrl: iconShadow,
        iconAnchor: [12, 40]  // for proper placement
      })
    } else  {
      return L.icon({
        iconUrl: icon2Y,
        shadowUrl: iconShadow,
        iconAnchor: [26, 80]  // for proper placement
      })
    }
  }

}