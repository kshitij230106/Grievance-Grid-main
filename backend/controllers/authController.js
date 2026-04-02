const bcrypt = require("bcrypt");
const jwt    = require("jsonwebtoken");
const usersStore = require("../store/usersStore");

const SECRET = "grievancegrid_secret";

// Seed default admin (runs once when server starts)
(async () => {
  const exists = usersStore.find(u => u.email === "admin@grievancegrid.com");
  if (!exists) {
    const hashed = await bcrypt.hash("admin123", 10);
    usersStore.push({
      id: "admin_1",
      name: "Admin",
      email: "admin@grievancegrid.com",
      password: hashed,
      role: "admin",
    });
    console.log("✅ Default admin seeded: admin@grievancegrid.com / admin123");
  }
})();

// POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    if (usersStore.find(u => u.email === email))
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: hashed,
      role: "user",
    };
    usersStore.push(user);

    res.status(201).json({ message: "Registered successfully", user: { name, email } });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

// POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = usersStore.find(u => u.email === email);
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};