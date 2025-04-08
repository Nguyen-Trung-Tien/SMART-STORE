import { Table } from "antd";
import React, { useMemo, useState } from "react";
import Loading from "../LoadingComponent/Loading";
import { Excel } from "antd-table-saveas-excel";

const TableComponent = (props) => {
  const {
    selectionType = "checkbox",
    data: dataSource = [],
    isPending = false,
    columns = [],
    handleDeleteMany,
  } = props;
  const [rowSelectedKeys, setRowSelectedKeys] = useState([]);

  const newColumnExport = useMemo(() => {
    const arr = columns?.filter((col) => col.dataIndex !== "action");
    return arr;
  }, [columns]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKeys(selectedRowKeys);
    },
    // getCheckboxProps: (record) => ({
    //   disabled: record.name === "Disabled User", // Column configuration not to be checked
    //   name: record.name,
    // }),
  };

  const handleExcel = () => {
    try {
      if (!dataSource || !newColumnExport) {
        console.error("Missing data or columns for export");
        return;
      }

      const excel = new Excel();
      const exportColumns = newColumnExport.map((col) => ({
        title: col.title,
        dataIndex: col.dataIndex,
        key: col.key || col.dataIndex,
      }));

      const exportData = dataSource.map((record) => {
        const row = {};
        exportColumns.forEach((col) => {
          const value = record[col.dataIndex];
          row[col.dataIndex] =
            value !== undefined && value !== null ? String(value) : "";
        });
        return row;
      });

      excel
        .addSheet("Sheet1")
        .addColumns(exportColumns)
        .addDataSource(exportData, {
          str2Percent: false,
          header: true,
        })
        .saveAs("product.xlsx");
    } catch (error) {
      console.error("Excel export failed:", error);
    }
  };

  const handleDeleteAll = () => {
    handleDeleteMany(rowSelectedKeys);
  };
  return (
    <div>
      <Loading isLoading={isPending}>
        {rowSelectedKeys.length > 0 && (
          <div
            style={{
              background: "#1d1ddd",
              color: "#fff",
              fontWeight: "bold",
              padding: "10px",
              cursor: "pointer",
              marginTop: "10px",
              borderRadius: "10px",
              border: "none",
              outline: "none",
              marginBottom: "10px",
            }}
            onClick={handleDeleteAll}
          >
            Xoá tất cả
          </div>
        )}
        <button
          style={{
            background: "blue",
            color: "#fff",
            fontWeight: "bold",
            padding: "10px",
            cursor: "pointer",
            marginTop: "10px",
            marginLeft: "990px",
            marginBottom: "10px",
            borderRadius: "10px",
            border: "none",
            outline: "none",
            boxShadow:
              "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
          }}
          onClick={handleExcel}
        >
          Export Excel
        </button>
        <Table
          rowSelection={Object.assign({ type: selectionType }, rowSelection)}
          columns={columns}
          dataSource={dataSource}
          {...props}
        />
      </Loading>
    </div>
  );
};

export default TableComponent;
