const chai = require('chai')
const chaiHttp = require('chai-http')
const faker = require('faker')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = require('../app')
const helpers = require('./helpers')

const expect = chai.expect

chai.use(chaiHttp)

describe('Auth Tests', function () {
  after(helpers.clearDb('UserModel'))

  let registeredUser = {
    email: faker.internet.email(),
    password: faker.internet.password()
  }

  describe('POST /auth/register', function () {
    it('should send an object with 201 status code', function (done) {
      chai
        .request(app)
        .post('/auth/register')
        .send({
          email: registeredUser.email,
          password: registeredUser.password
        })
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(201)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('user')
          expect(res.body.user).to.be.an('object')
          expect(res.body.user).to.have.property('_id')
          expect(res.body.user).to.have.property('email')
          expect(res.body.user).to.have.property('password')
          expect(res.body.user.email).to.equal(registeredUser.email)
          expect(
            bcrypt.compareSync(registeredUser.password, res.body.user.password)
          ).to.be.true()
          done()
        })
    })
  })

  describe('POST /auth/login', function () {
    it('should send an object with 201 status code', function (done) {
      chai
        .request(app)
        .post('/auth/login')
        .send({
          email: registeredUser.email,
          password: registeredUser.password
        })
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(201)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('user')
          expect(res.body).to.have.property('token')
          expect(res.body.user).to.be.an('object')
          expect(res.body.token).to.be.a('string')
          expect(res.body.user).to.have.property('_id')
          expect(res.body.user).to.have.property('email')
          expect(res.body.user).to.have.property('password')
          expect(res.body.user.email).to.equal(registeredUser.email)
          expect(
            bcrypt.compareSync(registeredUser.password, res.body.user.password)
          ).to.be.true()

          let decoded = jwt.verify(res.body.token, process.env.JWT_SECRET)

          expect(decoded).to.have.property('_id')
          expect(decoded).to.have.property('email')
          expect(decoded).to.have.property('password')
          expect(decoded._id).to.equal(res.body.user._id)
          expect(decoded.email).to.equal(registeredUser.email)
          expect(
            bcrypt.compareSync(registeredUser.password, decoded.password)
          ).to.be.true()
          done()
        })
    })
  })
})
