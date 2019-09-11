import React, { Component } from 'react'
import {CardGroup, Card, CardHeader, CardBody, CardImg, CardTitle, CardText} from 'reactstrap';
import cabeleinPhoto from './images/crabelein.jpg'
import dbacaPhoto from './images/dbaca.jpg'
import Jamesl84Photo from './images/Jamesl84.jpg'
import LongChenPhoto from './images/LongChen.jpg'

export default class About extends Component {
  render() {
    return (
      <CardGroup>
        {this.showCabelein()}
        {this.showDbaca()}
        {this.showjamesl84()}
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

  showjamesl84() {
    return (
      <Card>
        <CardHeader>
          <CardImg top src={Jamesl84Photo}/>
        </CardHeader>
        <CardBody>
          <CardTitle><b>James Lounsbury</b></CardTitle>
          <CardText>a CS and Physics major.</CardText>
        </CardBody>
      </Card>
    );
  }
    showLongChen() {
        return (
            <Card>
            <CardHeader>
            <CardImg top src={LongChenPhoto}/>
        </CardHeader>
        <CardBody>
        <CardTitle><b>Long Chen</b></CardTitle>
        <CardText>a ME major.</CardText>
        </CardBody>
        </Card>
    );
    }
}

