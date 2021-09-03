var express = require('express');
const aposToLexForm = require('apos-to-lex-form');
const natural = require('natural');
const SpellCorrector = require('spelling-corrector');
const SW = require('stopword');
const {spawn} = require('child_process');
const { WordTokenizer } = natural;
const { SentimentAnalyzer, PorterStemmer } = natural;
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
  //const childPython = spawn('python', ['--version'])
  const childPython = spawn('python', ['./routes/index.py', ])
  var review = ''
  childPython.stdout.on('data', (data)=>{
    review = `stderr: ${data}`
    const lexedReview = aposToLexForm(review);
    const casedReview = lexedReview.toLowerCase();
    const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');
    console.log('hello')
    const { WordTokenizer } = natural;
    const tokenizer = new WordTokenizer();
    const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);
    tokenizedReview.forEach((word, index) => {
      tokenizedReview[index] = spellCorrector.correct(word);
    })
    console.log('hello 2')
    const filteredReview = SW.removeStopwords(tokenizedReview);
    const { SentimentAnalyzer, PorterStemmer } = natural;
    const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
    const analysis = analyzer.getSentiment(filteredReview);
    
    console.log(analysis)
    console.log(review)
  })
  

 childPython.stderr.on('data', (data)=>{
   console.log(`stderr: ${data}`)
 })
 childPython.on('close', (code)=>{
   console.log(`child proece exited with ${code}`)
 })
}) 


module.exports = router;
