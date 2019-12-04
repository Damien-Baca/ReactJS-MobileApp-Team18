import React, { Component } from 'react';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';

export default class InfoPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true
    }
  }

  render() {
    return (
        <Popover
            isOpen={this.state.open}
            target={`Popover${this.props.index}`}
            toggle={toggle}>
          <PopoverHeader>Hello</PopoverHeader>
          <PopoverBody>Goodbye</PopoverBody>
        </Popover>
    )
  }
}