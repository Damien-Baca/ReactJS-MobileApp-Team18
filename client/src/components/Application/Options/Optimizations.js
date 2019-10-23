import React, {Component} from 'react'
import {Card, CardHeader, CardBody} from 'reactstrap'
import {Button, ButtonGroup} from 'reactstrap'

export default class Optimizations extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
        <Card className='text-center'>
          <CardHeader
              className='bg-csu-gold text-white font-weight-semibold'>Units</CardHeader>
          <CardBody>
            <ButtonGroup vertical className='w100'>
              {this.renderUnitButtons(Object.keys(this.props.options.optimizations))}
            </ButtonGroup>
          </CardBody>
        </Card>
    );
  }

  renderUnitButtons(names) {
    return names.sort().map((optimization) =>
        <Button
            className='btn-csu w-100 text-left'
            key={"button_" + optimization}
            active={this.props.activeOptimization === optimization}
            value={optimization}
            onClick={(event) => this.props.updateOption('activeOptimization',
                event.target.value)}
        >
          {optimization.charAt(0).toUpperCase() + optimization.slice(1)}
        </Button>
    );
  }
}
