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
    fileName = "export",
  } = props;

  const [rowSelectedKeys, setRowSelectedKeys] = useState([]);

  const newColumnExport = useMemo(() => {
    return columns?.filter((col) => col.dataIndex !== "action");
  }, [columns]);

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setRowSelectedKeys(selectedRowKeys);
    },
  };

  const buttonStyle = {
    fontWeight: "500",
    padding: "8px 16px",
    cursor: "pointer",
    borderRadius: "6px",
    border: "none",
    outline: "none",
    transition: "all 0.3s ease",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  const deleteButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#ff4d4f",
    color: "#fff",
    boxShadow: "0 2px 6px rgba(255, 77, 79, 0.3)",
  };

  const exportButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#1890ff",
    color: "#fff",
    boxShadow: "0 2px 6px rgba(24, 144, 255, 0.3)",
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
        .saveAs(`${fileName}.xlsx`);
    } catch (error) {
      console.error("Excel export failed:", error);
    }
  };

  const handleDeleteAll = () => {
    if (handleDeleteMany) {
      handleDeleteMany(rowSelectedKeys);
    }
  };

  return (
    <div>
      <Loading isLoading={isPending}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "10px 0 20px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div>
            {handleDeleteMany && rowSelectedKeys.length > 0 && (
              <button
                style={deleteButtonStyle}
                onClick={handleDeleteAll}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#d9363e")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#ff4d4f")
                }
              >
                Xoá tất cả ({rowSelectedKeys.length})
              </button>
            )}
          </div>
          <div>
            <button
              style={exportButtonStyle}
              onClick={handleExcel}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#1677ff")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#1890ff")}
            >
              Export Excel
            </button>
          </div>
        </div>

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
