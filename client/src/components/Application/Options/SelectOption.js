import React, {Component} from 'react'
import {Card, CardHeader, CardBody} from 'reactstrap'
import {Button, ButtonGroup} from 'reactstrap'

export default class Units extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <Card className='text-center'>
          <CardHeader
              className='bg-csu-gold text-white font-weight-semibold'>Units</CardHeader>
          <CardBody>
            <ButtonGroup vertical className='w100'>
              {this.renderUnitButtons(Object.assign([], this.props.units))}
            </ButtonGroup>
          </CardBody>
        </Card>
    );
  }

  renderUnitButtons(names) {
    return names.sort().map((name) =>
        <Button
            className='btn-csu w-100'
            key={"button_" + name}
            active={this.props.activeOption === name}
            value={name}
            onClick={(event) => this.props.updateOption(this.props.activeOptionString,
                event.target.value)}
        >{name.charAt(0).toUpperCase() + name.slice(1)}</Button>
    );
  }
}