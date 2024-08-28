const express = require('express');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get } = require('firebase/database');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmjF9NtHMjqpbGHPj97oBnDSs8XYIZCts",
  authDomain: "kiosk-app-162.firebaseapp.com",
  databaseURL: "https://kiosk-app-162-default-rtdb.firebaseio.com",
  projectId: "kiosk-app-162",
  storageBucket: "kiosk-app-162.appspot.com",
  messagingSenderId: "115063990425",
  appId: "1:115063990425:web:5e08f8b54794d08b827008",
  measurementId: "G-R7NGKJWRSW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const server = express();
const port = 3000;

// Middleware to parse JSON requests
server.use(express.json());

// Route to handle login with GET request
server.get('/login', async (req, res) => {
  const { username, password } = req.query; // Get username and password from query parameters

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const userRef = ref(db, `authenticate/${username}`);
    const snapshot = await get(userRef);

    if (snapshot.val() != null) {
      const userData = snapshot.val();
      if (userData === password) {
        return res.json({ success: '00', message: 'Login successful' });
      } else {
        return res.status(401).json({ success: '-1', message: 'Incorrect password' });
      }
    } else {
      return res.status(404).json({ success: '-1', message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching data from Firebase:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
