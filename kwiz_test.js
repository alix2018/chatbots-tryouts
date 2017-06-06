const Telegraf = require('telegraf')
const Kwiz = require('kwiz')

const quizDefinition = {
  questions: [
    //{message: 'Hey'},
    {message: 'What is your name?', answer: {type: 'string', id: 'name'}},
    //{message: '{{answers.name}}, how old are you?', answer: {type: 'int', id: 'age'}},
    //{message: '{{answers.name}}, are you sure?', answer: {type: 'truthy', hint: 'Yes or No, {{answers.name}} :)', id: 'sure'}},
    //{message: 'Buy {{answers.name}}'}
  ]
}

const bot = new Telegraf("371748557:AAENQFq2j9ElnjAhBIkQETukcUj-lIjTbpE")
bot.use(Telegraf.memorySession())

const quiz = new Kwiz(quizDefinition)


bot.command('start', (ctx) => {
  quiz.start()
    .then((reply) => {
      console.log(quiz)
      // display the first question
      console.log('Q:', quiz.quiz.questions[0].message)
      ctx.reply(quiz.quiz.questions[0].message)
      //bot.use((ctx) => console.log('ctx:', ctx))
      return quiz.processMessage('John')
    })
    /*
    .then((reply) => {
      return quiz.processMessage()
    })
    */
    .then((reply) => {
      console.log('State:', quiz.getState())
    })
})

//function loop (question) {}*/


bot.startPolling()
