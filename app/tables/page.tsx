"use client";
import { useTableDataContext } from "@/context/TablesContext";
import React, { useEffect, useState } from "react";

interface TableSchemaFromDB {
  table_name: string;
  columns: {
    name: string;
    type: string;
  }[];
  primary_keys: string[];
  foreign_keys: {
    name: string;
    constrained_columns: string;
    referred_schema: string;
    referred_table: string;
    referred_columns: string[];
  }[];
  indexes: {
    name: string;
    columns: string[];
  }[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TableSchemaAdapter(data: any): TableSchemaFromDB {
  console.log(data);
  console.log(data.columns);
  console.log(data.primary_keys);
  return {
    table_name: data.table_name,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: data.columns?.map((column: any) => ({
      name: column.name,
      type: column.type,
    })),
    primary_keys: data.primary_keys,
    foreign_keys: data.foreign_keys,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    indexes: data.indexes?.map((index: any) => ({
      name: index.name,
      columns: index.columns,
    })),
  };
}

interface jsonlFormat {
  role: string;
  content: string;
}

const preparedDataset: jsonlFormat[][] = [
  [
    {
      role: "system",
      content:
        "You are and expert in PiHR and you can generate query for PiHR Database",
    },
    {
      role: "user",
      content: "You are a user and you can only view the data",
    },
    {
      role: "assistant",
      content: "You are an assistant and you can only view the data",
    },
  ],
  [
    {
      role: "system",
      content:
        "You are and expert in PiHR and you can generate query for PiHR Database",
    },
    {
      role: "user",
      content: "You are a user and you can only view the data",
    },
    {
      role: "assistant",
      content: "You are an assistant and you can only view the data",
    },
  ],
  [
    {
      role: "system",
      content:
        "You are and expert in PiHR and you can generate query for PiHR Database",
    },
    {
      role: "user",
      content: "You are a user and you can only view the data",
    },
    {
      role: "assistant",
      content: "You are an assistant and you can only view the data",
    },
  ],
];

const TablePage = () => {
  const { selectedTable, selectedSchema, documents } = useTableDataContext();
  const [full_table, setFullTable] = useState<string>("");
  const [tableData, setTableData] = useState<TableSchemaFromDB>();
  const roles = ["system", "user", "assistant"];
  const [selectedRole, setSelectedRole] = useState<string>("system");
  const [messages, setMessages] = useState<jsonlFormat[]>([]);
  const [instruction, setInstruction] = useState<string>(
    "You are and expert in PiHR and you can generate query for PiHR Database"
  );

  const addMessage = (role: string, content: string) => {
    setMessages([...messages, { role, content }]);
    setInstruction("");
  };

  // Table changed!
  useEffect(() => {
    if (!selectedTable) {
      console.log("Table not found");
    } else {
      const schema_name = documents[selectedSchema].schemaName;
      setFullTable(
        `${schema_name === "base" ? "" : schema_name + "."}${selectedTable}`
      );
      setMessages([]);
      setInstruction(
        "You are and expert in PiHR and you can generate query for PiHR Database"
      );
    }
  }, [selectedTable, documents]);

  // call to get table schema
  useEffect(() => {
    if (full_table.length > 2 && full_table.includes(".")) {
      fetch(`http://localhost:8000/schema`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table_names: [full_table],
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setTableData(TableSchemaAdapter(data.schema[0]));
        });
    }
  }, [full_table]);

  return (
    <div className="py-4 px-6">
      {tableData && (
        <div className="grid md:grid-cols-5">
          <div className="flex flex-col items-start md:col-span-3">
            <h1 className="font-bold text-2xl underline mt-4">
              TABLE : {tableData.table_name}
            </h1>
            <h2 className="font-bold text-2xl underline mt-4">COLUMNS</h2>
            <ul>
              {tableData.columns?.map((column) => (
                <li key={column.name}>
                  <span className="font-bold tracking-wider text-md">
                    {column.name}
                  </span>{" "}
                  : <span className="italic text-blue-600">{column.type}</span>
                </li>
              ))}
            </ul>
            <h2 className="font-bold text-2xl underline mt-4">PRIMARY KEYS</h2>
            <ul className="font-semibold tracking-wider flex gap-3 mt-2 text-sm">
              {tableData.primary_keys?.map((key) => (
                <li
                  className="px-3 bg-slate-900 text-white py-1.5 rounded-md"
                  key={key}
                >
                  {key}
                </li>
              ))}
            </ul>
            <h2 className="font-bold text-2xl underline mt-4">FOREIGN KEYS</h2>
            <ul>
              {tableData.foreign_keys?.map((key) => (
                <li key={key.name}>
                  <span className="font-semibold">{key.name}</span> :{" "}
                  <span className="text-red-600">
                    {key.constrained_columns}
                  </span>{" "}
                  {" -> "}
                  <span className="text-red-600">
                    {key.referred_schema}.{key.referred_table}(
                    {key.referred_columns.join(", ")}
                  </span>
                  )
                </li>
              ))}
            </ul>
            <h2 className="font-bold text-2xl underline mt-4">INDEXES</h2>
            <ul>
              {tableData.indexes?.map((index) => (
                <li key={index.name}>
                  <span className="font-semibold text-red-600">
                    {index.name}
                  </span>{" "}
                  : {index.columns.join(", ")}
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2 max-h-[90vh] overflow-auto">
            <div className="bg-slate-600 rounded-md w-full py-3 px-5">
              <div className="flex gap-2 flex-wrap">
                {roles.map((role, key) => (
                  <button
                    key={key}
                    className={`px-3 py-1 rounded-md ${
                      selectedRole !== role
                        ? "text-slate-950 bg-white"
                        : "bg-slate-950 text-white"
                    }`}
                    onClick={() => {
                      setSelectedRole(role);
                    }}
                  >
                    {role}
                  </button>
                ))}
              </div>
              <textarea
                className="w-full h-full p-4 text-white bg-transparent mt-2 focus:outline-none px-3 border-slate-300 border-[1px] rounded-md"
                placeholder="Enter Instructions Here..."
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  className="px-4 py-0.5 rounded-md bg-white text-slate-950"
                  onClick={() => {
                    addMessage(selectedRole, instruction);
                  }}
                >
                  ADD
                </button>
              </div>
              <div className="flex flex-col items-start w-full">
                {messages.map((message, key) => (
                  <div
                    key={key}
                    className="text-slate-950 bg-white w-full py-2 mt-2 rounded-md px-3"
                  >
                    <span className="font-semibold tracking-wider">
                      {message.role}
                    </span>{" "}
                    : {message.content}
                  </div>
                ))}
              </div>
              <button className="bg-slate-950 text-white w-full py-2 mt-2 rounded-md">
                Save Instruction to Database
              </button>
            </div>
            <div className="mt-4">
              <h2 className="font-bold text-2xl underline">PREPARED DATASET</h2>
              {preparedDataset.map((data, key) => (
                <div key={key} className="mt-4 bg-slate-200 border-slate-950 border-2 rounded-lg px-4 py-2">
                  {data.map((message, key) => (
                    <div
                      key={key}
                      className="text-slate-950 bg-white w-full py-2 my-2 rounded-md px-3"
                    >
                      <span className="font-semibold tracking-wider">
                        {message.role}
                      </span>{" "}
                      : {message.content}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablePage;
