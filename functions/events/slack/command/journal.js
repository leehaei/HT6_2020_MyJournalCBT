const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

/**
* An HTTP endpoint that acts as a webhook for Slack command event
* @param {object} event
* @returns {object} result Your return value
*/

module.exports = async (event) => {
  let view = await lib.slack.views['@0.0.3'].open({
    trigger_id: `${event.trigger_id}`,
    view: {
      "type": "modal",
      "title": {
        "type": "plain_text",
        "text": "Journal My Day",
        "emoji": true
      },
      "submit": {
        "type": "plain_text",
        "text": "Save",
        "emoji": true
      },
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "All submissions will be kept anonymous. We do not store any submissions.",
            "emoji": true
          }
        },
        {
          "type": "input",
          "element": {
            "type": "plain_text_input",
            "multiline": true
          },
          "label": {
            "type": "plain_text",
            "text": "Describe the situation",
            "emoji": true
          }
        },
        {
          "type": "input",
          "block_id": "input-emotion",
          "element": {
            "type": "plain_text_input",
            "multiline": true
          },
          "label": {
            "type": "plain_text",
            "text": "How I felt at that time",
            "emoji": true
          }
        },
        {
          "type": "input",
          "block_id": "input-characteristic",
          "element": {
            "type": "plain_text_input",
            "multiline": true
          },
          "label": {
            "type": "plain_text",
            "text": "What positive characteristics did you learn about yourself through this situation?",
            "emoji": true
          }
        }
      ],
      "callback_id": "create-entry",
      "private_metadata": `${event.channel_id}`
    }
  });
  return view;
};
