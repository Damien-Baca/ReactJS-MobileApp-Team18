import React, {Component} from 'react';
import {Container, Row, Col, ListGroup, ListGroupItem, Form, FormGroup, Label, Input, Button} from 'reactstrap';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import {Map, Marker, Popup, TileLayer} from 'react-leaflet';
import Pane from './Pane'

/*
 * Renders the home page.
 */
export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newDestination: {name: '', latitude: 0, longitude: 0}
    }
  }

  render() {
    return (
        <Container>
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
        <Map center={this.csuOvalGeographicCoordinates()} zoom={10}
             style={{height: 500, maxwidth: 700}}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                     attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          <Marker position={this.csuOvalGeographicCoordinates()}
                  icon={this.markerIcon()}>
            <Popup className="font-weight-extrabold">Colorado State
              University</Popup>
          </Marker>
        </Map>
    )
  }

  renderIntro() {
    return (
        <Pane header={'Bon Voyage!'}
              bodyJSX={this.renderAddDestination()}/>
    );
  }

  renderDestinations() {
    return (
        <Pane header={'Destinations:'}
              bodyJSX={this.renderDestinationList()}/>
    );
  }

  renderDestinationList() {
    return (
        <ListGroup>
          {this.renderList()}
        </ListGroup>
    );
  }

  renderList() {
    return (
        this.props.destinations.map((destination, index) => (
            <ListGroupItem key={'destination_' + index}>
              <Row>
                {destination.name}, {destination.latitude}, {destination.longitude}
              </Row>
              <Row>
                <Button className='btn-csu h-5 w-50 text-left'
                        size={'sm'}
                        key={"button_" + destination.name}
                        value='Remove'
                        active={false}
                        onClick={() => this.props.removeDestination(index)}
                >Remove</Button>
              </Row>
            </ListGroupItem>
        ))
    );
  }

  renderAddDestination() {
    return (
        <Form>
          <FormGroup>
            <Label for='add_name'>New Destination</Label>
            <Input type='text'
                   name='name'
                   id='add_name'
                   placeholder='Name'
                   onChange={(event) => this.updateNewDestinationOnChange(event)}/>
            <Input type='text'
                   name='latitude'
                   id='add_latitude'
                   placeholder='Latitude'
                   onChange={(event) => this.updateNewDestinationOnChange(event)}/>
            <Input type='text'
                   name='longitude'
                   id='add_longitude'
                   placeholder='Longitude'
                   onChange={(event) => this.updateNewDestinationOnChange(event)}/>
            <Button
                className='btn-csu w-100 text-left'
                key={"button_add"}
                active={true}
                value={this.state.newDestination}
                onClick={() => this.props.addDestination(Object.assign({}, this.state.newDestination))}>
              Add
            </Button>
          </FormGroup>
        </Form>
    );
  }

  updateNewDestinationOnChange(event) {
    this.state.newDestination[event.target.name] = event.target.value;
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
