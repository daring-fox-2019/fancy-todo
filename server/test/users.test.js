const chai = require('chai')
const chaiHttp = require('chai-http')
const faker = require('faker')
const bcrypt = require('bcryptjs')

const app = require('../app')
const helpers = require('./helpers')

const expect = chai.expect

chai.use(chaiHttp)

describe('Users Tests', function () {
  before(function (done) {
    helpers
      .createUser()
      .then(user => {
        this.user = user
        this.user.token = helpers.createToken(user)
        done()
      })
      .catch(done)
  })
  before(function (done) {
    helpers
      .createUser()
      .then(user => {
        this.otherUser = user
        this.otherUser.token = helpers.createToken(user)
        done()
      })
      .catch(done)
  })
  after(helpers.clearDb('UserModel'))

  const User = function () {
    return {
      email: faker.internet.email(),
      password: faker.internet.password()
    }
  }

  let createdUser = new User()
  let updatedUser = new User()

  describe('GET /users', function () {
    it('should send an object with 200 status code', function (done) {
      chai
        .request(app)
        .get('/users')
        .set('Authorization', this.user.token)
        .end((err, res) => {
          expect(err).to.be.a('null')
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('users')
          expect(res.body.users).to.be.an('array')
          done()
        })
    })
  })

  describe('GET /users/:user_id', function () {
    it('should send an object with 200 status code', function (done) {
      chai
        .request(app)
        .get(`/users/${this.user.id}`)
        .set('Authorization', this.user.token)
        .end((err, res) => {
          expect(err).to.be.a('null')
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('user')
          expect(res.body.user).to.be.an('object')
          expect(res.body.user).to.have.property('_id')
          expect(res.body.user).to.have.property('email')
          expect(res.body.user).to.have.property('password')
          expect(res.body.user._id).to.equal(this.user.id)
          expect(res.body.user.email).to.equal(this.user.email)
          expect(res.body.user.password).to.equal(this.user.password)
          done()
        })
    })

    it('should send an object with 401 status code', function (done) {
      chai
        .request(app)
        .get(`/users/${this.user.id}`)
        .set('Authorization', this.otherUser.token)
        .end((err, res) => {
          expect(err).to.be.a('null')
          expect(res).to.have.status(401)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.be.a('string')
          expect(res.body.message).to.equal('Unauthorized Access')
          done()
        })
    })
  })

  describe('POST /users', function () {
    it('should send an object with 201 status code', function (done) {
      chai
        .request(app)
        .post('/users')
        .send({
          email: createdUser.email,
          password: createdUser.password
        })
        .end((err, res) => {
          expect(err).to.be.a('null')
          expect(res).to.have.status(201)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('user')
          expect(res.body.user).to.be.an('object')
          expect(res.body.user).to.have.property('_id')
          expect(res.body.user).to.have.property('email')
          expect(res.body.user).to.have.property('password')
          expect(res.body.user.email).to.equal(createdUser.email)
          expect(
            bcrypt.compareSync(createdUser.password, res.body.user.password)
          ).to.be.true()
          done()
        })
    })
  })

  describe('PUT /users/:user_id', function () {
    it('should send an object with 200 status code', function (done) {
      chai
        .request(app)
        .put(`/users/${this.user.id}`)
        .set('Authorization', this.user.token)
        .send({
          email: updatedUser.email,
          password: updatedUser.password
        })
        .end((err, res) => {
          expect(err).to.be.a('null')
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('user')
          expect(res.body.user).to.be.an('object')
          expect(res.body.user).to.have.property('_id')
          expect(res.body.user).to.have.property('email')
          expect(res.body.user).to.have.property('password')
          expect(res.body.user._id).to.equal(this.user.id)
          expect(res.body.user.email).to.equal(updatedUser.email)
          expect(
            bcrypt.compareSync(updatedUser.password, res.body.user.password)
          ).to.be.true()
          done()
        })
    })

    it('should send an object with 401 status code', function (done) {
      chai
        .request(app)
        .put(`/users/${this.user.id}`)
        .set('Authorization', this.otherUser.token)
        .end((err, res) => {
          expect(err).to.be.a('null')
          expect(res).to.have.status(401)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.be.a('string')
          expect(res.body.message).to.equal('Unauthorized Access')
          done()
        })
    })
  })

  describe('DELETE /users/:user_id', function () {
    it('should send an object with 200 status code', function (done) {
      chai
        .request(app)
        .delete(`/users/${this.user.id}`)
        .set('Authorization', this.user.token)
        .end((err, res) => {
          expect(err).to.be.a('null')
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('user')
          expect(res.body.user).to.be.an('object')
          expect(res.body.user).to.have.property('_id')
          expect(res.body.user).to.have.property('email')
          expect(res.body.user).to.have.property('password')
          expect(res.body.user._id).to.equal(this.user.id)
          expect(res.body.user.email).to.equal(updatedUser.email)
          expect(
            bcrypt.compareSync(updatedUser.password, res.body.user.password)
          ).to.be.true()
          done()
        })
    })

    it('should send an object with 401 status code', function (done) {
      chai
        .request(app)
        .delete(`/users/${this.user.id}`)
        .set('Authorization', this.otherUser.token)
        .end((err, res) => {
          expect(err).to.be.a('null')
          expect(res).to.have.status(401)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.be.a('string')
          expect(res.body.message).to.equal('Unauthorized Access')
          done()
        })
    })
  })
})
