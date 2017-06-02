const Telegraf = require('telegraf')
const app = new Telegraf("371748557:AAENQFq2j9ElnjAhBIkQETukcUj-lIjTbpE")

app.command('start', ({ from, reply }) => {
  console.log('start :', from)
  return reply('Welcome! I\'m a bot')
})
app.hears('Hi', (ctx) => ctx.reply('Hi! How are you?'))
app.hears('Fine' || 'Good' || 'Well', (ctx) => ctx.reply('👍'))
app.startPolling()
