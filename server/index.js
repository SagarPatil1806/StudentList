const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

// 1. Initialize Nano with your CouchDB credentials

const nano = require('nano')('http://sagar:sagar@1234@localhost:5984'); 
const dbName = 'students_db';
const db = nano.use(dbName);

// 2. Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// GET ALL STUDENTS (Used by Home.jsx)
app.get('/api/students', async (req, res) => {
    try {
        const result = await db.list({ include_docs: true });
        // Map _id to id so frontend item.id works
        const students = result.rows
            .filter(row => !row.id.startsWith('_design'))
            .map(row => ({
                id: row.doc._id,
                name: row.doc.name,
                email: row.doc.email,
                contact: row.doc.contact
            }));
        res.status(200).json(students); 
    } catch (err) {
        res.status(500).send("Error fetching data");
    }
});

// GET SINGLE STUDENT (Used by View.jsx and Edit mode)
app.get("/api/get/:id", async (req, res) => {
    try {
        const doc = await db.get(req.params.id);
        // Frontend uses resp.data[0], so we return an array
        res.status(200).json([{ id: doc._id, ...doc }]); 
    } catch (err) {
        res.status(404).send("Student not found");
    }
});

// POST (Add Student)
app.post('/api/students', async (req, res) => {
    const { name, email, contact } = req.body;
    try {
        await db.insert({ name, email, contact });
        res.status(200).send("Data inserted successfully");
    } catch (err) {
        res.status(500).send("Error inserting data");
    }
});

// PUT (Update Student)
app.put("/api/update/:id", async (req, res) => {
    const { name, email, contact } = req.body;
    try {
        // Fetch current doc to get the latest _rev (required for updates)
        const doc = await db.get(req.params.id);
        const updatedDoc = { ...doc, name, email, contact };
        await db.insert(updatedDoc); 
        res.status(200).send("Data updated successfully");
    } catch (err) {
        res.status(500).send("Error updating data");
    }
});

// DELETE STUDENT
app.delete("/api/remove/:id", async (req, res) => {
    try {
        const doc = await db.get(req.params.id);
        await db.destroy(req.params.id, doc._rev); // Needs _rev to delete
        res.status(200).send("Data removed successfully");
    } catch (err) {
        res.status(500).send("Error removing data");
    }
});

app.listen(5001, () => {
    console.log("Server running on http://localhost:5001");
});