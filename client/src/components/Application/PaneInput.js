import React, {Component} from 'react';
import {Card, CardBody, CardHeader} from 'reactstrap';

/*
 * Renders a pane out of a Card, with a Header and Body component.
 */
export default class PaneInput extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''}

    this.applyChange = this.applyChange.bind(this);
    this.applySubmit = this.props.applySubmit.bind(this);
  }

  render() {
    return (
        <Card>
          <CardHeader className='bg-csu-gold text-white font-weight-semibold'>
            {this.props.header}
          </CardHeader>
          <CardBody>
            {this.props.bodyJSX}
            {this.createInputField(this.props.button)}
          </CardBody>
        </Card>
    );
  }

  createInputField(button) {
    return (
        <form onSubmit={this.applySubmit}>
          <label>
            <input type="text" value={''}/>
          </label>
          <input type="submit" value={button}/>
        </form>
    );
  }

  applyChange(event) {
    this.setState({value: event.target.value})
  }

  applySubmit(event) {
    alert('Submission accepted: ' + this.state.value);
    event.preventDefault()
  }
}