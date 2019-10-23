import React, {Component} from 'react'
import {Card, CardHeader, CardBody} from 'reactstrap'
import {Row, Col, Button, ButtonGroup} from 'reactstrap'

export default class ExportFileFormat extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
        <Card className='text-center'>
          <CardHeader
              className='bg-csu-gold text-white font-weight-semibold'>ExportFileFormat</CardHeader>
          <CardBody>
            <ButtonGroup vertical className='w100'>
              {this.renderUnitButtons(Object.keys(this.props.options.formats))}
            </ButtonGroup>
          </CardBody>
        </Card>
    );
  }

  renderUnitButtons(names) {
    return names.sort().map((fmt) =>
        <Button
            className='btn-csu w-100 text-left'
            key={"button_" + fmt}
            active={this.props.activeFileFormat === fmt}
            value={fmt}
            onClick={(event) => this.props.updateOption('activeFileFormat',
                event.target.value)}
        >
          {fmt.charAt(0).toUpperCase() + fmt.slice(1)}
        </Button>
    );
  }

}
