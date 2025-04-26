const Test = require('../models/TestResult');

exports.saveTest = async (req, res) => {
  const { wpm, accuracy, mode, duration } = req.body;
  try {
    const test = await Test.create({ userId: req.user, wpm, accuracy, mode, duration });
    res.status(201).json(test);
  } catch {
    res.status(500).json({ message: "Failed to save test" });
  }
};

exports.getTests = async (req, res) => {
  try {
    const tests = await Test.find({ userId: req.user }).sort({ createdAt: -1 });
    res.json(tests);
  } catch {
    res.status(500).json({ message: "Failed to fetch tests" });
  }
};
