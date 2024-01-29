const { default: axios } = require('axios');
require('dotenv').config();
const TGBOT = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_BOT;
const bot = new TGBOT(token, { polling: true });

bot.on('message', async data => {
  const text = data.text;
  const chatId = data.chat.id;
  const validText = 'к';

  if (text === validText) {
    axios
      .get('https://api.unsplash.com/photos/random', {
        params: {
          client_id: process.env.CLIENT_ID,
          query: 'funny_cat',
          count: '1',
        },
      })
      .then(res => {
        const urlCat = res.data.map(item => {
          return item.urls.small;
        });
        bot.sendPhoto(chatId, ...urlCat);
        bot.sendMessage(chatId, 'ща ща').then(sentMessage => {
          let timer = 5;
          const intervalId = setInterval(() => {
            timer--;
            if (timer === 0) {
              clearInterval(intervalId);
              bot.deleteMessage(chatId, sentMessage.message_id);
            } else {
              const newText = `ВО, ля какой ${timer}`;
              bot.editMessageText(newText, {
                chat_id: chatId,
                message_id: sentMessage.message_id,
              });
            }
          }, 1000);
        });
      });
  } else {
    return bot.sendMessage(
      chatId,
      `Напиши "${validText}" что бы получить котика`
    );
  }
});
