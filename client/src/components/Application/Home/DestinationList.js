import React, {Component} from 'react';
import {Button, ListGroup, ListGroupItem} from "reactstrap";
import MaterialTable from "material-table";
import {Search, Clear, FirstPage, LastPage, ArrowForward, ArrowBack, ArrowUpward, ArrowDownward, VerticalAlignTop, DeleteForever, Info} from "@material-ui/icons";
import InfoPopup from './InfoPopup';

export default class DestinationList extends Component {
  constructor(props) {
    super(props);

    let actionList = [{
      icon: DeleteForever,
      tooltip: 'Remove Location',
      onClick: (event, rowData) =>
          this.handleRemoveDestination(rowData.tableData.id)
    }, {
      icon: VerticalAlignTop,
      toolTip: 'Start Here',
      onClick: (event, rowData) => this.handleSwapDestinations(
          rowData.tableData.id)
    }, {
      icon: ArrowDownward,
      toolTip: 'Move Down',
      onClick: (event, rowData) =>
          this.handleSwapDestinations(rowData.tableData.id,
              rowData.tableData.id + 1)
    }, {
      icon: ArrowUpward,
      tooltip: 'Move Up',
      onClick: (event, rowData) =>
          this.handleSwapDestinations(rowData.tableData.id,
              rowData.tableData.id - 1)
    }, {
      icon: Info,
      tooltip: 'Info',
      onClick: (event, rowData) => { this.displayInfo(rowData.tableData.id) }
    }];

    this.state = {
      columns: [
        {title: 'Name', field: 'name'},
        {title: 'Latitude', field: 'latitude'},
        {title: 'Longitude', field: 'longitude'},
        {title: 'Leg Distance', field: 'legDistance'},
        {title: 'Cumulative Distance', field: 'cumulativeDistance'}],
      actions: actionList,
    }
  }

  render() {
    return (
        <ListGroup>
          {this.renderClearDestinations()}
          {this.renderReverseDestinations()}
          {this.renderMaterialTable()}
        </ListGroup>
    );
  }

  renderClearDestinations() {
    return (
        <ListGroupItem>
          <Button className='btn-csu h-5 w-100 text-left'
                  size={'sm'}
                  name='clear_destinations'
                  key={"button_clear_all_destinations"}
                  value='Clear Destinations'
                  active={false}
                  disabled={this.props.destinations.length < 1}
                  onClick={() => this.handleClearDestinations()}
          >Clear Destinations</Button>
        </ListGroupItem>
    );
  }

  renderReverseDestinations() {
    return (
      <ListGroupItem>
        <Button className='btn-csu h-5 w-100 text-left'
                size={'sm'}
                name='reverse_destinations'
                key={"button_reverse_destinations"}
                value='Reverse Destinations'
                active={this.props.destinations.length > 0}
                disabled={this.props.destinations.length < 1}
                onClick={() => this.handleReverseDestinations()}
        >Reverse Destination Order</Button>
      </ListGroupItem>
    );
  }

  renderMaterialTable() {
    let setData = () => {
      let data = [];
      let setDistances = this.props.distances !== null;

      this.props.destinations.forEach((destination, index) => {
        data.push({
          name: destination.name,
          latitude: destination.latitude,
          longitude: destination.longitude,
          legDistance: setDistances ? this.props.distances[index] : '',
          cumulativeDistance: setDistances ?
              this.props.sumDistances(index) : 'Not Calculated'
        });
      });

      return data;
    };

    return (
      <MaterialTable
          title={'My Trip'}
          columns={this.state.columns}
          actions={this.state.actions}
          data={setData()}
          icons={{
            Search: Search,
            ResetSearch: Clear,
            FirstPage: FirstPage,
            LastPage: LastPage,
            PreviousPage: ArrowBack,
            NextPage: ArrowForward
          }}
          options={{
            search: true

          }}
          />
    );
  }

  handleClearDestinations() {
    this.props.removeDestination(-1);
    this.props.resetDistances();
  }

  handleReverseDestinations() {
    this.props.reverseDestinations();
    this.props.resetDistances();
  }

  handleRemoveDestination(index) {
    this.props.removeDestination(index);
    this.props.resetDistances();
  }

  handleSwapDestinations(index1, index2) {
    this.props.swapDestinations(index1, index2);
    this.props.resetDistances();
  }

  displayInfo(index) {
    return (
        <InfoPopup
            index={index}
            destination={this.props.destinations[index]}
            distance={this.props.distances[index]}/>
    );
  }
}