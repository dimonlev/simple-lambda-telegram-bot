# Simple telegram bot. Could be deployed with serverless and AWS Lamda

### How to set Webhook:

> curl --request POST --url https://api.telegram.org/bot<TELEGRAM_TOKEN>/setWebhook --header 'content-type: application/json' --data '{"url": "<LINK_YOU_GET_FROM_SERVERLESS_DEPLOY>"}'
