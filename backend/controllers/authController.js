const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Register a new user (still hashed for normal users)
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

    // If no user found:
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // ---- CONDITIONAL CHECK ----
    if (user.role === "admin") {
      // ADMIN user is stored with plain-text password
      if (user.password !== password) {
        return res.status(400).json({ error: "Invalid email or password." });
      }
    } else {
      // Normal user => do bcrypt compare
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid email or password." });
      }
    }
    // ----------------------------

    // If we get here, the password matched
    const token = jwt.sign(
      { userId: user._id, role: user.role, name: user.name },
      "your_secret_key",
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        university: user.university,
        interests: user.interests || [],
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Update interests
exports.updateInterests = async (req, res) => {
  try {
    const { email, interests } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.interests = interests;
    await user.save();
    res.json(user);
  } catch (error) {
    console.error("Error updating interests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.user; 
    const user = await User.findById(userId).populate("registeredEvents");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
