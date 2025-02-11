import React, { useState } from "react";
import API from "@/services/API";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader } from "lucide-react";

const MailAgent = () => {
  const [name, setName] = useState("");
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !requirements) {
      toast.error("Please fill in all fields!");
      return;
    }
    setLoading(true);
    try {
      const result = await API.post.sendMail(`I'm ${name} - ` + requirements);
      if (result.status === 200) {
        toast.success("Email sent successfully!");
        setName("");
        setRequirements("");
      } else {
        toast.error("Something went wrong! Check with Admin.");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to send email! Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-300 to-purple-400 p-4">
      <div className="bg-white p-6 md:p-10 rounded-2xl shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Mail Agent</h2>
        <p className="text-gray-600 text-center mb-6">
          Tell your requirements to send a mail to a specific person within your team
        </p>
        <ToastContainer />
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Your Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Mail Requirements</label>
            <textarea
              placeholder="Requirements of yours to send a mail"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 h-28 text-black"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={20} /> Sending Email...
              </>
            ) : (
              "Send Mail"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MailAgent;