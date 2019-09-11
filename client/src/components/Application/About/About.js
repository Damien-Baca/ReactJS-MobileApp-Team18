import React, { Component } from 'react'
import {CardGroup, Card, CardHeader, CardBody, CardImg, CardTitle, CardText} from 'reactstrap';
import cabeleinPhoto from './images/crabelein.jpg'
import dbacaPhoto from './images/dbaca.jpg'
import jamesl84Photo from './images/Jamesl84.jpg'
import longChenPhoto from './images/LongChen.jpg'
import hgqPhoto from './images/hqMongoose.jpg'

export default class About extends Component {
  render() {
    return (
      <CardGroup>
        {this.showCard(cabeleinPhoto, "Christopher Abelein",
            "a CS senior.")}
        {this.showCard(dbacaPhoto, "Damien Baca",
            "a CS Senior with a Math Minor")}
        {this.showCard(jamesl84Photo, "James Lounsbury",
            "A CS and Physics major")}
        {this.showCard(longChenPhoto, "Long Chen",
            "a ME major.")}
        {this.showCard(hgqPhoto, "Hayden Quintana",
        "likes long walks on the beach and poking dead things with a stick")}
      </CardGroup>
    );
  }

  showCard(img, title, text) {
    return (
        <Card>
          <CardHeader>
            <CardImg top src={img}/>
          </CardHeader>
          <CardBody>
            <CardTitle><b>{title}</b></CardTitle>
            <CardText>{text}</CardText>
          </CardBody>
        </Card>
    );
  }
}

