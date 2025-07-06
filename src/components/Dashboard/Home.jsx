import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [whiteboards, setWhiteboards] = useState([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [newBoardName, setNewBoardName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchWhiteboards();
    fetchAuditLogs();
  }, []);

  const fetchWhiteboards = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/whiteboard/get");
      setWhiteboards(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Fetch whiteboards error:", err);
      setError("Failed to load whiteboards.");
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await axiosInstance.get("/api/audit");
      setAuditLogs(res.data.logs || []);
    } catch (err) {
      console.error("Audit log fetch error:", err);
    }
  };

  const handleCreate = async () => {
    if (!newBoardName.trim()) return;
    try {
      setLoading(true);
      await axiosInstance.post("/whiteboard/create", { name: newBoardName.trim() });
      setShowCreate(false);
      setNewBoardName("");
      await fetchWhiteboards();
    } catch (err) {
      console.error("Create whiteboard error:", err);
      console.error("Response data:", err.response?.data);
      setError(err.response?.data?.error || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    try {
      setInviteLoading(true);
      await axiosInstance.post("/invites/send", { email: inviteEmail.trim() });
      setInviteEmail("");
      alert("Invite sent successfully!");
    } catch (err) {
      console.error("Invite error:", err);
      alert("Failed to send invite.");
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-8"
      style={{ backgroundImage: "url('/public/Home.png')" }}
    >
        <h1
        className="text-5xl text-center font-extrabold mb-8 tracking-widest"
        style={{
        color: "#6B21A8",
        textShadow: "1px 1px 3px rgba(107, 33, 168, 0.5)"
        }}
    >
        <span className="mr-3" role="img" aria-label="target">
            🎯
        </span>
         Welcome to BoardStack
    </h1>

      <div className="bg-gray-900 bg-opacity-80 rounded-lg p-6 grid gap-8 md:grid-cols-3">
        {/* Create Whiteboard */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl text-cyan-400 font-semibold mb-4">Create Whiteboard</h2>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-white transition"
            disabled={loading}
          >
            + New Board
          </button>
          {showCreate && (
            <div className="mt-4 p-4 bg-gray-700 rounded">
              <input
                type="text"
                placeholder="Board Name"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                className="w-full p-2 mb-2 rounded bg-gray-600 text-white"
                disabled={loading}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowCreate(false)}
                  className="px-3 py-1 bg-gray-500 hover:bg-gray-600 rounded text-white"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 rounded text-white"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* My Whiteboards */}
        <div className="bg-gray-800 rounded-lg p-4 col-span-2">
          <h2 className="text-xl text-cyan-400 font-semibold mb-4">My Whiteboards</h2>
          {loading && !showCreate ? (
            <p style={{ color: "beige" }}>Loading whiteboards...</p>
          ) : whiteboards.length === 0 ? (
            <p style={{ color: "beige" }}>No whiteboards found. Create one above!</p>
          ) : (
            <ul className="space-y-2 max-h-[400px] overflow-y-auto">
              {whiteboards.map((wb) => (
                <li key={wb._id}>
                  <button
                    onClick={() => navigate(`/whiteboard/${wb._id}`)}
                    className="w-full text-left p-3 bg-gray-700 rounded hover:bg-gray-600 transition"
                    style={{ color: "beige" }}
                  >
                    {wb.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {error && <p className="text-red-400 mt-2">{error}</p>}
        </div>

        {/* Invite Members */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl text-cyan-400 font-semibold mb-2">Invite Member</h2>
          <div className="flex space-x-2">
            <input
              type="email"
              placeholder="Email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1 p-2 rounded bg-gray-600 text-white"
              disabled={inviteLoading}
            />
            <button
              onClick={handleInvite}
              className="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-white"
              disabled={inviteLoading}
            >
              {inviteLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="bg-gray-800 rounded-lg p-4 md:col-span-3">
          <h2 className="text-xl text-cyan-400 font-semibold mb-4">Audit Logs</h2>
          {auditLogs.length === 0 ? (
            <p className="text-gray-400">No audit history available.</p>
          ) : (
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {auditLogs.map((log, index) => (
                <li
                  key={index}
                  className="bg-gray-700 p-3 rounded text-sm text-white flex flex-col"
                >
                  <div>
                    <strong className="text-cyan-300">{log.action}</strong>
                    {log.details?.name && <span> – {log.details.name}</span>}
                    {log.details?.whiteboard && <span> – Whiteboard: {log.details.whiteboard}</span>}
                  </div>
                  <span className="text-gray-400 text-xs mt-1">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-gray-400 text-sm">
        <p className="text-white">🖥️ Made by Aryan Kumar Shrivastav</p>
      </footer>
    </div>
  );
};

export default Dashboard;
