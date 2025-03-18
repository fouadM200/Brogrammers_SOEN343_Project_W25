import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleVerifyEmail = (e) => {
    e.preventDefault();
    
    // Retrieve stored users from localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if email exists
    const userExists = users.some(user => user.email === email.trim().toLowerCase());

    if (!userExists) {
      alert("No account found with this email.");
      return;
    }

    // If email exists, enable password reset fields
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

    // Retrieve users from localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Update the user's password
    users = users.map(user => 
      user.email === email.trim().toLowerCase() ? { ...user, password } : user
    );

    // Save updated users back to localStorage
    localStorage.setItem("users", JSON.stringify(users));

    alert("Password successfully reset! You can now log in.");
    navigate("/auth");
  };

  return (
    <div className="flex h-screen justify-center items-center bg-blue-200 relative">
      {/* Logo - Clickable, Redirects to Home */}
      <div 
        className="absolute top-4 left-4 cursor-pointer text-2xl font-bold text-black"
        onClick={() => navigate("/")}
      >
        Logo
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>

        {!emailVerified ? (
          // Step 1: Verify Email
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
          // Step 2: Reset Password
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
              className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700"
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
  );
};

export default ForgotPassword;
