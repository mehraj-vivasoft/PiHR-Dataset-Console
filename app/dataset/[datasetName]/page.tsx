// app/dataset/[datasetName]/page.js
"use client";
import { useEffect, useState } from "react";

export default function DisplayJsonlData({
  params,
}: {
  params: { datasetName: string };
}) {
  const [data, setData] = useState([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!params.datasetName) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/jsonlData?collectionName=${params.datasetName}`
        );
        const result = await response.json();

        if (response.ok) {
          setData(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data");
      }
    };

    fetchData();
  }, [params.datasetName]);

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="bg-[#9CDCFE]">
      <h1 className="w-full text-center pt-4 pb-2 tracking-wider">DATASET : {params.datasetName}.jsonl</h1>
      <ul className="grid grid-cols-3 gap-4 text-xs">
        {data.map((item, index) => (
          <li key={index} className="overflow-y-hidden p-3 bg-[#202020] text-[#9CDCFE]">
            <pre>{JSON.stringify(item, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
