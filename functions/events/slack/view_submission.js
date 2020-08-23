const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
"use strict";
const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");

/**
* An HTTP endpoint that acts as a webhook for Slack view_submission event
* @param {object} event
* @returns {object} result Your return value
*/

module.exports = async (event) => {
  
  let aff = [
    "\"Whatever you did today is enough. Whatever you felt today is valid. Whatever you thought today isn’t to be judged. Repeat the above each day.\" – Brittany Burgunder",
    "\"Failure is just another way to learn how to do something right,\" - Marian Wright Edelman",
    "\"Encourage yourself, believe in yourself, and love yourself. Never doubt who you are.\" – Stephanie Lahart",
    "\"You alone are enough. You have nothing to prove to anybody.\" – Maya Angelou",
    "\"Nothing is impossible. The word itself says 'I’m possible!',\" - Audrey Hepburn",
    "“Always remember that you are absolutely unique. Just like everyone else.” – Margaret Mead",
    "\"Am I good enough? Yes I am,\" - Michelle Obama",
    "\"I exist as I am, that is enough.\" – Walt Whitman",
    "\"Your perspective is unique. It’s important and it counts,” - Glenn Close",
    "\"You must do the things you think you cannot do,\" - Eleanor Roosevelt"
  ];
  
  let en = [
    "“Be happy with what you have while working for what you want.” - Helen Keller",
    "“No great achievement is possible without persistent work.” ―Bertrand Russell",
    "“Celebrate what you’ve accomplished, but raise the bar a little higher each time you succeed.” – Mia Hamm",
    "“The best thing to do now, is to do the very best you can.” - Allen Drury",
    "\"Whoever is happy will make others happy too.\" – Anne Frank",
    "“Success is the sum of small efforts repeated day in and day out.” —Robert Collier",
    "“Talent means nothing, while experience, acquired in humility and with hard work, means everything.” – Patrick Suskind",
    "“Remember to celebrate milestones as you prepare for the road ahead.” – Nelson Mandela",
    "“The more you praise and celebrate your life, the more there is in life to celebrate.” –  Oprah Winfrey",
    "“Celebrate your life, you are your own light.” - Lailah Gifty Akita"
  ];
  
  const key = process.env.MS_KEY;
  const endpoint = process.env.MS_ENDPOINT;
  
  let emotionState = event.view.state.values['input-emotion'];
  let characteristicState = event.view.state.values['input-characteristic'];
  
  let emotion = emotionState[Object.keys(emotionState)[0]].value;
  let characteristic = characteristicState[Object.keys(characteristicState)[0]].value;
  
  const textAnalyticsClient = new TextAnalyticsClient(endpoint,  new AzureKeyCredential(key));
  
  
  const sentimentInputEmotion = [ emotion ];
  const sentimentResultEmotion = await textAnalyticsClient.analyzeSentiment(sentimentInputEmotion);
  
  const sentimentInputChar = [ characteristic ];
  const sentimentResultChar = await textAnalyticsClient.analyzeSentiment(sentimentInputChar);
  
  let em = '';
  sentimentResultEmotion.forEach(document => {
    console.log(`\tDocument Sentiment: ${document.sentiment}`);
    em = `${document.sentiment}`;
  });
  
  let ch = '';
  sentimentResultChar.forEach(document => {
    console.log(`\tDocument Sentiment: ${document.sentiment}`);
    ch = `${document.sentiment}`;
  });
  
  let r = Math.floor(Math.random() * 10) + 1;
  let a = aff[r];
  let e = en[r];

  
  if(ch === 'negative') {
    await lib.slack.messages['@0.6.1'].create({
      id: `${event.user.id}`,
      text: `${a}`
    });
  } else {
    if(em === 'positive') {
      await lib.slack.messages['@0.6.1'].create({
        id: `${event.user.id}`,
        text: `${characteristic}`
      });
    } else {
      await lib.slack.messages['@0.6.1'].create({
        id: `${event.user.id}`,
        text: `${characteristic}\n${e}`
      });
    }
  }
  
};
