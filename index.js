const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const token = process.env.TOKEN;
const webAppUrl = 'https://main--tg-webapp-store.netlify.app/';
const express = require('express');
const cors = require('cors');
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

const app = express();  

app.use(express.json());
app.use(cors());

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if(text === '/start') {
        // await bot.sendMessage(chatId, 'Click button to fill the form', {
        //     reply_markup: {
        //         keyboard: [
        //             [{text: 'Fill Form', web_app: {url: webAppUrl + '/form'}}]
        //         ]
        //     }
        // })

        // await bot.sendMessage(chatId, 'Click button to fill the form', {
        //     reply_markup: {
        //         inline_keyboard: [
        //             [{text: 'Fill Form', web_app: {url: webAppUrl + '/form'}}]
        //         ]
        //     }
        // })

        await bot.sendMessage(chatId, 'Make a order', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Order', web_app: {url: webAppUrl}}]
                ]
            }
        })
    }

    // if(msg?.web_app_data?.data) {
    //     try {
    //         const data = JSON.parse(msg?.web_app_data?.data)
    //         console.log(data)
    //         await bot.sendMessage(chatId, 'Thank you for callback!')
    //         await bot.sendMessage(chatId, 'Country: ' + data?.country);
    //         await bot.sendMessage(chatId, 'Street: ' + data?.street);

    //         setTimeout(async () => {
    //             await bot.sendMessage(chatId, 'Info will be posted in this chat');
    //         }, 3000)
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }
});

app.post('/web-data', async (req, res) => {
    const {queryId, products = [], totalPrice} = req.body;
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: {
                message_text: ` Поздравляю с покупкой, вы приобрели товар на сумму ${totalPrice}, ${products.map(item => item.title).join(', ')}`
            }
        })
        return res.status(200).json({});
    } catch (e) {
        return res.status(500).json({})
    }
})

const PORT = 8000;
app.listen(PORT, () => console.log('Server is running on port ' + PORT));
