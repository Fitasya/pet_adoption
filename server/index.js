const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Connect to Laragon MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'pet_adoption',
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error('MySQL Connection Error:', err);
  } else {
    console.log('Connected to Laragon MySQL Database');
  }
});

app.get('/api/pets', (req, res) => {
  db.query('SELECT * FROM pets ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// POST endpoint using Multer single file upload
app.post('/api/pets', upload.single('image'), (req, res) => {
  const { name, breed, description } = req.body;
  if (!req.file) return res.status(400).json({ error: 'Image file required' });

  // Full URL saved to MySQL (e.g., http://localhost:5000/uploads/1712345-dog.jpg)
  const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

  const sql = 'INSERT INTO pets (name, breed, imageUrl, description) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, breed, imageUrl, description], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({
      id: result.insertId.toString(),
      name,
      breed,
      imageUrl,
      description,
    });
  });
});

// DELETE endpoint
app.delete('/api/pets/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM pets WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Pet deleted successfully' });
  });
});

const bcrypt = require('bcryptjs');

// Signup Endpoint
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Normalize inputs before processing
  const normalizedName = name.trim().toUpperCase();
  const normalizedEmail = email.trim().toLowerCase();
if (!normalizedEmail.endsWith('.com')) {
    return res.status(400).json({ error: 'Email is invalid' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';

    db.query(sql, [normalizedName, normalizedEmail, hashedPassword, 'applicant'], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'Email already exists' });
        }
        return res.status(500).json(err);
      }

      res.json({
        id: result.insertId.toString(),
        name: normalizedName,
        email: normalizedEmail,
        role: 'applicant',
      });
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error hashing password' });
  }
});

// Login Endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    });
  });
});

app.post('/api/requests', (req, res) => {
  const { applicantName, email, petId, petName, reason } = req.body;

  const sql = `
    INSERT INTO requests (applicantName, email, petId, petName, reason, status)
    VALUES (?, ?, ?, ?, ?, 'pending')
  `;

  db.query(sql, [applicantName, email, petId, petName, reason], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }

  const newRequest = {
  id: `req-${result.insertId}`,
  applicantName,
  email,
  petId,
  petName,
  reason,
  status: 'pending',
  submittedAt: new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }),
};

    res.status(201).json(newRequest);
  });
});


app.get('/api/requests', (req, res) => {
  const sql = "SELECT *, DATE_FORMAT(submittedAt, '%d/%m/%y') AS submittedAt FROM requests WHERE status != 'cancelled' ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching requests:', err);
      return res.status(500).json(err);
    }
    res.json(results);
  });
});

app.put('/api/requests/:id', (req, res) => {
  const { id } = req.params;
  const { applicantName, email, petId, petName, reason, status } = req.body;

  const sql = `
    UPDATE requests 
    SET applicantName = ?, email = ?, petId = ?, petName = ?, reason = ?, status = ? 
    WHERE id = ?
  `;

  db.query(sql, [applicantName, email, petId, petName, reason, status, id], (err, result) => {
    if (err) {
      console.error('Error updating request:', err);
      return res.status(500).json(err);
    }

    res.json({ message: 'Request updated successfully' });
  });
});

app.delete('/api/requests/:id', (req, res) => {
  const { id } = req.params;

  const sql = "UPDATE requests SET status = 'cancelled' WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error cancelling request:', err);
      return res.status(500).json(err);
    }

    res.json({ message: 'Request cancelled successfully' });
  });
});

app.patch('/api/requests/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql = 'UPDATE requests SET status = ? WHERE id = ?';

  db.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error('Error updating status:', err);
      return res.status(500).json(err);
    }

    res.json({ message: 'Status updated successfully' });
  });
});

app.listen(5000, () => console.log('API running on http://localhost:5000'));