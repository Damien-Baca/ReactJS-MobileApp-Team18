import React, { Component } from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  CardImg,
  CardTitle,
  CardText,
  Row, Col, Container
} from 'reactstrap';
import cabeleinPhoto from './images/crabeleinMongoose.jpg'
import dbacaPhoto from './images/dbaca.jpg'
import jamesl84Photo from './images/Jamesl84.jpg'
import longChenPhoto from './images/LongChen.jpg'
import hgqPhoto from './images/hqMongoose.jpg'

export default class About extends Component {
  render() {
    let team = [[cabeleinPhoto, "Christopher Abelein",
                  "Has a phsychological dependancy on writing out plans "
                  + "for projects. Mongoose. That's a cool team name."],
                [dbacaPhoto, "Damien Baca",
                  "a CS Senior with a Math Minor"],
                [jamesl84Photo, "James Lounsbury",
                  "A CS and Physics major"],
                [longChenPhoto, "Long Chen",
                  "a ME major."],
                [hgqPhoto, "Hayden Quintana",
                  "likes long walks on the beach and poking dead things "
                  + "with a stick"]
                ];

    return (
        this.generateCardGroups(team)
    );
  }

  generateCardGroups(team) {
    return (
        <Container>
          <Row>
            <Col xs="12" sm="12" md="6" lg="4" xl="3">
              {this.showCard(team[0][0], team[0][1], team[0][2])}
            </Col>
            <Col xs="12" sm="12" md="6" lg="4" xl="3">
              {this.showCard(team[1][0], team[1][1], team[1][2])}
            </Col>
            <Col xs="12" sm="12" md="6" lg="4" xl="3">
              {this.showCard(team[2][0], team[2][1], team[2][2])}
            </Col>
          </Row>
          <Row>
            <Col xs="12" sm="12" md="6" lg="4" xl="3">
              {this.showCard(team[3][0], team[3][1], team[3][2])}
            </Col>
            <Col xs="12" sm="12" md="6" lg="4" xl="3">
              {this.showCard(team[4][0], team[4][1], team[4][2])}
            </Col>
            <Col xs="12" sm="12" md="6" lg="4" xl="3">
            </Col>
          </Row>
        </Container>
    );
  }

  showCard(img, title, text) {
    return (
        <Card style={{ minWidth: '8rem' }}>
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