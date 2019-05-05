const chai = require('chai')
const chaiHttp = require('chai-http')
const dirtyChai = require('dirty-chai')
const chaiDatetime = require('chai-datetime')
const faker = require('faker')

const app = require('../../app')
const helpers = require('../helpers')

const expect = chai.expect

chai.use(chaiHttp)
chai.use(dirtyChai)
chai.use(chaiDatetime)

describe('Project Tests', function () {
  before(function (done) {
    helpers.createUser()
      .then(user => {
        this.user = user
        this.user.token = helpers.createToken(user)
        return helpers.createProject({ managerId: this.user._id })
      })
      .then(project => {
        this.user.project = project
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
      .catch(done)
  })
  after(helpers.clearDb('UserModel', 'ProjectModel'))

  const Project = function () {
    return {
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph()
    }
  }

  let createdProject = new Project()
  let updatedProject = new Project()

  describe('GET /projects', function () {
    it('should send an object with 200 status code', function (done) {
      chai
        .request(app)
        .get('/projects')
        .set('Authorization', this.user.token)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(200)

          let body = res.body
          expect(body).to.be.an('object')
          expect(body).to.have.property('projects')

          let projects = body.projects
          expect(projects).to.be.an('array')
          done()
        })
    })
  })

  describe('GET /projects/:project_id', function () {
    it('should send an object with 200 status code', function (done) {
      chai
        .request(app)
        .get(`/projects/${this.user.project.id}`)
        .set('Authorization', this.user.token)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(200)

          let body = res.body
          expect(body).to.be.an('object')
          expect(body).to.have.property('project')

          let project = body.project
          expect(project).to.be.an('object')
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
          expect(project.membersId).to.have.lengthOf(0)
          expect(project.todosId).to.have.lengthOf(0)
          done()
        })
    })

    it('should send an object with 404 status code', function (done) {
      chai
        .request(app)
        .get(`/projects/${this.user.project.id}`)
        .set('Authorization', this.otherUser.token)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(404)

          let body = res.body
          expect(body).to.be.an('object')
          expect(body).to.have.property('message')

          let message = body.message
          expect(message).to.be.a('string')
          expect(message).to.equal('Project Not Found')
          done()
        })
    })
  })

  describe('POST /projects', function () {
    it('should send an object with 201 status code', function (done) {
      chai
        .request(app)
        .post('/projects')
        .set('Authorization', this.user.token)
        .send({
          title: createdProject.title,
          description: createdProject.description,
          managerId: this.user._id
        })
        .end((err, res) => {
          expect(err).to.be.a('null')
          expect(res).to.have.status(201)

          let body = res.body
          expect(body).to.be.an('object')
          expect(body).to.have.property('project')

          let project = body.project
          expect(project).to.be.an('object')
          expect(project).to.have.property('_id')
          expect(project).to.have.property('title')
          expect(project).to.have.property('description')
          expect(project).to.have.property('managerId')
          expect(project).to.have.property('membersId')
          expect(project).to.have.property('todosId')
          expect(project.title).to.equal(createdProject.title)
          expect(project.description).to.equal(createdProject.description)
          expect(project.managerId).to.equal(this.user.id)
          expect(project.membersId).to.have.lengthOf(0)
          expect(project.todosId).to.have.lengthOf(0)
          done()
        })
    })
  })

  describe('PUT /projects/:project_id', function () {
    it('should send an object with 200 status code', function (done) {
      chai
        .request(app)
        .put(`/projects/${this.user.project.id}`)
        .set('Authorization', this.user.token)
        .send({
          title: updatedProject.title,
          description: updatedProject.description,
          managerId: this.user._id,
          membersId: [],
          todosId: []
        })
        .end((err, res) => {
          expect(err).to.be.a('null')
          expect(res).to.have.status(200)

          let body = res.body
          expect(body).to.be.an('object')
          expect(body).to.have.property('project')

          let project = body.project
          expect(project).to.have.property('_id')
          expect(project).to.have.property('title')
          expect(project).to.have.property('description')
          expect(project).to.have.property('managerId')
          expect(project._id).to.equal(this.user.project.id)
          expect(project.title).to.equal(updatedProject.title)
          expect(project.description).to.equal(updatedProject.description)
          expect(project.managerId).to.equal(this.user.id)
          expect(project.membersId).to.have.lengthOf(0)
          expect(project.todosId).to.have.lengthOf(0)
          done()
        })
    })

    it('should send an object with 404 status code', function (done) {
      chai
        .request(app)
        .put(`/projects/${this.user.project.id}`)
        .set('Authorization', this.otherUser.token)
        .end((err, res) => {
          expect(err).to.be.a('null')
          expect(res).to.have.status(404)

          let body = res.body
          expect(body).to.be.an('object')
          expect(body).to.have.property('message')

          let message = body.message
          expect(message).to.be.a('string')
          expect(message).to.equal('Project Not Found')
          done()
        })
    })
  })

  describe('DELETE /projects/:project_id', function () {
    it('should send an object with 200 status code', function (done) {
      chai
        .request(app)
        .delete(`/projects/${this.user.project.id}`)
        .set('Authorization', this.user.token)
        .end((err, res) => {
          expect(err).to.be.a('null')
          expect(res).to.have.status(200)

          let body = res.body
          expect(body).to.be.an('object')
          expect(body).to.have.property('project')

          let project = body.project
          expect(project).to.be.an('object')
          expect(project).to.have.property('_id')
          expect(project._id).to.equal(this.user.project.id)
          done()
        })
    })

    it('should send an object with 404 status code', function (done) {
      chai
        .request(app)
        .delete(`/projects/${this.user.project.id}`)
        .set('Authorization', this.otherUser.token)
        .end((err, res) => {
          expect(err).to.be.a('null')
          expect(res).to.have.status(404)

          let body = res.body
          expect(body).to.be.an('object')
          expect(body).to.have.property('message')

          let message = body.message
          expect(message).to.be.a('string')
          expect(message).to.equal('Project Not Found')
          done()
        })
    })
  })
})
