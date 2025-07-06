import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

const Whiteboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(3);
  const [versions, setVersions] = useState([]);

  // Setup canvas and load whiteboard
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.7;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctxRef.current = ctx;

    loadWhiteboard();
    loadVersions();
  }, []);

  // Update line width and color on change
  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.lineWidth = lineWidth;
      ctxRef.current.strokeStyle = color;
    }
  }, [lineWidth, color]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    ctxRef.current.closePath();
    saveWhiteboard();
  };

  const saveWhiteboard = async () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");
    try {
      await axiosInstance.put(`/whiteboard/update/${id}`, { data: dataURL });
    } catch (err) {
      console.error("Save error:", err.response?.data || err.message);
    }
  };

  const loadWhiteboard = async () => {
    try {
      const res = await axiosInstance.get(`/whiteboard/get/${id}`);
      const wb = res.data;
      if (wb.data) {
        const img = new Image();
        img.onload = () => {
          ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctxRef.current.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
        };
        img.src = wb.data;
      }
    } catch (err) {
      console.error("Load error:", err.response?.data || err.message);
    }
  };

  const loadVersions = async () => {
    try {
      const res = await axiosInstance.get(`/whiteboard/get/${id}/versions`);
      setVersions(res.data);
    } catch (err) {
      console.error("Load versions error:", err);
    }
  };

  const restoreVersion = async (index) => {
    try {
      await axiosInstance.get(`/whiteboard/get/${id}/restore/${index}`);
      await loadWhiteboard();
      alert("Version restored.");
    } catch (err) {
      console.error("Restore error:", err);
    }
  };

  const handleEraser = () => {
    setColor("#ffffff");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-cyan-400">Whiteboard</h1>
        <button
          onClick={() => navigate("/home")}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-white"
        >
          Back to Home
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <label>
          ✏️ Color:{" "}
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </label>
        <label>
          📏 Line Width:{" "}
          <input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={(e) => setLineWidth(parseInt(e.target.value))}
          />
        </label>
        <button
          onClick={handleEraser}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded"
        >
          🧽 Eraser
        </button>
      </div>

      <div className="border border-gray-600 rounded overflow-hidden mb-6">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="bg-white block"
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2 text-cyan-400">Restore Versions</h2>
        {versions.length === 0 ? (
          <p className="text-gray-400">No previous versions available.</p>
        ) : (
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {versions.map((v, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-800 p-2 rounded">
                <span>Version {index + 1}</span>
                <button
                  onClick={() => restoreVersion(index)}
                  className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 rounded text-sm"
                >
                  Restore
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Whiteboard;
