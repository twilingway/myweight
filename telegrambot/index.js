// const { Router } = require('express');
const TelegtamBot = require('node-telegram-bot-api');
const config = require('config');
const { logStart, getChatId } = require('./helper');

const TOKEN = config.get('telegramToken');
const YKassaToken = config.get('YKassaToken');

logStart();

const debug = (obj = {}) => {
  return JSON.stringify(obj, null, 4);
};

const bot = new TelegtamBot(TOKEN, {
  polling: {
    interval: 300,
    autoStart: true,
    params: {
      timeout: 10,
    },
  },
});

bot.on('message', (msg) => {
  switch (msg.text) {
  }
});

// /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    getChatId(msg),
    `Здравствуйте, ${msg.from.first_name}\nВыберите команду для начала работы:`,
    { reply_markup: {} }
  );
});

bot.onText(/\/pay1/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendInvoice(
    chatId,
    'Подписка на сервис',
    'Месячная подписка на сервис мой вес',
    'payload',
    kassaToken,
    'SOME_RANDOM_STRING_KEY',
    'RUB',
    [
      {
        label: 'Подписка на сервис',
        amount: 30000,
      },
    ],
    {
      photo_url: 'http://photo.sportcom.ru/images/full/70441.jpeg',
      need_name: true,
      need_phone_number: true,
    }
  );
});

bot.onText(/\/help (.+)/, (msg, [source, match]) => {
  const { id } = msg.chat;
  bot.sendMessage(id, debug(match));
});

bot.on('message', (msg) => {
  const { id } = msg.chat;
  const html = `<strong>Hello, ${msg.from.first_name}</strong>
          <pre>${debug(msg)}</pre>`;
  bot.sendMessage(id, 'Закрываю клавиатуру', {});
});

// bot.on('message', (msg) => {
//   const { id } = msg.chat;
//   //   const html = `<strong>Hello, ${msg.from.first_name}</strong>
//   //   <pre>${debug(msg)}</pre>`;
//   if (msg.text === 'Закрыть') {
//     bot.sendMessage(id, 'Закрываю клавиатуру', {
//       reply_markup: {
//         remove_keyboard: true,
//       },
//     });
//   } else if (msg.text === 'Ответить') {
//     bot.sendMessage(id, 'Отвечаю', {
//       reply_markup: {
//         force_reply: true,
//       },
//     });
//   } else {
//     bot.sendMessage(id, 'Клавиатура', {
//       parse_mode: 'HTML',
//       disable_web_page_preview: true,
//       disable_notification: true,
//       reply_markup: {
//         remove_keyboard: true,
//         // keyboard: [
//         //   [{ text: 'Отправить место положение', request_location: true }],
//         //   ['Ответить', 'Закрыть'],
//         //   [{ text: 'Отправить контакт', request_contact: true }],
//         // ],
//         // one_time_keyboard: true,
//         inline_keyboard: [
//           [
//             {
//               text: 'Отправить место положение',
//               url: 'https://google.com',
//             },
//           ],
//           [
//             {
//               text: 'Reply',
//               callback_data: 'reply',
//             },
//             {
//               text: 'Forward',
//               callback_data: 'forward',
//             },
//           ],
//         ],
//       },
//     });
//   }
// });

// bot.on('callback_query', (query) => {
//   bot.sendMessage(query.message.chat.id, debug(query));
// });

// bot.on('inline_query', (query) => {
//   const results = [];

//   for (let i = 0; i < 5; i++) {
//     results.push({
//       type: 'article',
//       id: i.toString(),
//       title: 'Title ' + i,
//       input_message_content: {
//         message_text: `Article ${i}`,
//       },
//     });
//   }
//   bot.answerInlineQuery(query.id, results, {
//     cache_time: 0,
//   });
// });

module.exports = bot;
