# Telegraf Chatbot

\- Go to the [telegram](https://web.telegram.org/#/im) web site <br>
\- Write the bot name in the search bar <br>
\- Telegram Bot name: \@StephAlixBot <br>
\- Directory : telegraf_bot <br>

\- Packages installation:
```
npm install
```
\- To launch the node.js server (just a test):
```
node chatbot1.js
```
\- For the quizz bot (begin with the /start command, ask you some questions and save your answers in a tab):
```
node kwiz_test.js
```
\- For telegraf-wit (just a test with the Wit.ai telegraf library, print the analyzes in the terminal):
```
node wit_bot
```


# Microsoft Bot Framework
**Just echo bots to test the Framework**

\- Directory : microsoft_bot <br>

With Telegram: <br>
\- Telegram Bot name: \@StephNodeBot <br>
\- I can run the local server on the right port and bind it with my Microsoft account and you don't need to do next points, just do:
```
node app.js
```
\- Create a portal account: [dev.botframework](https://dev.botframework.com) <br>
\- Create a bot <br>
\- [Install ngrok](https://ngrok.com) <br>
\- Run this command:
```
./ngrok http -host-header=rewrite 3978
```
\- Copying the https address in the messaging endpoint field: [Microsoft Bot Portal](https://dev.botframework.com) > Your bot > Settings > Messaging endpoint (it should be like this: https://50702548.ngrok.io/api/messages) <br>
\- Allow Telegram app: [Microsoft Bot Portal](https://dev.botframework.com) > Your bot > Channels > Telegram > Access Token = 385941265:AAH8Q__WEUAG-BiPPHABmw2pLJAdYY7cq-U <br>
\- Launch the server:
```
node app.js
```


With the emulator: (not useful)<br>
\- [Install the Emulator](https://emulator.botframework.com/) <br>
\- Create a portal account: [dev.botframework](https://dev.botframework.com) <br>
\- Create a bot <br>
\- Fill out the identification fields on the emulator (Microsoft App ID and Password) <br>
\- Packages installation:
```
npm install
```
\- Launch the server:
```
node app.js
```

# API.ai
**The most interesting bots**



Bot weather: <br>
A bot with a smart conversation for basic sentences. There is a trained agent on my [Api.ai](https://api.ai) account which can give the weather because it detects the context (*the weather*) and the keyword (*the city*). If you don't write the city it'll ask you the question. I used the weather API [Openweathermap](http://openweathermap.org) to retrieve a JSON with all the weather data. <br>

_Telegram bot:_ <br>
The Api.ai agent is bind with the telegram bot thanks to the Node.js SDK and Telegraf. Just simple sentences. <br>
\- Directory : api_bot <br>
\- Telegram Bot name: \@StephApiAiBot <br>
\- Packages installation:
```
npm install
```
\- Weather bot:
```
node telegram_weather_bot.js
```

On Heroku: <br>
Same bot as above but with weather pictures, details, buttons and webviews. <br>
\- Directory : telegram_bot_heroku <br>
\- Telegram Bot name: \@StephApiAiBot <br>
\- Domain name: [guarded-shore-50472](https://guarded-shore-50472.herokuapp.com/) <br>
\- You can talk to the Telegram bot, everything is already configured <br>


_Facebook bot:_ (On Heroku) <br>
 <br>
The Api.ai agent is bind with the Facebook Messenger bot thanks to the Node.js SDK and the FB Bot Framework. <br>
\- Directory : facebook_bot_heroku <br>
\- Facebook Messenger Bot page: https://www.facebook.com/StephChatbot <br>
\- I deployed my app on Heroku <br>
\- Domain name: [immense-tor-25991](https://immense-tor-25991.herokuapp.com/) <br>
\- You can talk to the Facebook bot, everything is already configured <br>


_WeChat bot:_ <br>
With the Node.js Bot Framework [Wechaty](https://github.com/Chatie/wechaty) and the same Api.ai agent. <br>
\- Directory : api_bot <br>
\- Packages installation:
```
npm install
```
\- Weather bot:
```
node wechaty_weather_bot.js
```
\- Scan the QR code with the Wechat bot account (the QR code appears in a new google chrome window and in the terminal) <br>
\- Confirm login to Web Wechat on the mobile <br>
\- Talk to the bot with your Wechat account <br>
