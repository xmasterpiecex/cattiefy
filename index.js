require('dotenv').config();
const { default: axios } = require('axios');
const TGBOT = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_BOT;
const bot = new TGBOT(token, { polling: true });

const reqSet = new Set();

bot.on('message', async data => {
  const text = data.text.toLowerCase();
  const chatId = data.chat.id;
  const validText = 'Дай кота'.toLocaleLowerCase();

  if (reqSet.has(chatId)) return;

  switch (text) {
    case validText:
      axios
        .get('https://api.unsplash.com/photos/random', {
          params: {
            client_id: process.env.CLIENT_ID,
            query: 'funny_cats',
            count: '1',
          },
        })
        .then(res => {
          const urlCat = res.data.map(item => {
            return item.urls.small;
          });
          bot.sendPhoto(chatId, ...urlCat);
          reqSet.add(chatId);
          bot.sendMessage(chatId, 'ща ща').then(sentMessage => {
            let timer = 5;
            const intervalId = setInterval(() => {
              timer--;
              if (timer === 0) {
                reqSet.delete(chatId);
                clearInterval(intervalId);
                bot.deleteMessage(chatId, sentMessage.message_id);
              } else {
                const newText = `Во, ля какой ${timer}`;
                bot.editMessageText(newText, {
                  chat_id: chatId,
                  message_id: sentMessage.message_id,
                });
              }
            }, 1000);
          });
        });
      break;
    case '1488':
      bot.sendMessage(chatId, process.env.SECRET_TOKEN); //Don't even think about it
      break;
    default:
      bot.sendMessage(chatId, `Напишите "${validText}" что бы получить котика`);
      break;
  }
});
