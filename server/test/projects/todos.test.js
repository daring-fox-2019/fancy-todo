const chai = require('chai')
const chaiHttp = require('chai-http')
const dirtyChai = require('dirty-chai')
const chaiDatetime = require('chai-datetime')

const app = require('../../app')
const helpers = require('../helpers')

const expect = chai.expect

chai.use(chaiHttp)
chai.use(dirtyChai)
chai.use(chaiDatetime)

describe('Project Todo Tests', function () {
  before(function (done) {
    helpers.createUser()
      .then(user => {
        this.user = user
        this.user.token = helpers.createToken(user)
        return helpers.createProject({ managerId: this.user._id })
      })
      .then(project => {
        this.user.project = project
        return helpers.createTodo({ authorId: this.user._id })
      })
      .then(todo => {
        this.todo = todo
        done()
      })
      .catch(done)
  })
  before(function (done) {
    helpers.createUser()
      .then(user => {
        this.otherUser = user
        this.otherUser.token = helpers.createToken(user)
        this.user.project.membersId.push(this.otherUser._id)
        return this.user.project.save()
      })
      .then(project => {
        this.user.project = project
        return helpers.createTodo({ authorId: this.otherUser._id })
      })
      .then(todo => {
        this.otherTodo = todo
        done()
      })
      .catch(done)
  })
  beforeEach(function (done) {
    this.user.project.todosId.push(this.todo._id)
    this.user.project
      .save()
      .then(project => {
        this.user.project = project
        done()
      })
      .catch(done)
  })
  afterEach(function (done) {
    this.user.project.todosId.pull(this.todo._id)
    this.user.project
      .save()
      .then(project => {
        this.user.project = project
        done()
      })
      .catch(done)
  })
  after(helpers.clearDb('UserModel', 'ProjectModel', 'TodoModel'))

  describe('PUT /projects/:project_id/todos', function () {
    it('should send an object with 200 status code', function (done) {
      chai
        .request(app)
        .put(`/projects/${this.user.project.id}/todos`)
        .send({
          todoId: this.todo.id
        })
        .set({
          Authorization: this.user.token
        })
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(200)

          let body = res.body
          expect(body).to.be.an('object')
          expect(body).to.have.property('project')

          let project = body.project
          expect(project).to.have.property('_id')
          expect(project).to.have.property('title')
          expect(project).to.have.property('description')
          expect(project).to.have.property('managerId')
          expect(project).to.have.property('membersId')
          expect(project).to.have.property('todosId')
          expect(project._id).to.equal(this.user.project.id)
          expect(project.title).to.equal(this.user.project.title)
          expect(project.description).to.equal(this.user.project.description)
          expect(project.managerId).to.equal(this.user.id)
          expect(project.membersId).to.have.lengthOf(1)
          expect(project.todosId).to.have.lengthOf(1)
          done()
        })
    })

    it('should send an object with 200 status code', function (done) {
      chai
        .request(app)
        .put(`/projects/${this.user.project.id}/todos`)
        .send({
          todoId: this.todo.id
        })
        .set({
          Authorization: this.user.token
        })
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(200)

          let body = res.body
          expect(body).to.be.an('object')
          expect(body).to.have.property('project')

          let project = body.project
          expect(project).to.have.property('_id')
          expect(project).to.have.property('title')
          expect(project).to.have.property('description')
          expect(project).to.have.property('managerId')
          expect(project).to.have.property('membersId')
          expect(project).to.have.property('todosId')
          expect(project._id).to.equal(this.user.project.id)
          expect(project.title).to.equal(this.user.project.title)
          expect(project.description).to.equal(this.user.project.description)
          expect(project.managerId).to.equal(this.user.id)
          expect(project.membersId).to.have.lengthOf(1)
          expect(project.todosId).to.have.lengthOf(1)
          done()
        })
    })

    it('should send an object with 404 status code', function (done) {
      chai
        .request(app)
        .put(`/projects/${this.user.project.id}/todos`)
        .send({
          todoId: this.otherTodo.id
        })
        .set({
          Authorization: this.user.token
        })
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

  describe('DELETE /projects/:project_id/todos/:todo_id', function () {
    it('should send an object with 200 status code', function (done) {
      chai
        .request(app)
        .delete(`/projects/${this.user.project.id}/todos/${this.todo.id}`)
        .set({
          Authorization: this.user.token
        })
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(200)

          let body = res.body
          expect(body).to.be.an('object')
          expect(body).to.have.property('project')

          let project = body.project
          expect(project).to.have.property('_id')
          expect(project).to.have.property('title')
          expect(project).to.have.property('description')
          expect(project).to.have.property('managerId')
          expect(project).to.have.property('membersId')
          expect(project).to.have.property('todosId')
          expect(project._id).to.equal(this.user.project.id)
          expect(project.title).to.equal(this.user.project.title)
          expect(project.description).to.equal(this.user.project.description)
          expect(project.managerId).to.equal(this.user.id)
          expect(project.membersId).to.have.lengthOf(1)
          expect(project.todosId).to.have.lengthOf(0)
          done()
        })
    })

    it('should send an object with 404 status code', function (done) {
      chai
        .request(app)
        .delete(`/projects/${this.user.project.id}/todos/${this.todo.id}`)
        .set({
          Authorization: this.otherUser.token
        })
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
