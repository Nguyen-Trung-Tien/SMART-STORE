import { Divider, Table } from "antd";
import React from "react";
import Loading from "../LoadingComponent/Loading";

const TableComponent = (props) => {
  const {
    selectionType = "checkbox",
    data = [],
    isPending = false,
    columns = [],
  } = props;

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
    }),
  };
  return (
    <div>
      <Loading isLoading={isPending}>
        <Table
          rowSelection={Object.assign({ type: selectionType }, rowSelection)}
          columns={columns}
          dataSource={data}
        />
      </Loading>
    </div>
  );
};

export default TableComponent;
