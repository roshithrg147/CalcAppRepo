/**
 * Author: R R
 * Date: 2025-03-21
 * Description: Calulator App
 */

import { useState } from "react";

export default function Calculator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleClick = (value) => {
    setInput((prev) => prev + value);
  };

  const clearInput = () => {
    setInput("");
    setResult("");
  };

  const calculateResult = () => {
    try {
      setResult(eval(input));
    } catch {
      setResult("Error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white p-6 rounded-lg shadow-lg w-72">
        <div className="mb-4 p-3 text-right bg-gray-100 rounded-md text-xl">
          {input || "0"}
        </div>
        <div className="mb-4 p-3 text-right bg-gray-300 rounded-md text-xl font-bold">
          {result}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            "7",
            "8",
            "9",
            "/",
            "4",
            "5",
            "6",
            "*",
            "1",
            "2",
            "3",
            "-",
            "0",
            ".",
            "%",
            "+",
          ].map((char) => (
            <button
              key={char}
              onClick={() => handleClick(char)}
              className="p-4 bg-gray-300 rounded-lg text-xl font-bold hover:bg-gray-400"
            >
              {char}
            </button>
          ))}
          <button
            onClick={clearInput}
            className="col-span-2 p-4 bg-red-500 text-white rounded-lg text-xl font-bold hover:bg-red-600"
          >
            C
          </button>
          <button
            onClick={calculateResult}
            className="col-span-2 p-4 bg-blue-500 text-white rounded-lg text-xl font-bold hover:bg-blue-600"
          >
            =
          </button>
        </div>
      </div>
      <footer>
        <a href="#" target="_blank">
          Privacy Policy
        </a>{" "}
        |
        <a href="#" target="_blank">
          Terms of Use
        </a>
      </footer>
    </div>
  );
}
