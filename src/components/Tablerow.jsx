/* eslint-disable no-restricted-globals */
import React, { Component } from "react";
import { tableOrder } from "../utils/tableOrder";

class TableRow extends Component {
  getArrowIcon(header, order, orderBy) {
    let icon = "";
    if (header.toLowerCase() !== orderBy) {
      return icon;
    }
    if (order === tableOrder.desc) {
      return (icon += "sortArrow fa fa-angle-double-down");
    } else {
      return (icon += "sortArrow fa fa-angle-double-up");
    }
  }

  render() {
    const {
      search,
      searchTerm,
      onSearchTermChange,
      headers,
      data,
      total,
      onHeaderClick,
      order,
      orderBy,
      onDoubleClick,
      inEditMode,
      onEdit,
      newCellValue,
      confirmEdit,
    } = this.props;
    const { getArrowIcon } = this;
    return (
      <tr>
        {search && (
          <>
            <td colSpan="5" />
            <td className="noPadding">
              <input
                id="search"
                placeholder="Search"
                value={searchTerm}
                onChange={() => onSearchTermChange(event.target.value)}
              />
            </td>
          </>
        )}
        {headers &&
          Object.values(headers).map((header, i) => {
            if (header === headers.dob || header === headers.payment) {
              return (
                <th
                  key={i}
                  className="sort"
                  onClick={() => onHeaderClick(header)}
                >
                  <span className={getArrowIcon(header, order, orderBy)}></span>
                  {header}
                </th>
              );
            } else {
              return <th key={i}>{header}</th>;
            }
          })}
        {data &&
          Object.values(data).map((cellData, i) => {
            if (cellData === inEditMode && (i === 3 || i === 5)) {
              return (
                <td key={cellData} className="noPadding">
                  <input
                    className="editingInput"
                    value={newCellValue}
                    onChange={() => onEdit(event.target.value)}
                    onBlur={() => confirmEdit(i)}
                    autoFocus
                  />
                </td>
              );
            } else {
              return (
                <td
                  key={cellData}
                  onDoubleClick={() => onDoubleClick(event.target.innerHTML, i)}
                >
                  {cellData}
                </td>
              );
            }
          })}
        {total && (
          <>
            <td colSpan="4" />
            <th>Total:</th>
            <th>€{total}</th>
          </>
        )}
      </tr>
    );
  }
}

export default TableRow;
