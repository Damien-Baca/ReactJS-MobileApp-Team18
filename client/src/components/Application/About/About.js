import React, { Component } from 'react'
import {CardGroup, Card, CardHeader, CardBody, CardImg, CardTitle, CardText} from 'reactstrap';
import cabeleinPhoto from './images/crabelein.jpg'
import dbacaPhoto from './images/dbaca.jpg'

export default class About extends Component {
  render() {
    return (
      <CardGroup>
        {this.showCabelein()}
        {this.showDbaca()}
      </CardGroup>
    );
  }

  showCabelein() {
    return (
      <Card>
        <CardHeader>
          <CardImg top src={cabeleinPhoto}/>
        </CardHeader>
        <CardBody>
          <CardTitle><b>Christopher Abelein</b></CardTitle>
          <CardText>a CS Senior.</CardText>
        </CardBody>
      </Card>
    );
  }

  showDbaca() {
      return (
          <Card>
              <CardHeader>
                  <CardImg top src={dbacaPhoto}/>
              </CardHeader>
              <CardBody>
                  <CardTitle><b>Damien Baca</b></CardTitle>
                  <CardText>a CS Senior with a Math Minor</CardText>
              </CardBody>
          </Card>
      );
  }
}