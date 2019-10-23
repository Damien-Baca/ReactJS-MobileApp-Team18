import React, {Component} from 'react'
import {Container, Row, Col} from 'reactstrap'
import Pane from '../Pane';
import Units from './Units';
import ExportFileFormat from './ExportFileFormat';
import Optimizations from "./Optimizations";

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
            <Col>
              <Units units={this.props.options.units}
                     activeUnit={this.props.options.activeUnit}
                     updateOption={this.props.updateOption}/>
            </Col>
            
            <Col>
              <ExportFileFormat formats={this.props.options.formats}
                                activeFileFormat={this.props.options.activeFileFormat}
                                updateOption={this.props.updateOption}/>
            </Col>

            <Col>
              <Optimizations optimizations={this.props.options.optimizations}
                             activeOptimization={this.props.options.activeOptimization}
                             updateOption={this.props.updateOption}/>
            </Col>
          </Row>
        </Container>
    )
  }

  heading() {
    return (
        <Pane header={'Options'}
              bodyJSX={'Select ...'}/>
    );
  }

}
