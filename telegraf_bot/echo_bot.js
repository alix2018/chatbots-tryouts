const Telegraf = require('telegraf')
const { Markup } = require('telegraf')

const replyOptions = Markup.inlineKeyboard([
  Markup.urlButton('❤️', 'http://telegraf.js.org'),
  Markup.callbackButton('Delele', 'delete')
]).extra()

const bot = new Telegraf("371748557:AAENQFq2j9ElnjAhBIkQETukcUj-lIjTbpE")
bot.on('message', (ctx) => ctx.telegram.sendCopy(ctx.from.id, ctx.message, replyOptions))
bot.action('delete', ({ deleteMessage }) => deleteMessage())
bot.startPolling()
