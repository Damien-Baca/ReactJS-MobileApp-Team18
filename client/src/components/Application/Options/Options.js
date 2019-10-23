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
            {this.renderUnits()}
            {this.renderFormats()}
            {this.renderOptimizations()}
          </Row>
        </Container>
    )
  }

  renderUnits() {
    return (
        <Col>
          <SelectOption units={Object.keys(this.props.options.units)}
                        activeOption={this.props.options.activeUnit}
                        activeOptionString={'activeUnit'}
                        updateOption={this.props.updateOption}/>
        </Col>
    );
  }

  renderFormats() {
    return (
        <Col>
          <SelectOption units={this.props.options.formats}
                        activeOption={this.props.options.activeFileFormat}
                        activeOptionString={'activeFileFormat'}
                        updateOption={this.props.updateOption}/>
        </Col>
    );
  }

  renderOptimizations() {
    return (
        <Col>
          <SelectOption  units={this.props.options.optimizations}
                         activeOption={this.props.options.activeOptimization}
                         activeOptionString={'activeOptimization'}
                         updateOption={this.props.updateOption}/>
        </Col>
    );
  }

  heading() {
    return (
        <Pane header={'Options'}
              bodyJSX={'Select ...'}/>
    );
  }

}
