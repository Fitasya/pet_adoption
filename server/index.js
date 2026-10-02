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
  db.query('SELECT * FROM pets WHERE status = "available" ORDER BY id DESC', 
    (err, results) => {
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
  const { id } = req.params; // request id
  const { applicantName, email, petId, petName, reason, status } = req.body;

  const numericId = parseInt(id.replace(/\D/g, ''), 10);

  const sql = `
    UPDATE requests 
    SET applicantName = ?, email = ?, petId = ?, petName = ?, reason = ?, status = ? 
    WHERE id = ?
  `;

  db.query(sql, [applicantName, email, petId, petName, reason, status, numericId], (err, result) => {
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

  // If status is not 'approved', update only the specified request
  if (status !== 'approved') {
    const sql = 'UPDATE requests SET status = ? WHERE id = ?';
    return db.query(sql, [status, id], (err, result) => {
      if (err) {
        console.error('Error updating status:', err);
        return res.status(500).json(err);
      }
      res.json({ message: 'Status updated successfully' });
    });
  }

  // 1. Get the petId for the approved request
  const getPetSql = 'SELECT petId FROM requests WHERE id = ?';

  db.query(getPetSql, [id], (err, results) => {
    if (err || results.length === 0) {
      console.error('Error finding request:', err);
      return res.status(500).json(err || { error: 'Request not found' });
    }

    const petId = results[0].petId;

    // 2. Mark the selected request as approved
    const approveSql = 'UPDATE requests SET status = "approved" WHERE id = ?';

    db.query(approveSql, [id], (err) => {
      if (err) {
        console.error('Error approving request:', err);
        return res.status(500).json(err);
      }

// 3. Find, then reject, all other requests for the same petId
const findOthersSql = 'SELECT id FROM requests WHERE petId = ? AND id != ? AND status = "pending"';

db.query(findOthersSql, [petId, id], (err, others) => {
  if (err) {
    console.error('Error finding other requests:', err);
    return res.status(500).json(err);
  }

  const rejectedIds = others.map((row) => row.id);

  const rejectOthersSql =
    'UPDATE requests SET status = "rejected" WHERE petId = ? AND id != ? AND status = "pending"';

  db.query(rejectOthersSql, [petId, id], (err) => {
    if (err) {
      console.error('Error rejecting other requests:', err);
      return res.status(500).json(err);
    }

    // 4. Update pet status to unavailable
    const updatePetSql = 'UPDATE pets SET status = "unavailable" WHERE id = ?';

    db.query(updatePetSql, [petId], (err) => {
      if (err) {
        console.error('Error updating pet status:', err);
        return res.status(500).json(err);
      }

      res.json({
        message:
          'Request approved, other requests rejected, and pet status updated to unavailable',
        petId,
        rejectedIds,
      });
    });
  });
});
    }); 
  });
});


// change password
app.patch('/api/change-password', async (req, res) => {
  const {email, currentPassword, newPassword} = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }
    const user = results[0];
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const sql = 'UPDATE users SET password = ? WHERE email = ?';
    db.query(sql, [hashedPassword, email], (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Password changed successfully' });
    });
  });
})

// start messaging service

const { createServer } = require('http');
const { WebSocketServer, WebSocket } = require('ws');

const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

const sockets = new Map();         // userId -> that user's open connections
const reviewerSockets = new Set(); // every open connection that belongs to a reviewer

function send(ws, event) {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(event));
}

function deliver(userId, event) {
  const userSockets = sockets.get(userId);
  if (!userSockets) return;
  userSockets.forEach((s) => send(s, event));
}

function deliverToReviewers(event) {
  reviewerSockets.forEach((s) => send(s, event));
}

// a conversation is visible to its applicant and to every reviewer
function deliverToConversation(conversationId, event) {
  deliver(conversationId, event);
  deliverToReviewers(event);
}

function toMessage(row) {
  return {
    id: row.id.toString(),
    conversationId: row.conversationId.toString(),
    fromId: row.fromId.toString(),
    senderName: row.senderName,
    text: row.text,
    sentAt: new Date(row.sentAt).toISOString(),
    readAt: row.readAt ? new Date(row.readAt).toISOString() : null,
  };
}

// applicant: unread messages from the review team (one number, keyed by their own id)
function sendUnreadToApplicant(applicantId) {
  const sql = `
    SELECT COUNT(*) AS count FROM messages
    WHERE conversationId = ? AND fromId != conversationId AND readAt IS NULL
  `;
  db.query(sql, [applicantId], (err, rows) => {
    if (err) {
      console.error('Error counting unread:', err);
      return;
    }
    const n = Number(rows[0].count);
    deliver(applicantId, { type: 'unread', counts: n > 0 ? { [applicantId]: n } : {} });
  });
}

