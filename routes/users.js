var express = require('express');
const aposToLexForm = require('apos-to-lex-form');
const natural = require('natural');
const SpellCorrector = require('spelling-corrector');
const SW = require('stopword');
const {spawn} = require('child_process');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();

router.post('/anylizer', (req, res)=>{
  const {review} = req.body;
  const lexedReview = aposToLexForm(review);
  const casedReview = lexedReview.toLowerCase();
  const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');
  
  const { WordTokenizer } = natural;
  const tokenizer = new WordTokenizer();
  const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);
  tokenizedReview.forEach((word, index) => {
    tokenizedReview[index] = spellCorrector.correct(word);
  })
  const filteredReview = SW.removeStopwords(tokenizedReview);
  const { SentimentAnalyzer, PorterStemmer } = natural;
  const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
  const analysis = analyzer.getSentiment(filteredReview);

  res.status(200).json({ analysis });
})

router.get('/live', (req, res)=>{
 console.log("hello you here")
 const { spawn } = require('child_process');
 const pyProg = spawn('python', ['script.py']);

 pyProg.stdout.on('data', function(data) {

     console.log(data.toString());
     res.write(data);
     res.end('end');
 });
 
})

module.exports = router;
