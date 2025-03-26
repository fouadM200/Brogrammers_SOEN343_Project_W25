// src/ForgotPassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./assets/Version3.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleVerifyEmail = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.some(user => user.email === email.trim().toLowerCase());

    if (!userExists) {
      alert("No account found with this email.");
      return;
    }
    setEmailVerified(true);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.map(user =>
      user.email === email.trim().toLowerCase() ? { ...user, password } : user
    );
    localStorage.setItem("users", JSON.stringify(users));

    alert("Password successfully reset! You can now log in.");
    navigate("/auth");
  };

  return (
    <div className="flex h-screen relative">
      {/* Logo */}
      <div
        className="absolute top-4 left-4 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src={logo} alt="Logo" className="h-16 w-auto" />
      </div>

      {/* Left Side Form */}
      <div className="w-1/2 flex items-center justify-center bg-blue-300">
        <div className="w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Reset Password
          </h2>

          {!emailVerified ? (
            <form onSubmit={handleVerifyEmail}>
              <p className="text-gray-600 text-center mb-4">
                Enter your email to reset your password.
              </p>
              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
              >
                Verify Email
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <p className="text-gray-600 text-center mb-4">
                Email verified! Enter a new password.
              </p>
              <div className="mb-4">
                <label className="block text-gray-600 mb-1">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
              >
                Reset Password
              </button>
            </form>
          )}

          <p className="mt-4 text-center text-gray-500">
            Remember your password?{" "}
            <span
              onClick={() => navigate("/auth")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Sign In
            </span>
          </p>
        </div>
      </div>

      {/* Right Side Image */}
      <div className="w-1/2 hidden md:block">
        <img
          src="https://www.theeventplannerexpo.com/wp-content/uploads/2023/12/alexandre-pellaes-6vAjp0pscX0-unsplash.jpg"
          alt="Event Planning"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
