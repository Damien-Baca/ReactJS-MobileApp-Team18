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
              {this.renderOptimizationButtons(Object.assign([], this.props.options.optimizations))}
            </ButtonGroup>
          </CardBody>
        </Card>
    );
  }

  renderOptimizationButtons(opts) {
    return opts.map((optimization) =>
        <Button
            className='w-100 text-left'
            variant='success'
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
