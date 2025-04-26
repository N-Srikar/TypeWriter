const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  wpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  testType: { type: String, enum: ['time', 'words'], required: true },
  testOption: { type: Number, required: true },
  duration: { type: Number }, // in seconds
  wordCount: { type: Number }, // total words
  date: { type: Date, default: Date.now }
});

testResultSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('TestResult', testResultSchema);