// reviewers: unread applicant messages per conversation (same numbers for the whole team)
function sendUnreadToReviewers() {
  const sql = `
    SELECT conversationId, COUNT(*) AS count FROM messages
    WHERE fromId = conversationId AND readAt IS NULL
    GROUP BY conversationId
  `;
  db.query(sql, (err, rows) => {
    if (err) {
      console.error('Error counting unread:', err);
      return;
    }
    const counts = {};
    rows.forEach((r) => {
      counts[r.conversationId.toString()] = Number(r.count);
    });
    deliverToReviewers({ type: 'unread', counts });
  });
}

wss.on('connection', (ws, req) => {
  const userId = new URL(req.url, 'http://x').searchParams.get('userId');
  if (!userId) return ws.close();

  // find out who this is; the role comes from the database, not the browser
  const userPromise = new Promise((resolve) => {
    db.query('SELECT id, name, role FROM users WHERE id = ?', [userId], (err, rows) => {
      if (err || rows.length === 0) return resolve(null);
      resolve({ id: rows[0].id.toString(), name: rows[0].name, role: rows[0].role });
    });
  });

  userPromise.then((user) => {
    if (!user) return ws.close();

    if (!sockets.has(user.id)) sockets.set(user.id, new Set());
    sockets.get(user.id).add(ws);

    if (user.role === 'reviewer') {
      reviewerSockets.add(ws);
      sendUnreadToReviewers();
    } else {
      sendUnreadToApplicant(user.id);
    }
  });

  ws.on('message', async (raw) => {
    const user = await userPromise;
    if (!user) return;

    let event;
    try {
      event = JSON.parse(raw.toString());
    } catch {
      return;
    }

    // applicants can only use their own conversation; reviewers can use any
    const conversationId =
      user.role === 'applicant' ? user.id : String(event.conversationId);

    if (event.type === 'send' && event.text && event.text.trim()) {
      const text = event.text.trim();
      const sentAt = new Date();

      db.query(
        'INSERT INTO messages (conversationId, fromId, text, sentAt) VALUES (?, ?, ?, ?)',
        [conversationId, user.id, text, sentAt],
        (err, result) => {
          if (err) {
            console.error('Error saving message:', err);
            return;
          }
          const message = {
            id: result.insertId.toString(),
            conversationId,
            fromId: user.id,
            senderName: user.name,
            text,
            sentAt: sentAt.toISOString(),
            readAt: null,
          };
          deliverToConversation(conversationId, { type: 'message', message });

          if (user.role === 'applicant') sendUnreadToReviewers();
          else sendUnreadToApplicant(conversationId);
        }
      );
    }

    if (event.type === 'read') {
      const readAt = new Date();

      // applicant reads the team's messages; a reviewer reads the applicant's messages
      const sql =
        user.role === 'applicant'
          ? 'UPDATE messages SET readAt = ? WHERE conversationId = ? AND fromId != conversationId AND readAt IS NULL'
          : 'UPDATE messages SET readAt = ? WHERE conversationId = ? AND fromId = conversationId AND readAt IS NULL';

      db.query(sql, [readAt, conversationId], (err, result) => {
        if (err) {
          console.error('Error marking messages read:', err);
          return;
        }
        if (result.affectedRows > 0) {
          deliverToConversation(conversationId, {
            type: 'read',
            conversationId,
            readBy: user.role,
            readAt: readAt.toISOString(),
          });

          if (user.role === 'applicant') sendUnreadToApplicant(user.id);
          else sendUnreadToReviewers();
        }
      });
    }
  });

  ws.on('close', () => {
    userPromise.then((user) => {
      if (!user) return;
      sockets.get(user.id).delete(ws);
      reviewerSockets.delete(ws);
    });
  });
});

// all messages in one conversation, with the sender's name
app.get('/api/messages', (req, res) => {
  const sql = `
    SELECT m.*, u.name AS senderName
    FROM messages m
    JOIN users u ON u.id = m.fromId
    WHERE m.conversationId = ?
    ORDER BY m.id ASC
  `;
  db.query(sql, [req.query.conversationId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results.map(toMessage));
  });
});

// user list for the reviewer's picker (no passwords sent)
app.get('/api/users', (req, res) => {
  db.query('SELECT id, name, email, role FROM users', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results.map((u) => ({ ...u, id: u.id.toString() })));
  });
});
// end messaging


server.listen(5000, () => console.log('Server running on port 5000'));