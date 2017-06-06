const Telegraf = require('telegraf')
const app = new Telegraf("371748557:AAENQFq2j9ElnjAhBIkQETukcUj-lIjTbpE")

const Kwiz = require('kwiz')

const quizDefinition = {
  questions: [
    {message: 'What is your name?', answer: {type: 'string', id:'name'}}
  ]
}

const quiz = new Kwiz(quizDefinition)
  quiz.start()
  .then((reply) => {
    return quiz.processMessage()})

app.startPolling()
