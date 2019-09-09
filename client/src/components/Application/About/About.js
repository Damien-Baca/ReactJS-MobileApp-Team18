import React, { Component } from 'react'
import {CardGroup, Card, CardHeader, CardBody, CardImg, CardTitle, CardText} from 'reactstrap';
import cabeleinPhoto from './images/crabeleinSized.jpg'

export default class About extends Component {
      render() {
            return (
              <CardGroup>
                {this.showCabelein()}
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
}