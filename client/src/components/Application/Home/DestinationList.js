import React, {Component} from 'react';
import MaterialTable from "material-table";
import {Search, Clear, FirstPage, LastPage, ArrowForward, ArrowBack, ArrowUpward, ArrowDownward, VerticalAlignTop, DeleteForever, DeleteRounded, SwapCallsRounded} from "@material-ui/icons";

export default class DestinationList extends Component {
  constructor(props) {
    super(props);

    let actionList = [{
      icon: DeleteForever,
      tooltip: 'Clear Destinations',
      isFreeAction: true,
      onClick: () => this.handleClearDestinations()
    }, {
      icon: SwapCallsRounded,
      tooltip: 'Reverse Trip',
      isFreeAction: true,
      onClick: () => this.handleReverseDestinations()
    }, {
      icon: DeleteRounded,
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
          this.renderMaterialTable()
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
}