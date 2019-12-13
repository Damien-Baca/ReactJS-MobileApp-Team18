import React, {Component} from 'react';
import {Button, Container, Form, FormGroup, Input, Label, Row} from "reactstrap";
import worldMapBackground from './worldmap.js';



export default class DestinationControls extends Component {
  constructor (props) {
    super(props);

    this.state = {
      newDestination: { name: '', latitude: '', longitude: ''},
      valid: { name: false, latitude: false, longitude: false  },
      invalid: { name: false, latitude: false, longitude: false },
      fileContents: null,

    };
  }

  render () {
    return (
      <Container>
        <Row>
          {this.renderConditionalCumulativeDistance()}
        </Row>
        <Row>
          {this.renderAddDestination()}
        </Row>
        <Row>
          {this.renderSaveKML()}
        </Row>
        <Row>
          {this.renderSaveSVG()}
        </Row>
        <Row style={{ display: "flex" }}>
          {this.renderCalculateDistances()}
          {this.renderOptimizeDistances()}

        </Row>

      </Container>
    );
  }

  renderConditionalCumulativeDistance () {
    if (this.props.distances !== null) {
      return (
        <Label>Cumulative Trip
          Distance: {this.props.sumDistances()}</Label>
      );
    }

    return (
      <Label>Trip distance not yet calculated.</Label>
    );
  }

  renderAddDestination () {
    return (
      <Form>
        <FormGroup>
          <Label for='add_name'>New Destination</Label>
          {this.generateCoordinateInput()}
          {this.renderAddDestinationButton()}
          {this.renderAddUserDestinationButton()}
          {this.renderJSONInput()}
          {this.renderAddJSONButton()}
          {this.renderExportFileButton()}
        </FormGroup>
      </Form>
    );
  }

  renderExportFileButton () {
    return (
      <Button
        className='btn-csu w-100 text-left'
        name='exportFile'
        key='button_exportFile'
        active={true}
        onClick={() => this.props.handleExportFile()}>
        Export Trip to File
      </Button>
    );
  }

  renderCalculateDistances () {
    return (
      <Button
        className='btn-csu'
        name='calculate'
        style={{ marginLeft: 'auto' }}
        onClick={() => this.props.calculateDistances('none')}
        disabled={this.props.destinations.length === 0}
        active={true}
      >Calculate Trip Distances</Button>
    );
  }

  renderOptimizeDistances () {
    return (
      <Button
        className='btn-csu'
        name='optimize'
        style={{ marginLeft: 'auto' }}
        onClick={() => this.props.calculateDistances(
          this.props.optimization)}
        disabled={this.props.destinations.length === 0 ||
        this.props.optimization === 'none'}
        active={true}
      >Optimize Trip Distances</Button>
    );
  }

  renderSaveKML(){
    return(
      <Button className='btn-csu h-5 w-10'
              name="save_kml"
              size={{ marginLeft: 'auto' }}
              value='MKL'
              active={true}
              onClick={() => this.kmlWrite()}
      >Save KML</Button>
    );
  }

  renderSaveSVG(){
    return(
      <Button className='btn-csu h-5 w-10'
              name="save_SVG"
              size={{ marginLeft: 'auto' }}
              value='MKL'
              active={true}
              onClick={() => this.saveSVG()}
      >Save SVG</Button>
    );
  }

  renderAddDestinationButton () {
    return (
      <Button
        className='btn-csu w-100 text-left'
        name='add_new_destination'
        key='button_add_destination'
        active={true}
        onClick={() => this.handleNewDestination()}
        disabled={!(this.state.valid.latitude && this.state.valid.longitude)
        || (this.state.newDestination.name === '')}
      >Add New Destination</Button>
    );
  }

  renderAddUserDestinationButton () {
    return (
      <Button
        className='btn-csu w-100 text-left'
        name='add_user_destination'
        key='button_add_user_destination'
        active={true}
        onClick={() => this.handleUserDestination()}>
        Add User Location
      </Button>
    );
  }

  renderJSONInput () {
    return (
      <Input type='file'
             id='fileItem'
             key='input_json_file'
             name='json_file'
             onChange={event => this.onFileChange(event)}/>
    );
  }

  renderAddJSONButton () {
    return (
      <Button
        className='btn-csu w-100 text-left'
        name='loadJSON'
        key='button_loadJSON'
        active={true}
        disabled={this.state.fileContents === null}
        onClick={() => this.props.handleLoadJSON(this.state.fileContents)}>
        Import JSON
      </Button>
    );
  }

  generateCoordinateInput () {
    return (Object.keys(this.state.newDestination).map((field) => (
      <Input type='text'
             key={'input_' + field}
             name={field}
             id={`add_${field}`}
             placeholder={field.charAt(0).toUpperCase() + field.substring(1,
               field.length)}
             value={this.state.newDestination[field]}
             valid={this.state.valid[field]} //THIS.STATE.VALID[FIELD]
             invalid={this.state.invalid[field]}
             onChange={(event) => this.updateNewDestinationOnChange(event)}/>
    )));
  }

  updateNewDestinationOnChange (event) {
    if (event.target.value === '' || event.target.name === 'name') { //empty or field is name
      this.setValidState(event.target.name, event.target.value, false, false);
    } else if (this.props.validation(event.target.name, event.target.value)) { //if coord is good
      this.setValidState(event.target.name, event.target.value, true, false);
    } else { //bad coord
      this.setValidState(event.target.name, event.target.value, false, true);
    }
  }

