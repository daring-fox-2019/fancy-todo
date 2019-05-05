const chai = require('chai')
const chaiHttp = require('chai-http')
const dirtyChai = require('dirty-chai')
const chaiDatetime = require('chai-datetime')
const faker = require('faker')

const app = require('../app')
const helpers = require('./helpers')

const expect = chai.expect

chai.use(chaiHttp)
chai.use(dirtyChai)
chai.use(chaiDatetime)

describe('Todos Tests', function () {
  before(function (done) {
    helpers.createUser()
      .then(user => {
        this.user = user
        this.user.token = helpers.createToken(user)
        return helpers.createTodo({ authorId: this.user._id })
      })
      .then(todo => {
        this.user.todo = todo
        done()
      })
      .catch(done)
  })
  before(function (done) {
    helpers.createUser()
      .then(user => {
        this.otherUser = user
        this.otherUser.token = helpers.createToken(user)
        done()
      })
  })
  after(helpers.clearDb('UserModel', 'TodoModel'))

  const Todo = function () {
    return {
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      dueDate: faker.date.future()
    }
  }

  let createdTodo = new Todo()
  let updatedTodo = new Todo()

  describe('GET /todos', function () {
    it('should send an object with 200 status code', function (done) {
      chai
        .request(app)
        .get('/todos')
        .set('Authorization', this.user.token)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(200)

          let body = res.body
          expect(body).to.be.an('object')
          expect(body).to.have.property('todos')

          let todos = body.todos
          expect(todos).to.be.an('array')
          done()
        })
    })
  })

  describe('GET /todos/:todo_id', function () {
    it('should send an object with 200 status code', function (done) {
      chai
        .request(app)
        .get(`/todos/${this.user.todo.id}`)
        .set('Authorization', this.user.token)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(200)

          let body = res.body
          expect(body).to.be.an('object')
          expect(body).to.have.property('todo')

          let todo = body.todo
          expect(todo).to.be.an('object')
          expect(todo).to.have.property('_id')
          expect(todo).to.have.property('title')
          expect(todo).to.have.property('description')
          expect(todo).to.have.property('status')
          expect(todo).to.have.property('dueDate')
          expect(todo).to.have.property('authorId')
          expect(todo._id).to.equal(this.user.todo.id)
          expect(todo.title).to.equal(this.user.todo.title)
          expect(todo.description).to.equal(this.user.todo.description)
          expect(todo.status).to.equal('ongoing')
          expect(new Date(todo.dueDate)).to.equalDate(this.user.todo.dueDate)
          expect(todo.authorId).to.equal(this.user.id)
          done()
        })
    })

    it('should send an object with 404 status code', function (done) {
      chai
        .request(app)
        .get(`/todos/${this.user.todo.id}`)
        .set('Authorization', this.otherUser.token)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(404)

          let body = res.body
          expect(body).to.be.an('object')
          expect(body).to.have.property('message')

          let message = body.message
          expect(message).to.be.a('string')
          expect(message).to.equal('Todo Not Found')
          done()
        })
    })
  })

  describe('POST /todos', function () {
    it('should send an object with 201 status code', function (done) {
      chai
        .request(app)
        .post('/todos')
        .set('Authorization', this.user.token)
        .send({
          title: createdTodo.title,
          description: createdTodo.description,
          dueDate: createdTodo.dueDate
        })
        .end((err, res) => {
          expect(err).to.be.a('null')
          expect(res).to.have.status(201)

          let body = res.body
          expect(body).to.be.an('object')
          expect(body).to.have.property('todo')

          let todo = body.todo
          expect(todo).to.be.an('object')
          expect(todo).to.have.property('_id')
          expect(todo).to.have.property('title')
          expect(todo).to.have.property('description')
          expect(todo).to.have.property('status')
          expect(todo).to.have.property('dueDate')
          expect(todo).to.have.property('authorId')
          expect(todo.title).to.equal(createdTodo.title)
          expect(todo.description).to.equal(createdTodo.description)
          expect(todo.status).to.equal('ongoing')
          expect(new Date(todo.dueDate)).to.equalDate(createdTodo.dueDate)
          expect(todo.authorId).to.equal(this.user.id)
          done()
        })
    })
  })

  describe('PUT /todos/:todo_id', function () {
    it('should send an object with 200 status code', function (done) {
      chai
        .request(app)
        .put(`/todos/${this.user.todo.id}`)
        .set('Authorization', this.user.token)
        .send({
          title: updatedTodo.title,
          description: updatedTodo.description,
          dueDate: updatedTodo.dueDate,
          status: 'done'
        })
        .end((err, res) => {
          expect(err).to.be.a('null')
          expect(res).to.have.status(200)

          let body = res.body
          expect(body).to.be.an('object')
          expect(body).to.have.property('todo')

          let todo = body.todo
          expect(todo).to.have.property('_id')
          expect(todo).to.have.property('title')
          expect(todo).to.have.property('description')
          expect(todo).to.have.property('status')
          expect(todo).to.have.property('dueDate')
          expect(todo).to.have.property('authorId')
          expect(todo._id).to.equal(this.user.todo.id)
          expect(todo.title).to.equal(updatedTodo.title)
          expect(todo.description).to.equal(updatedTodo.description)
          expect(todo.status).to.equal('done')
          expect(new Date(todo.dueDate)).to.equalDate(updatedTodo.dueDate)
          expect(todo.authorId).to.equal(this.user.id)
          done()
        })
    })

    it('should send an object with 404 status code', function (done) {
      chai
        .request(app)
        .put(`/todos/${this.user.todo.id}`)
        .set('Authorization', this.otherUser.token)
        .end((err, res) => {
          expect(err).to.be.a('null')
          expect(res).to.have.status(404)

          let body = res.body
          expect(body).to.be.an('object')
          expect(body).to.have.property('message')

          let message = body.message
          expect(message).to.be.a('string')
          expect(message).to.equal('Todo Not Found')
          done()
        })
    })
  })

  describe('DELETE /todos/:todo_id', function () {
    it('should send an object with 200 status code', function (done) {
      chai
        .request(app)
        .delete(`/todos/${this.user.todo.id}`)
        .set('Authorization', this.user.token)
        .end((err, res) => {
          expect(err).to.be.a('null')
          expect(res).to.have.status(200)

          let body = res.body
          expect(body).to.be.an('object')
          expect(body).to.have.property('todo')

          let todo = body.todo
          expect(todo).to.be.an('object')
          expect(todo).to.have.property('_id')
          expect(todo._id).to.equal(this.user.todo.id)
          done()
        })
    })

    it('should send an object with 404 status code', function (done) {
      chai
        .request(app)
        .delete(`/todos/${this.user.todo.id}`)
        .set('Authorization', this.otherUser.token)
        .end((err, res) => {
          expect(err).to.be.a('null')
          expect(res).to.have.status(404)

          let body = res.body
          expect(body).to.be.an('object')
          expect(body).to.have.property('message')

          let message = body.message
          expect(message).to.be.a('string')
          expect(message).to.equal('Todo Not Found')
          done()
        })
    })
  })
})
