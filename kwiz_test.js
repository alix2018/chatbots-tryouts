const Telegraf = require('telegraf')
const Kwiz = require('kwiz')

const quizDefinition = {
  questions: [
    {message: 'Hi! What is your name?', answer: {type: 'string', id: 'name'}},
    {message: 'how old are you?', answer: {type: 'int', id: 'age'}},
    {message: 'are you sure?', answer: {type: 'truthy', hint: 'Yes or No', id: 'sure'}},
    {message: 'The quizz is complete'}
  ]
}

const bot = new Telegraf("371748557:AAENQFq2j9ElnjAhBIkQETukcUj-lIjTbpE")
bot.use(Telegraf.memorySession())

const quiz = new Kwiz(quizDefinition)
var answer = new String()
var question = 0
var nbQ = 3


bot.command('start', (ctx) => {
  quiz.start()
    .then((reply) => {
      //console.log(quiz)

      // display the first question
      console.log('Q:', quiz.quiz.questions[question].message)
      ctx.reply(quiz.quiz.questions[question].message)

      // when the user write a message
      bot.on('message', (ctx) => {

        console.log('message:', [ctx.update.message.text])
        answer = ctx.update.message.text


        quiz.processMessage(answer)
          .then((reply) => {
            console.log('State:', quiz.getState())
            question = question+1

            if (quiz.isCompleted() || (question == nbQ)) {
              question = 3
              ctx.reply(quiz.quiz.questions[question].message)
            }

            else {
              ctx.reply(quiz.state.answers.name + ', ' + quiz.quiz.questions[question].message)
            }
          })
      })

    .catch((e) => console.log('error:', e))
    /*
    .then((reply) => {
      return quiz.processMessage()
    })
    */

    })
})

//function loop (question) {}*/


bot.startPolling()
