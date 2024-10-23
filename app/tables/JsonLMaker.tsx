import React, { useEffect, useState } from "react";
import { jsonlFormat } from "./models";
import AutoSizedTextarea from "../components/AutoSizedTextArea";

export const JsonLMaker = ({
  addEntry,
  full_table_name,
}: {
  addEntry: (data: { trainingData: jsonlFormat[]; id: string }) => void;
  full_table_name: string;
}) => {
  const roles = ["system", "user", "assistant"];
  const [selectedRole, setSelectedRole] = useState<string>("system");
  const [messages, setMessages] = useState<jsonlFormat[]>([]);
  const [instruction, setInstruction] = useState<string>(
    "You are and expert in PiHR and you can generate query for PiHR Database"
  );
  const [submittingData, setSubmittingData] = useState<boolean>(false);
  const addMessage = (role: string, content: string) => {
    setMessages([...messages, { role, content }]);
    setInstruction("");
  };
  const postMessage = async (
    tableName: string,
    trainingData: jsonlFormat[]
  ) => {
    try {
      setSubmittingData(true);
      const response = await fetch("/api/tables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tableName, trainingData }),
      });
      const data = await response.json();
      console.log("response from mongo : ", data);
      addEntry({
        trainingData: trainingData,
        id: data.result.insertedId,
      });
      resetJsonlMaker();
    } catch (error) {
      console.error("Error saving document:", error);
    }
    setSubmittingData(false);
  };

  useEffect(() => {
    resetJsonlMaker();
  }, [full_table_name]);

  const resetJsonlMaker = () => {
    setMessages([]);
    setInstruction(
      "You are and expert in PiHR and you can generate query for PiHR Database"
    );
  };
  return (
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
      <AutoSizedTextarea
      className="w-full h-full p-4 text-white bg-transparent mt-2 focus:outline-none px-3 border-slate-300 border-[1px] rounded-md"
        placeholder="Enter Instructions Here..."
        defaultValue={instruction}
        onchange={(e) => setInstruction(e.target.value)}
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
            <span className="font-semibold tracking-wider">{message.role}</span>{" "}
            : {message.content}
          </div>
        ))}
      </div>
      <button
        className="bg-slate-950 text-white w-full py-2 mt-2 rounded-md"
        onClick={async () => {
          await postMessage(full_table_name, messages);
        }}
      >
        {submittingData ? "Submitting Data" : "Save Instruction to Database"}
      </button>
    </div>
  );
};
