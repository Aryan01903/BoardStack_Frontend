import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || "");
  const [role, setRole] = useState(location.state?.role || "member");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email || !role) {
      navigate("/send-otp"); // redirect back if user opens directly
    }
  }, [email, role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        email,
        otp,
        password,
        role,
        ...(role === "admin" ? { tenantName } : { tenantId }),
      };

      const res = await axiosInstance.post("/auth/register", payload);

      localStorage.setItem("token", res.data.token);
      navigate("/home"); // navigate to homepage
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md text-white transform transition duration-500 hover:scale-[1.01]">
        <h2 className="text-2xl font-bold mb-6 text-center">🔐 User Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            disabled
            className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
            placeholder="Email"
          />

          <select
            value={role}
            disabled
            className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
          >
            <option value="admin">Admin</option>
            <option value="member">Member</option>
          </select>

          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
            placeholder="OTP"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
            placeholder="Password"
          />

          {role === "admin" && (
            <input
              type="text"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
              placeholder="Tenant Name"
            />
          )}

          {role === "member" && (
            <input
              type="text"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
              placeholder="Tenant ID"
            />
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded bg-cyan-500 hover:bg-cyan-600 transition font-semibold text-white"
          >
            {loading ? "Verifying..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
