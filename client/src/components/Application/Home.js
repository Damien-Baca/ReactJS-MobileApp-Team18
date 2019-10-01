import React, {Component} from 'react';
import {Container, Row, Col, ListGroup, ListGroupItem, Form, FormGroup, Label, Input, Button} from 'reactstrap';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import {Map, Marker, Polyline, Popup, TileLayer} from 'react-leaflet';
import Pane from './Pane'
import {sendServerRequestWithBody} from '../../api/restfulAPI'

/*
 * Renders the home page.
 */
export default class Home extends Component {
  constructor(props) {
    super(props);

    this.onFileChange = this.onFileChange.bind(this);
    this.fileCallback = this.fileCallback.bind(this);
    this.storeUserLocation = this.storeUserLocation.bind(this);

    this.fileContents = "";

    this.state = {
      errorMessage: null,
      userLocation: {
        name: 'Colorado State University',
        latitude: this.csuOvalGeographicCoordinates().lat,
        longitude: this.csuOvalGeographicCoordinates().lng
      },
      newDestination: {name: '', latitude: '', longitude: ''},
      cumulativeDistance: null,
      distances: null,
      optimizations: null,
      mapBoundaries: {
        maxLat: this.csuOvalGeographicCoordinates().lat + 0.5,
        minLat: this.csuOvalGeographicCoordinates().lat - 0.5,
        maxLon: this.csuOvalGeographicCoordinates().lng + 0.5,
        minLon: this.csuOvalGeographicCoordinates().lng - 0.5
      }
    };

    this.getUserLocation();
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((this.storeUserLocation));
    } else {
    }
  }

  storeUserLocation(position) {
    let newUserLocation = {
      name: 'You Are Here',
      latitude: String(position.coords.latitude),
      longitude: String(position.coords.longitude)
    };

    this.setState({
      userLocation: newUserLocation
    })
  }

  render() {
    return (
        <Container>
          {this.state.errorMessage}
          <Row>
            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
              {this.renderMap()}
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
              {this.renderIntro()}
              {this.renderDestinations()}
            </Col>
          </Row>
        </Container>
    );
  }

  renderMap() {
    return (
        <Pane header={'Where Am I?'}
              bodyJSX={this.renderLeafletMap()}/>
    );
  }

  renderLeafletMap() {
    // initial map placement can use either of these approaches:
    // 1: bounds={this.coloradoGeographicBoundaries()}
    // 2: center={this.csuOvalGeographicCoordinates()} zoom={10}
    return (
        <Map bounds={this.itineraryBounds()}
             style={{height: 500, maxwidth: 700}}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                     attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          {this.renderMarkers()}
          {this.renderPolyline()}
        </Map>
    )
  }

  renderMarkers() {
    let markerList = [Object.assign({}, this.state.userLocation)];

    if (this.props.destinations.length > 0) {
      markerList = Object.assign([], this.props.destinations);
    }

    return (
        markerList.map((marker, index) => (
            <Marker
                key={`marker_${index}`}
                position={L.latLng(marker.latitude, marker.longitude)}
                icon={this.markerIcon()}>
              < Popup
                  className="font-weight-extrabold">{marker.name}</Popup>
            </Marker>
        ))
    );
  }

  renderPolyline() {
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

  renderIntro() {
    return (
        <Pane header={'Bon Voyage!'}
              bodyJSX={this.renderDestinationControls()}/>
    );
  }

  renderDestinations() {
    return (
        <Pane header={'Destinations:'}
              bodyJSX={this.renderDestinationList()}/>
    );
  }

  renderDestinationControls() {
    return (
        <Container>
          <Row>
            {this.renderConditionalCumulativeDistance()}
          </Row>
          <Row>
            {this.renderAddDestination()}
          </Row>
          <Row>
            {this.renderDestinationOptions()}
          </Row>
        </Container>
    );
  }

  renderConditionalCumulativeDistance() {
    if (this.state.cumulativeDistance !== null) {
      return (
          <Label>Cumulative Trip
            Distance: {this.state.cumulativeDistance}</Label>
      );
    }

    return (
        <Label>Distance not yet calculated.</Label>
    );
  }

  renderDestinationList() {
    return (
        <ListGroup>
          {this.renderClearDestinations()}
          {this.renderList()}
        </ListGroup>
    );
  }

  renderDestinationOptions() {
    return (
        <Button
            name='calculate'
            onClick={() => this.calculateDistances()}
        >Calculate Trip Distances</Button>
    );
  }

  renderClearDestinations() {
    return (
        <ListGroupItem>
          <Button className='btn-csu h-5 w-100 text-left'
                  size={'sm'}
                  name='clear_destinations'
                  key={"button_clear_all_destinations"}
                  value='Clear Destinations'
                  active={false}
                  onClick={() => this.props.clearDestinations()}
          >Clear Destinations</Button>
        </ListGroupItem>
    );
  }

  renderList() {
    return (
        this.props.destinations.map((destination, index) => (
            <ListGroupItem key={'destination_' + index}>
              <Row>
                {destination.name}, {destination.latitude}, {destination.longitude}
              </Row>
              {this.renderConditionalDistance(index)}
              <Row>
                <Button className='btn-csu h-5 w-50 text-left'
                        size={'sm'}
                        name={'remove_' + index}
                        key={"button_" + destination.name}
                        value='Remove Destination'
                        active={false}
                        onClick={() => this.props.removeDestination(index)}
                >Remove</Button>
              </Row>
            </ListGroupItem>
        ))
    );
  }

  renderConditionalDistance(index) {
    if (this.state.distances !== null) {
      return (
          <Row>
            Distance to Next Destination: {this.state.distances[index]}
          </Row>
      );
    }
    return (
        <Row>
          Distances not yet calculated.
        </Row>
    )
  }

  renderAddDestination() {
    return (
        <Form>
          <FormGroup>
            <Label for='add_name'>New Destination</Label>
            {this.generateCoordinateInput()}
            <Button
                className='btn-csu w-100 text-left'
                name='add_new_destination'
                key='button_add_destination'
                active={true}
                onClick={() => this.handleNewDestination()}>
              Add New Destination
            </Button>
            <Button
                className='btn-csu w-100 text-left'
                name='add_user_destination'
                key='button_add_user_destination'
                active={true}
                onClick={() => this.handleUserDestination()}>
              Add User Location
            </Button>
            <Input type='file'
                   id='fileItem'
                   key='input_json_file'
                   name='json_file'
                   onChange={event => this.onFileChange(event)}/>
          </FormGroup>
        </Form>
    );
  }

  fileCallback(string) {
    this.fileContents = string;
  }

  onFileChange(event) {
    let callback = this.fileCallback;
    let fileIn = event.target;
    if (fileIn) {
      let file = fileIn.files[0];
      let reader = new FileReader();

      reader.onloadend = function () {
        callback(this.result);
      };

      reader.readAsText(file);
    }
  }

  generateCoordinateInput() {
    return (Object.keys(this.state.newDestination).map((field) => (
        <Input type='text'
               key={'input_' + field}
               name={field}
               id={`add_${field}`}
               placeholder={field.charAt(0).toUpperCase() + field.substring(1,
                   field.length)}
               value={this.state.newDestination[field]}
               onChange={(event) => this.updateNewDestinationOnChange(event)}/>
    )));
  }

  handleNewDestination() {
    this.props.addDestination(Object.assign({}, this.state.newDestination));
    this.setState({
      newDestination: {name: '', latitude: '', longitude: ''}
    });
  }

  handleUserDestination() {
    this.props.addDestination(Object.assign({}, this.state.userLocation));
  }

  updateNewDestinationOnChange(event) {
    let update = Object.assign({}, this.state.newDestination);
    update[event.target.name] = event.target.value;

    this.setState({
      newDestination: update
    });
  }

  calculateDistances() {
    const tipConfigRequest = {
      'type': 'trip',
      'version': 2,
      'options': {
        'title': 'My Trip',
        'earthRadius': String(
            this.props.options.units[this.props.options.activeUnit]),
        'optimization': 'none'
      },
      'places': this.props.destinations,
      'distances': []
    };

    sendServerRequestWithBody('trip', tipConfigRequest,
        this.props.settings.serverPort).then((response) => {
      if (response.statusCode >= 200 && response.statusCode <= 299) {
        const reducer = (sum, current) => {
          return sum + current;
        };

        this.setState({
          cumulativeDistance: Object.assign([], response.body.distances).reduce(
              reducer),
          distances: Object.assign([], response.body.distances),
          errorMessage: null
        });
      } else {
        this.setState({
          errorMessage: this.props.createErrorBanner(
              response.statusText,
              response.statusCode,
              `Request to ${this.props.settings.serverPort} failed.`
          )
        });
      }
    });
  }

  itineraryBounds() {
    let boundaries = {
      maxLat: parseFloat(this.state.userLocation.latitude) + 0.1,
      minLat: parseFloat(this.state.userLocation.latitude) - 0.1,
      maxLng: parseFloat(this.state.userLocation.longitude) + 0.1,
      minLng: parseFloat(this.state.userLocation.longitude) - 0.1
    };

    if (this.props.destinations.length > 0) {
      Object.keys(boundaries).map((field) => {
        if (field === 'maxLat' || field === 'maxLng') {
          boundaries[field] = -181;
        } else {
          boundaries[field] = 181;
        }
      });

      this.props.destinations.forEach((destination) => {
        if (destination.latitude > boundaries.maxLat) {
          boundaries.maxLat =  parseFloat(destination.latitude) + 0.1;
        }
        if (destination.latitude < boundaries.minLat) {
          boundaries.minLat = parseFloat(destination.latitude) - 0.1;
        }
        if (destination.longitude > boundaries.maxLng) {
          boundaries.maxLng = parseFloat(destination.longitude) + 0.1;
        }
        if (destination.longitude < boundaries.minLng) {
          boundaries.minLng = parseFloat(destination.longitude) - 0.1;
        }
      });
    }

    const topLeftBound = L.latLng(boundaries.maxLat, boundaries.minLng);
    const bottomRightBound = L.latLng(boundaries.minLat, boundaries.maxLng);

    return L.latLngBounds(topLeftBound, bottomRightBound);
  }

  coloradoGeographicBoundaries() {
    // northwest and southeast corners of the state of Colorado
    return L.latLngBounds(L.latLng(41, -109), L.latLng(37, -102));
  }

  csuOvalGeographicCoordinates() {
    return L.latLng(40.576179, -105.080773);
  }

  markerIcon() {
    // react-leaflet does not currently handle default marker icons correctly,
    // so we must create our own
    return L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow,
      iconAnchor: [12, 40]  // for proper placement
    })
  }
}