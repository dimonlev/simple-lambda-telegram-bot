import 'source-map-support/register';
import { middyfy } from '@libs/lambda';
import * as dotenv from 'dotenv';
import { CurrResponse, Currency, Event } from 'src/types/event';
import { fetch } from 'undici'
dotenv.config();

const { TELEGRAM_URI, CURR_LINK } = process.env;

async function getRequest(url: string) {
  const res = await fetch(url);
  return res.json()
}

function sendToUser(chat_id: number, text: string) {
  return `${TELEGRAM_URI}/sendMessage?chat_id=${chat_id}&text=${text}`
}

const shoppingbot = async (event: Event) => {
  console.debug('event: ', event);
  const { body } = event;
  console.debug('event.body: ', event.body);
  const { chat, text, message_id } = body.message;
  const { message } = body;
  console.debug('text: ', text);
  if (text) {
    let responseMessage = '';
    try {
      console.debug('text: ', text);
      const date = new Date().toISOString();
      const finalDate = new Date(Date.now() + 3600*1000*24).toISOString().slice(0,date.indexOf('T'));
      const curr = await getRequest(`${CURR_LINK}${finalDate}`) as CurrResponse[];
        const currencies = curr[0].currencies;
        const codes = [];
        currencies.map((curr: Currency) => codes.push(curr.code));
      if (codes.some(code => code === text.toUpperCase())) {
        const data = currencies.filter((curr: Currency) => curr.code === text.toUpperCase())[0];
        console.debug('data: ', data);
        const responseMessage = `
          Name: ${data.name}%0A
          Currency: ${data.rateFormated}%0A
          Date: ${data.date.slice(0, data.date.length-5).split('T').join(' ')}
          `;
        getRequest(sendToUser(chat.id, responseMessage));
        console.debug('responseMessage: ', responseMessage);
        console.debug('chat.id: ', chat.id);
      } else {
        responseMessage = `Your message date: ${message.date}%0AYour message message_id: ${message.message_id}%0AYour message text: ${message.text}%0AYour chat id: ${chat.id}%0AYour message id: ${message_id}%0Awas ${text}%0Acurr ${currencies}`;
        const response = await getRequest(sendToUser(chat.id, `Available codes: ${codes}`));
        console.debug('response:', response);
      }
    } catch (error) {
      responseMessage = `Input: ${text}, \nError: ${error.message}`;
      await getRequest(sendToUser(chat.id, responseMessage));
    }
  } else {
    await getRequest(sendToUser(chat.id, 'Text message is expected.'));
  }

  return { statusCode: 200 };
};

export const main = middyfy(shoppingbot);
