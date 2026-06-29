const express = require('express');
const router = express.Router();
const bookings = require('../bookings');

// Admin Credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'chayugadmin123';
const MOCK_TOKEN = 'chayug_secret_token_2026'; // Simple authentication token

// Middleware to protect routes and verify the Admin Token
function authenticateAdmin(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader === `Bearer ${MOCK_TOKEN}`) {
        next();
    } else {
        res.status(401).json({ success: false, message: "Access Denied: Unauthorized admin request." });
    }
}

// Admin Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        return res.json({ success: true, token: MOCK_TOKEN });
    }
    res.status(401).json({ success: false, message: "Invalid administrator credentials." });
});

// Get all bookings (Protected)
router.get('/reservations', authenticateAdmin, (req, res) => {
    res.json({ success: true, data: bookings });
});

// Delete a single booking (Protected)
router.delete('/reservations/:id', authenticateAdmin, (req, res) => {
    const targetId = parseInt(req.params.id);
    const index = bookings.findIndex(item => item.id === targetId);
    
    if (index !== -1) {
        bookings.splice(index, 1);
        return res.json({ success: true, message: "Reservation deleted successfully." });
    }
    res.status(404).json({ success: false, message: "Reservation not found." });
});

// Clear all bookings (Protected)
router.delete('/reservations-clear', authenticateAdmin, (req, res) => {
    bookings.length = 0; // Truncates the shared array
    res.json({ success: true, message: "All reservation history has been cleared." });
});

module.exports = router;