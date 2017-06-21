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
var result = new String()
var id = new String()
var question = 0
var nbQ = 3
loop = 1

// The quizz start when the user writes the command: /start
bot.command('start', (ctx) => {
  quiz.start()
    .then((reply) => {
      //console.log(quiz)

      // Display the first question
      console.log('Q:', quiz.quiz.questions[question].message)
      ctx.reply(quiz.quiz.questions[question].message)

      // When the user writes a message, the event "message" is triggered
      bot.on('message', (ctx) => {

        console.log('message:', [ctx.update.message.text])
        answer = ctx.update.message.text

        quiz.processMessage(answer)
          .then((reply) => {
            console.log('State:', quiz.getState())
            question++

            // When the quizz is finished
            if (quiz.isCompleted() || (question == nbQ)) {
              if (loop == 1) {
                loop = 0
                result = 'Ok, thank you for your answers! To sum up:\n'
                for (var i = 0; i < nbQ; i++) {
                  //console.log('state:', quiz)
                  id = quiz.quiz.questions[i].answer.id
                  result += id + ': ' + quiz.state.answers[id] + '\n'
                }
                ctx.reply(result)

              }

              else {
                question = nbQ

                  ctx.reply(quiz.quiz.questions[question].message)

              }
            }

            // If the quizz is not complete, the bot sends next question
            else {
              ctx.reply(quiz.state.answers.name + ', ' + quiz.quiz.questions[question].message)
            }
          })
      })

    .catch((e) => console.log('error:', e))

    })
})

bot.startPolling()
