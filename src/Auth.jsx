import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Auth = ({ onAuth }) => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "organizer",
    university: "", // Only applicable if role is "attendee"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const formattedEmail = formData.email.trim().toLowerCase();
  
    if (isSignUp) {
      if (users.some((user) => user.email.toLowerCase() === formattedEmail)) {
        alert("Email already exists! Please login.");
        return;
      }

      if (formData.role === "attendee" && !formData.university.trim()) {
        alert("University name is required for attendees.");
        return;
      }
  
      users.push({ ...formData, email: formattedEmail });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Sign-up successful! Please log in.");
      setIsSignUp(false);
    } else {
      const user = users.find(
        (u) => u.email.toLowerCase() === formattedEmail && u.password === formData.password
      );
  
      if (!user) {
        alert("Invalid email or password!");
        return;
      }
  
      localStorage.setItem("currentUser", JSON.stringify(user));
      onAuth();
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex h-screen relative">
      {/* Home Icon - Click to go home */}
      <div 
  className="absolute top-4 left-4 cursor-pointer text-2xl font-bold text-black"
  onClick={() => navigate("/")}
>
  Logo
</div>


      {/* Left Section - Form */}
      <div className="w-1/2 flex items-center justify-center bg-blue-200">


        <div className="w-full max-w-md p-8">
          <div className="flex justify-center mb-4">
            {/* Logo */}
            
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            {isSignUp ? "Create an account" : "Sign in to your account"}
          </h2>

          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-600 mb-1">Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            {/* Role selection */}
            {isSignUp && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-600 mb-1">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="organizer">Organizer</option>
                    <option value="attendee">Attendee</option>
                  </select>
                </div>
                {formData.role === "attendee" && (
                  <div className="mb-4">
                    <label className="block text-gray-600 mb-1">University (Required for Attendees)</label>
                    <input
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter university name"
                      required
                    />
                  </div>
                )}
              </>
            )}

            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-gray-600 text-sm">
                <input type="checkbox" className="mr-2" /> Remember me
              </label>
              <span 
  onClick={() => navigate("/forgot-password")} 
  className="text-blue-600 text-sm cursor-pointer hover:underline"
>
  Forgot password?
</span>

            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
            >
              {isSignUp ? "Sign Up" : "Sign in"}
            </button>
          </form>

          {/* Toggle between Sign in / Sign up */}
          <p className="mt-4 text-center text-gray-500">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <span
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              {isSignUp ? " Login" : " Sign Up"}
            </span>
          </p>
        </div>
      </div>

      {/* Right Section - Image */}
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

export default Auth;
