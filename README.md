# Telegram Chatbot

Bot Telegram name: \@StephAlixBot
To launch the node.js server: node chatbot1.js
For the quizz bot: node kwiz_test.js

# Microsoft Bot Framework Emulator

Install the Emulator
Launch the server : node node_bot/index.js

With Telegram:
\- Install ngrok
\- Run this command: ./ngrok http -host-header=rewrite 3978
\- Comfigure the messaging endpoint on the Microsoft Portal
\- Enable inline queries for the bot: /setinline command (to the BotFather)
\- Launch the server: node node_bot/app.js
