/**
 * Author: R R
 * Date: 2025-03-21
 * Description: Calulator App
 */

import { useState, useEffect } from "react";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [authData, setAuthData] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Pi) {
      window.Pi.init({
        version: "2.0",
        sandbox: false, // Set to production mode
        onReady: () => {
          console.log("Pi SDK initialized successfully.");
        },
        onError: (error) => {
          console.error("Error initializing Pi SDK:", error);
        },
      });
    } else {
      console.error("Pi SDK is not available.");
    }
  }, []);

  const handleLogin = () => {
    if (!username.trim()) {
      alert("Please enter your Pi username to continue.");
      return;
    }

    const scopes = ["payments"]; // Request permission for payments
    const onIncompletePaymentFound = (payment) => {
      console.log("Incomplete payment found:", payment);
    };

    if (typeof window !== "undefined" && window.Pi) {
      window.Pi.authenticate(scopes, onIncompletePaymentFound)
        .then((auth) => {
          console.log("Authenticated user:", auth);
          setAuthData(auth);
          setIsAuthenticated(true); // Proceed to calculator
        })
        .catch((error) => {
          console.error("Authentication failed:", error);
          alert("Authentication failed. Please try again.");
        });
    } else {
      alert("Pi SDK is not available.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your Pi username"
            className="w-full p-2 border rounded-md mb-4 bg-gray-100"
          />
          <button
            onClick={handleLogin}
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Login with Pi
          </button>
        </div>
      </div>
    );
  }

  return <Calculator username={username} />;
}

function Calculator({ username }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [fullSubdomain, setFullSubdomain] = useState("");

  const handlePayment = () => {
    const paymentData = {
      amount: 1, // Amount in Pi
      memo: "Transfer 1 Pi to app wallet", // Description of the payment
      metadata: { purpose: "App Access Fee" }, // Additional metadata
    };

    if (typeof window !== "undefined" && window.Pi) {
      window.Pi.createPayment(
        paymentData,
        {
          onReadyForServerApproval: (paymentId) => {
            console.log("Payment ready for server approval:", paymentId);
            // Send paymentId to your server for approval
            fetch("/api/approve-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.success) {
                  console.log("Payment approved by server.");
                } else {
                  console.error("Server approval failed:", data.error);
                }
              });
          },
          onReadyForServerCompletion: (paymentId) => {
            console.log("Payment ready for server completion:", paymentId);
            // Notify your server to complete the payment
            fetch("/api/complete-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.success) {
                  console.log("Payment completed successfully.");
                } else {
                  console.error("Server completion failed:", data.error);
                }
              });
          },
          onCancel: (paymentId) => {
            console.log("Payment canceled:", paymentId);
          },
          onError: (error) => {
            console.error("Payment error:", error);
          },
        },
        { sandbox: false }
      );
    } else {
      alert("Pi SDK is not available.");
    }
  };

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

  const handleSubdomainChange = (event) => {
    setSubdomain(event.target.value);
  };

  const updateSubdomain = () => {
    if (subdomain) {
      const randomDigits = Math.floor(1000 + Math.random() * 9000); // Generate 4 random digits
      const generatedSubdomain = `${subdomain}${randomDigits}`;
      const fullGeneratedSubdomain = `https://${generatedSubdomain}.minepi.com/`;
      setFullSubdomain(fullGeneratedSubdomain);
      console.log(`Generated PiNet Subdomain: ${fullGeneratedSubdomain}`);
    } else {
      console.error("Subdomain cannot be empty.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
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
      <div className="mt-6 text-center">
        <label htmlFor="subdomain" className="block text-lg font-medium">
          PiNet Subdomain
        </label>
        <input
          id="subdomain"
          type="text"
          value={subdomain}
          onChange={handleSubdomainChange}
          className="mt-2 p-2 border rounded-md w-64"
          placeholder="Enter subdomain"
        />
        <button
          onClick={updateSubdomain}
          className="ml-4 p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Update
        </button>
        {fullSubdomain && (
          <p className="mt-4 text-blue-600">
            Your app will be accessible at:{" "}
            <a
              href={fullSubdomain}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {fullSubdomain}
            </a>
          </p>
        )}
      </div>
      <div className="mt-6">
        <button
          onClick={handlePayment}
          className="p-4 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
        >
          Make a Payment
        </button>
      </div>
      <footer className="mt-6 text-sm text-center">
        <p>Welcome, {username}!</p>
        <a
          href="https://github.com/roshithrg147/CalcAppRepo/blob/main/pages/privacy-policy.md"
          target="_blank"
          className="text-blue-600 underline"
        >
          Privacy Policy
        </a>{" "}
        |
        <a
          href="https://github.com/roshithrg147/CalcAppRepo/blob/main/pages/terms-of-use.md"
          target="_blank"
          className="text-blue-600 underline"
        >
          Terms of Use
        </a>
      </footer>
    </div>
  );
}
