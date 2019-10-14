import React, {Component} from 'react'
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
    this.state = {
      team: {
        "Christopher Ablein": {
          img: cabeleinPhoto,
          text: "Has a psychological dependency on writing out plans "
              + "for projects. The Fighting Mongooses. That's a cool team name."
        },
        "Damien Baca": {
          img: dbacaPhoto,
          text: "a CS Senior with a Math Minor"
        },
        "James Lounsbury": {
          img: jamesl84Photo,
          text: "A CS and Physics major"
        },
        "Long Chen": {
          img: longChenPhoto,
          text: "a ME major."
        },
        "Hayden Quintana": {
          img: hgqPhoto,
          text: "likes long walks on the beach and poking dead things "
              + "with a stick"
        }
      }
    };


    return (
        this.generateCardGroups()
    );
  }

  generateCardGroups() {
    let showTeam = [Object.assign([], Object.keys(this.state.team))];
    if (showTeam[0].length > 3) {
      showTeam.pop();
      let currentIndex = -1;

      Object.assign([], Object.keys(this.state.team).forEach((member, index) => {
        if (index % 3 === 0) {
          showTeam.push([]);
          currentIndex += 1;
        }

        showTeam[currentIndex].push(member);
      }));
    }

    console.log(showTeam);
    console.log(showTeam.length);

    return (
        <Container>
            {showTeam.forEach((threeMembers) => {
              this.showThreeCards(threeMembers)
            })}
        </Container>
    );
  }

  showThreeCards(threeMembers) {
    return (
        <Row>
          {threeMembers.forEach((member) => {
            this.showCard(member);
          })}
        </Row>
    );
  }

  showCard(member) {
    console.log(member);
    return (
        <Col xs="12" sm="12" md="6" lg="4" xl="3">
          <Card style={{minWidth: '8rem'}}>
            <CardHeader>
              <CardImg top src={this.state.team[member].img}/>
            </CardHeader>
            <CardBody>
              <CardTitle><b>{member}</b></CardTitle>
              <CardText>{this.state.team[member].text}</CardText>
            </CardBody>
          </Card>
        </Col>
    );
  }
}