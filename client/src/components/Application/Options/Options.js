import React, {Component} from 'react'
import {Container, Row, Col} from 'reactstrap'
import Pane from '../Pane';
import SelectOption from "./SelectOption";

/* Options allows the user to change the parameters for planning
 * and rendering the trip map and itinerary.
 * The options reside in the parent object so they may be shared with the Distance object.
 * Allows the user to set the options used by the application via a set of buttons.
 */
export default class Options extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <Container>
          <Row>
            <Col xs="12">
              {this.heading()}
            </Col>
          </Row>
          <Row>
            {this.generateOptions()}
          </Row>
        </Container>
    )
  }

  generateOptions() {
    let optionSets = [[Object.keys(this.props.options.units),
      this.props.options.activeUnit, 'activeUnit'],
      [this.props.options.formats, this.props.options.activeFileFormat,
        'activeFileFormat'],
      [this.props.options.optimizations, this.props.options.activeOptimization,
        'activeOptimization']];

    return (
        optionSets.map((options) => (
        <Col>
          <SelectOption units={options[0]}
                        activeOption={options[1]}
                        activeOptionString={options[2]}
                        updateOption={this.props.updateOption}/>
        </Col>
    )));
  }

  heading() {
    return (
        <Pane header={'Options'}
              bodyJSX={'Select ...'}/>
    );
  }

}