  handleNewDestination () {
    if (this.props.validation(this.state.newDestination.latitude, this.state.newDestination.longitude)) {
      this.props.addDestinations([Object.assign({}, this.state.newDestination)]);
      let superFalse = { latitude: false, longitude: false };
      this.setState({
        newDestination: { name: '', latitude: '', longitude: '' },
        valid: superFalse,
        invalid: superFalse,

      });
      this.props.resetDistances();
    } else {
      this.props.setErrorBanner(this.props.createErrorBanner(
        'Invalid Coordinates',
        "400",
        'Invalid Cardinal Coordinates')
      )
    }
  }

  handleUserDestination () {
    this.props.addDestinations([Object.assign({}, this.props.userLocation)]);
    this.props.resetDistances();
  }

  setValidState (name, value, valid, invalid) {
    let update = Object.assign({}, this.state.newDestination);
    update[name] = value;
    let cloneValid = Object.assign({}, this.state.valid);
    cloneValid[name] = valid;
    let cloneInvalid = Object.assign({}, this.state.invalid);
    cloneInvalid[name] = invalid;
    this.setState({
      newDestination: update,
      valid: cloneValid,
      invalid: cloneInvalid
    });
  }

  onFileChange (event) {
    let callback = (string) => {
      this.setState({ fileContents: string });
    };
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

  kmlWrite () {
    let file = " ";
    var header = "<?xml version=" + "\"1.0\"" + " encoding=" + "\"UTF-8\"" + "?> \n\
<kml xmlns=\"http://www.opengis.net/kml/2.2\">\n";

    var body = "<Document>\n\
\
"
    var list="";
    var endOflist='';
    if (typeof this.props.destinations.altitude==='undefined'){

      for (var i = 0; i < this.props.destinations.length; i++) {
        var name='';
        name=this.props.destinations[i].name;
        if ( name.includes('&')){
          name= name.replace(/&/g,'&amp;');
        }
        if ( name.includes('\'')){
          name= name.replace('\'','&apos;');
        }
        body = body.concat("\t<Placemark>\n\
   \t\t<name>" + name+"</name>\n\
  \t\t<Point>\n\
  \t\t\t<coordinates>"+"\n\t\t\t" +this.props.destinations[i].longitude + "," + this.props.destinations[i].latitude + ","+0 + "\n\t\t\t</coordinates>\n\
  \t\t</Point>\n\
  \t</Placemark>\n\
  ");
        list=list.concat( "\n\t\t\t"+this.props.destinations[i].longitude + "," + this.props.destinations[i].latitude + ","+0 )
        endOflist="\n\t\t\t"+this.props.destinations[0].longitude + "," + this.props.destinations[0].latitude + ","+0
      }
    }
    else{
      for (var i = 0; i < this.props.destinations.length; i++) {
        var name='';
        name=this.props.destinations[i].name;
        if ( name.includes('&')){
          name= name.replace(/&/g,'&amp;');
        }
        if ( name.includes('\'')){
          name= name.replace('\'','&apos;');
        }
        body = body.concat("\t<Placemark>\n\
   \t\t<name>" + name+"</name>\n\
  \t\t<Point>\n\
  \t\t\t<coordinates>"+"\n\t\t\t" +this.props.destinations[i].longitude + "," + this.props.destinations[i].latitude + ","+this.props.destinations[i].altitude + "\n\t\t\t</coordinates>\n\
  \t\t</Point>\n\
  \t</Placemark>\n\
  ");
      list=list.concat( "\n\t\t\t"+this.props.destinations[i].longitude + "," + this.props.destinations[i].latitude + ","+this.props.destinations[i].altitude )
       endOflist="\n\t\t\t"+this.props.destinations[0].longitude + "," + this.props.destinations[0].latitude + ","+this.props.destinations[0].altitude
      }}

    var footer = "\
\t<Placemark>\n\
\t\t<name>trip lines</name>\n\
\t\t<LineString>\n\
\t\t\t<coordinates>" + list+ endOflist+"\n\t\t\t</coordinates>\n\
\t\t</LineString>\n\
\t</Placemark>\n\
</Document>\n" + "</kml>";

    file = header + body + footer;

    var data = new Blob([file], { type: 'text/plain' });
    var URL = window.URL.createObjectURL(data);
    var tempLink = document.createElement('a');
    tempLink.href = URL;
    tempLink.setAttribute('download', 'Trip.kml');
    tempLink.click();
  }

  saveSVG(){
    let file="";
    var coords=[];
    if(this.props.destinations.length>1){
      coords=this.props.CreatePolylineList();
    }
    let polyLines="";
    coords.forEach((line) => {
       polyLines=polyLines.concat(
        "<polyline points=\"" + line + "\"\n" +
        "style=\"fill:none;stroke:#5d00ff;stoke-width:.1;\"/>\n");
    })
    file=worldMapBackground+"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100%\" height=\"100% \" viewBox=\"-90 -90 180 180\">\n" +
      "<g transform=\"rotate(270)\">\n" +polyLines+"</g>\n" + "</svg></svg>";
    var data = new Blob([file], { type: 'image/svg+xml' });
    var URL = window.URL.createObjectURL(data);
    var tempLink = document.createElement('a');
    tempLink.href = URL;
    tempLink.setAttribute('download', 'MyTrip.SVG');
    tempLink.click();
  }
}








