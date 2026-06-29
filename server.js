const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Import shared database
const bookings = require('./bookings');

// Import Admin Routes
const adminRoutes = require('./admin/adminRoutes');
app.use('/api/admin', adminRoutes);

// Customer Menu Data
const menuData = [
  {
    category: "All Time Favourites",
    items: [
      { name: "Bun Maska", price: "₹70", desc: "Classic soft bun slathered with fresh butter" },
      { name: "Butter Toast", price: "₹108", desc: "Crispy toasted bread with rich butter" },
      { name: "Poha", price: "₹126", desc: "Light, fluffy flattened rice with mustard seeds" },
      { name: "Samosa (2 pieces)", price: "₹126", desc: "Crispy golden pastry filled with spiced potatoes" },
      { name: "Bun Samosa", price: "₹90", desc: "Spiced samosa pressed inside a soft, buttered bun" }
    ]
  },
  {
    category: "Pizza, Burger & Sides",
    items: [
      { name: "Classic Veg Burger", price: "₹95", desc: "Crispy patty topped with fresh lettuce and mayo" },
      { name: "Cheese Melt Burger", price: "₹130", desc: "Burger overflowing with warm melted cheese sauce" },
      { name: "Classic Margherita Pizza", price: "₹215 / ₹255", desc: "Thin crust with aromatic marinara and fresh cheese" },
      { name: "Creamy White Pasta", price: "₹240", desc: "Penne tossed in a rich, buttery, pepper-spiced white sauce" }
    ]
  }
];

// Serve menu data to frontend
app.get('/api/menu', (req, res) => {
  res.json(menuData);
});

// Customer booking collection endpoint
app.post('/api/reserve', (req, res) => {
  const { name, phone, guests, date, time, notes } = req.body;
  
  if (!name || !phone || !guests || !date || !time) {
    return res.status(400).json({ success: false, message: "Please fill in all required fields." });
  }

  const newReservation = {
    id: Date.now(), // Generate unique numeric identifier
    name,
    phone,
    guests,
    date,
    time,
    notes: notes || "No custom note",
    status: 'Pending'
  };

  bookings.push(newReservation);
  res.status(200).json({ 
    success: true, 
    message: `Thank you, ${name}! Your table inquiry has been received.` 
  });
});

// Main routes fallbacks
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`Bistro System Activated.`);
  console.log(`User Site URL:   http://localhost:${PORT}`);
  console.log(`Admin Portal:    http://localhost:${PORT}/admin`);
  console.log(`======================================================\n`);
});