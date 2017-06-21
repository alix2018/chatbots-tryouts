const Telegraf = require('telegraf')
const TelegrafWit = require('telegraf-wit')

const telegraf = new Telegraf("360080455:AAHhxbwQ5BC8BV2Pb46Lb6Pec6WA0GVw7ug")
const wit = new TelegrafWit("CKPMTZNHAYIW3AGP7UDJAJGDP3HYA4UQ")

// When the user sends a text
telegraf.on('text', (ctx) => {
  return wit.meaning(ctx.message.text)
    .then((result) => {

      // reply to user with wit result
      return ctx.reply(JSON.stringify(result, null, 2))
    })
})

telegraf.startPolling()
