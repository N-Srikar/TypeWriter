const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const TestResult = require('../models/TestResult');

router.post('/', auth, async (req, res) => {
  try {
    const testResult = new TestResult({
      user: req.user.id,
      ...req.body
    });
    await testResult.save();
    res.status(201).json(testResult);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/stats', auth, async (req, res) => {
  try {
    const { testType, testOption } = req.query;
    const optionNumber = parseInt(testOption, 10);

    const aggregation = [
      { 
        $match: { 
          user: req.user._id,
          testType: testType,
          testOption: optionNumber
        } 
      },
      { $sort: { date: -1 } }, // Sort by newest first
      {
        $facet: {
          allResults: [
            // Get all results for best WPM calculation
            { $group: { 
              _id: null, 
              bestWpm: { $max: "$wpm" },
              testsCompleted: { $sum: 1 }
            }}
          ],
          latest10: [
            // Get last 10 results for averages
            { $limit: 10 },
            { $group: {
              _id: null,
              averageWpm: { $avg: "$wpm" },
              averageAccuracy: { $avg: "$accuracy" }
            }}
          ],
          history: [
            // Get last 10 results for display
            { $limit: 10 },
            { $project: {
              _id: 0,
              wpm: 1,
              accuracy: 1,
              testType: 1,
              testOption: 1,
              date: 1
            }}
          ]
        }
      },
      {
        $project: {
          testsCompleted: { $arrayElemAt: ["$allResults.testsCompleted", 0] },
          bestWpm: { $arrayElemAt: ["$allResults.bestWpm", 0] },
          averageWpm: { $arrayElemAt: ["$latest10.averageWpm", 0] },
          averageAccuracy: { $arrayElemAt: ["$latest10.averageAccuracy", 0] },
          history: 1
        }
      },
      {
        $project: {
          testsCompleted: { $ifNull: ["$testsCompleted", 0] },
          bestWpm: { $ifNull: ["$bestWpm", 0] },
          averageWpm: { $ifNull: [{ $round: ["$averageWpm", 1] }, 0] },
          averageAccuracy: { $ifNull: [{ $round: ["$averageAccuracy", 1] }, 0] },
          history: 1
        }
      }
    ];

    const [result] = await TestResult.aggregate(aggregation);
    res.json(result || {
      testsCompleted: 0,
      bestWpm: 0,
      averageWpm: 0,
      averageAccuracy: 0,
      history: []
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;