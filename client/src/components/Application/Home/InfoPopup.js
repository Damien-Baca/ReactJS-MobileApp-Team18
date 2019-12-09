import React, { Component } from 'react';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';

export default class InfoPopup extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.state = {
      open: true
    }
  }

  render() {
    console.log("popup")

    return (
        <Popover
            placement={"top"}
            isOpen={this.state.open}
            target={`Popover${this.props.index}`}
            toggle={this.toggle}>
          <PopoverHeader>Hello</PopoverHeader>
          <PopoverBody>Goodbye</PopoverBody>
        </Popover>
    )
  }

  toggle() {
    this.setState({open: false})
  };
}