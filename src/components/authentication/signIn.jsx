import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md text-white transform transition duration-500 hover:scale-[1.01]">
        <h2 className="text-2xl font-bold mb-6 text-center">🔐 Welcome</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded bg-cyan-500 hover:bg-cyan-600 transition font-semibold text-white"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-300">
          Don’t have an account?{" "}
          <span
            className="text-cyan-500 hover:underline cursor-pointer"
            onClick={() => navigate("/send-otp")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
