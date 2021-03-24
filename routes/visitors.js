const express = require('express');
const router = express.Router();

const motorway = require('../common/motorway')


/* GET users listing. */
router.get('/', async function (req, res, next) {
  
  try {
    const visitorsStats = await motorway.getVisitorStats();

    res.send(visitorsStats);
  } catch (err) {
    console.log(err)
  }

});

module.exports = router;
