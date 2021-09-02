var express = require('express');
var router = express.Router();
const natural = require('natural');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/anylizer', (req, res)=>{
  const {data} = req.body;
})

module.exports = router;
