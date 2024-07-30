const mongoose = require('mongoose');

const InteractionSchema = new mongoose.Schema({
    element: Object,
    input: String,
    submittedAt: {
        type: Date,
        default: Date.now,
    },
});

const FormSchema = new mongoose.Schema({
    name: String,
    elements: Array,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    views: {
        type: Number,
        default: 0,
    },
    starts: {
        type: Number,
        default: 0,
    },
    completions: {
        type: Number,
        default: 0,
    },
    interactions: [InteractionSchema],
    completed: { type: Boolean, default: false }
});

const Form = mongoose.model('Form', FormSchema);

module.exports = Form;
