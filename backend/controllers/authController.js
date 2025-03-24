const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, university } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      university: role === "attendee" ? university : "",
    });

    await newUser.save();
    return res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign({ userId: user._id }, "your_secret_key", {
      expiresIn: "1h",
    });

    return res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        university: user.university,
        interests: user.interests || []
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


exports.updateInterests = async (req, res) => {
  try {
    const { email, interests } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's interests
    user.interests = interests;
    await user.save();

    // Return the updated user
    res.json(user);
  } catch (error) {
    console.error("Error updating interests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};