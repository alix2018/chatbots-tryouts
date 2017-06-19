# Telegraf Chatbot

Go to the telegram web site: https://web.telegram.org/#/im <br>
Write the bot name in the search bar <br>
Telegram Bot name: \@StephAlixBot <br>
Directory : telegraf_bot <br>

\- Packages installations : npm install <br>
\- To launch the node.js server: node chatbot1.js (just a test)<br>
\- For the quizz bot: node kwiz_test.js (begin with the /start command, ask you some questions and save your answers in a tab)<br>
\- For telegraf-wit : node wit_bot (just a test with the Wit.ai telegraf library, print the analyzes in the terminal) <br>


# Microsoft Bot Framework
**Just echo bots to test the Framework**

Directory : microsoft_bot <br>

With Telegram: <br>
Telegram Bot name: \@StephNodeBot <br>
I can run the local server on the right port and bind it with my Microsoft account and you don't need to do next points, just do: node app.js <br>
\- Create a portal account: [https://dev.botframework.com](https://dev.botframework.com) <br>
\- Create a bot <br>
\- [Install ngrok](https://ngrok.com) <br>
\- Run this command: ./ngrok http -host-header=rewrite 3978 <br>
\- Copying the https address in the messaging endpoint field: [Microsoft Bot Portal](https://dev.botframework.com) > Your bot > Settings > Messaging endpoint (it should be like this: https://50702548.ngrok.io/api/messages) <br>
\- Allow Telegram app: [Microsoft Bot Portal](https://dev.botframework.com) > Your bot > Channels > Telegram > Access Token = 385941265:AAH8Q__WEUAG-BiPPHABmw2pLJAdYY7cq-U <br>
\- Launch the server: node app.js <br>

With the emulator: (not useful)<br>
\- [Install the Emulator](https://emulator.botframework.com/) <br>
\- Create a portal account: [https://dev.botframework.com](https://dev.botframework.com) <br>
\- Create a bot <br>
\- Fill out the identification fields on the emulator (Microsoft App ID and Password) <br>
\- Packages installations : npm install <br>
\- Launch the server : node app.js <br>

# API.ai
**The most interesting bot**

Directory : api_bot <br>

Bot weather: <br>
A bot with a smart conversation for basic sentences. There is a trained agent on my [Api.ai](https://api.ai) account which can give the weather because it detects the context (*the weather*) and the keyword (*the city*). If you don't write the city it'll ask you the question. I used the weather API [openweathermap](http://openweathermap.org) to retrieve a JSON with all the weather data. <br>

_Telegram bot_
The Api.ai agent is bind with the telegram bot thanks to the Node.js SDK and Telegraf. <br>
\- Telegram Bot name: \@StephApiAiBot <br>
\- Packages installations : npm install <br>
\- Weather bot: node telegram_weather_bot.js <br>

_Facebook bot_
The Api.ai agent is bind with the telegram bot thanks to the Node.js SDK and the FB Bot Framework. <br>
\- Facebook Messenger Bot page:  https://www.facebook.com/StephChatbot <br>
\- I need to run the local server and you just do: node fb_weather_bot.js <br>
