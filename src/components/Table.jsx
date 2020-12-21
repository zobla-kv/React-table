import React, { Component } from "react";
import makeHttpRequest from "../utils/httpRequest";
import { tableOrder, tableOrderBy } from "../utils/tableOrder";
import "../styles/table.css";
import TableRow from "./Tablerow";

class Table extends Component {
  state = {
    table: {
      headers: {
        id: "ID",
        fName: "First name",
        lName: "Last name",
        address: "Address",
        dob: "Date of birth",
        payment: "Payment",
      },
      data: [],
      show: false,
      orderBy: tableOrderBy.id,
      order: tableOrder.none,
    },
    searchTerm: "",
    inEditMode: "",
  };

  async componentDidMount() {
    const { table } = this.state;
    const data = await makeHttpRequest("assets/data/MOCK_DATA.json", "GET");
    table.data = data;
    table.show = true;
    table.dataCopy = data;
    this.setState({ table });
  }

  getTotalPayment = (data) => {
    const { euroToNumber } = this;
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      total += euroToNumber(data[i].payment);
    }
    return total.toFixed(2);
  };

  euroToNumber = (value) => parseFloat(value.split("€")[1].replace(",", "."));

  handleSearch = (value) => {
    const { table } = this.state;
    // for deleting after initial search
    table.data = table.dataCopy;
    this.setState({ table });
    const searchTerm = value.toLowerCase();
    const matchingData = table.data.filter(
      (element) =>
        // search by single column
        element["first_name"].toLowerCase().includes(searchTerm) ||
        element["last_name"].toLowerCase().includes(searchTerm) ||
        element["address"].toLowerCase().includes(searchTerm) ||
        element["date_of_birth"].includes(searchTerm) ||
        element["payment"].split("€")[1].includes(searchTerm) ||
        // search by combined columns
        (element["first_name"] + " " + element["last_name"])
          .toLowerCase()
          .includes(searchTerm)
    );
    table.data = matchingData;
    this.setState({ table, searchTerm });
  };

  handleSort = (param) => {
    const { table } = this.state;
    const { euroToNumber } = this;
    let data = table.data;
    let orderBy = table.orderBy;
    let order = table.order;
    if (param === table.headers.dob) {
      if (orderBy === tableOrderBy.dob) {
        // if sorted by dob already, reverse
        if (order === tableOrder.desc) {
          data.reverse();
          order = tableOrder.asc;
        } else {
          // if sorted by dob ascending, sort by id again
          data.sort((a, b) => a.id - b.id);
          orderBy = tableOrderBy.id;
          order = tableOrder.none;
        }
      } else if (orderBy === tableOrderBy.id) {
        // if sorted by id, sort to dob descending
        data.sort(
          (a, b) =>
            new Date(a["date_of_birth"].split("/").reverse()) -
            new Date(b["date_of_birth"].split("/").reverse())
        );
        orderBy = tableOrderBy.dob;
        order = tableOrder.desc;
      } else {
        // if sorted by payment, keep asecnding or descending order
        // and sort by dob
        if (order === tableOrder.desc) {
          data.sort(
            (a, b) =>
              new Date(a["date_of_birth"].split("/").reverse()) -
              new Date(b["date_of_birth"].split("/").reverse())
          );
          orderBy = tableOrderBy.dob;
        } else {
          data.sort(
            (a, b) =>
              new Date(b["date_of_birth"].split("/").reverse()) -
              new Date(a["date_of_birth"].split("/").reverse())
          );
          orderBy = tableOrderBy.dob;
          order = tableOrder.asc;
        }
      }
    } else {
      if (orderBy === tableOrderBy.payment) {
        if (order === tableOrder.desc) {
          data.reverse();
          order = tableOrder.asc;
        } else {
          data.sort((a, b) => a.id - b.id);
          orderBy = tableOrderBy.id;
          order = tableOrder.none;
        }
      } else if (orderBy === tableOrderBy.id) {
        data.sort((a, b) => euroToNumber(a.payment) - euroToNumber(b.payment));
        orderBy = tableOrderBy.payment;
        order = tableOrder.desc;
      } else {
        if (order === tableOrder.desc) {
          data.sort(
            (a, b) => euroToNumber(a.payment) - euroToNumber(b.payment)
          );
          orderBy = tableOrderBy.payment;
        } else {
          data.sort(
            (a, b) => euroToNumber(b.payment) - euroToNumber(a.payment)
          );
          orderBy = tableOrderBy.payment;
          order = tableOrder.asc;
        }
      }
    }
    table.data = data;
    table.order = order;
    table.orderBy = orderBy;
    this.setState({ table });
  };

  enableEdit = (fieldValue, headerIndex) => {
    const {
      table: { headers, data },
    } = this.state;
    const fieldIndex = data.findIndex(
      (e) => e[Object.keys(headers)[headerIndex]] === fieldValue
    );
    this.setState({
      inEditMode: fieldValue,
      fieldIndex,
      newCellValue: fieldValue,
    });
  };

  handleEdit = (value) => {
    this.setState({ newCellValue: value });
  };

  confirmEdit = (headerIndex) => {
    const {
      table: { headers, data },
      newCellValue,
      fieldIndex,
    } = this.state;
    data[fieldIndex][Object.keys(headers)[headerIndex]] = newCellValue;
    this.setState({
      data,
      inEditMode: "",
    });
  };

  render() {
    const {
      table: { headers, data, show, order, orderBy },
      searchTerm,
      inEditMode,
      newCellValue,
    } = this.state;
    const {
      getTotalPayment,
      handleSearch,
      handleSort,
      enableEdit,
      handleEdit,
      confirmEdit,
    } = this;
    let total = 0;
    if (data.length > 0) {
      total = getTotalPayment(data);
    }
    return (
      <>
        <table>
          {show && (
            <>
              <thead>
                <TableRow
                  search
                  searchTerm={searchTerm}
                  onSearchTermChange={handleSearch}
                />
                <TableRow
                  headers={headers}
                  onHeaderClick={handleSort}
                  order={order}
                  orderBy={orderBy}
                />
              </thead>
              <tbody>
                {data.map((e) => (
                  <TableRow
                    key={e.id}
                    data={e}
                    onDoubleClick={enableEdit}
                    inEditMode={inEditMode}
                    onEdit={handleEdit}
                    newCellValue={newCellValue}
                    confirmEdit={confirmEdit}
                  />
                ))}
                {data.length > 0 && <TableRow total={total} />}
                {data.length === 0 && <span id="noMatches">No matches</span>}
              </tbody>
            </>
          )}
        </table>
      </>
    );
  }
}

export default Table;
