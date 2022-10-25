import 'source-map-support/register';
import { middyfy } from '@libs/lambda';
import * as dotenv from 'dotenv';
import * as rp from 'request-promise';
import { Event } from 'src/types/event';
dotenv.config();

const {
  PG_HOST,
  PG_DATABASE,
  PG_USERNAME,
  PG_PASSWORD,
  TELEGRAM_URI,
  FORBIDDEN_KEYS_ARRAY,
  CHAT_ID,
} = process.env;

const arrayWords: string[] = JSON.parse(FORBIDDEN_KEYS_ARRAY);

const dbOptions = {
  host: PG_HOST,
  port: 5432,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};

async function sendToUser(chat_id, text) {
  const options = {
    method: 'GET',
    uri: `${TELEGRAM_URI}/sendMessage`,
    qs: {
      chat_id,
      text,
    },
  };

  return rp(options);
}

async function deleteMessage(chat_id, message_id) {
  const options = {
    method: 'GET',
    uri: `${TELEGRAM_URI}/deleteMessage`,
    qs: {
      chat_id,
      message_id,
    },
  };

  return rp(options);
}

// const bot = new Telegraf(BOT_TOKEN, {
//   telegram: { webhookReply: false },
// });

// bot.on('text', (ctx) => {
//   return ctx.reply('Hello from Lambda');
// });
// bot.command('oldschool', (ctx) => ctx.reply('Hello'));
// bot.command('hipster', Telegraf.reply('λ'));
// bot.launch();

const shoppingbot = async (event: Event) => {
  console.log('event: ', event);
  const { body } = event;
  console.log('event.body: ', event.body);
  console.log('body.message: ', body.message);
  console.log('body.message.chat: ', body.message.chat);
  const { chat, text, message_id } = body.message;
  const { message } = body;
  console.log('chat: ', chat);
  console.log('text: ', text);
  console.log('message_id: ', message_id);
  if (text) {
    let responseMessage = '';
    try {
      console.log('text: ', text);
      if (arrayWords.some((word) => text.toLowerCase().indexOf(word) >= 0)) {
        await deleteMessage(chat.id, message_id);
        responseMessage = `Your message id:${message_id} was rejected by the bot.`;
        await sendToUser(chat.id, responseMessage);
      } else {
        responseMessage = `
                    Your message date: ${message.date}\n
                    Your message message_id: ${message.message_id}\n
                    Your message text: ${message.text}\n
                    Your chat id: ${chat.id}\n
                    Your message id: ${message_id}\n
                    was ${text}\n
                  `;
        await sendToUser(CHAT_ID, responseMessage);
      }
    } catch (error) {
      responseMessage = `Input: ${text}, \nError: ${error.message}`;
      await sendToUser(CHAT_ID, responseMessage);
    }
  } else {
    await sendToUser(CHAT_ID, 'Text message is expected.');
  }

  return { statusCode: 200 };
  // return bot.handleUpdate(event);
};

export const main = middyfy(shoppingbot);
