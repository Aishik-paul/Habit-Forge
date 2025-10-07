const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');


router.get('/', async (req, res) => {
    try {
        const habits = await Habit.find();
        res.json(habits);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, frequency } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const newHabit = new Habit({ title, description, frequency });

        const savedHabit = await newHabit.save();
        res.status(201).json(savedHabit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedHabit = await Habit.findByIdAndDelete(id);
        if (!deletedHabit) {
            return res.status(404).json({ message: "Habit not found" });
        }

        res.json({
            success: true,
            message: "Habit deleted successfully",
        });


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, frequency } = req.body;
        const updatedHabit = await Habit.findByIdAndUpdate(id, { title, description, frequency }, { new: true });

        
        if (!updatedHabit) {
            return res.status(404).json({ message: "Habit not found" });
        }

        res.json(updatedHabit);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;