let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

var expect = chai.expect;

describe("GET: Check Auth Token", function () {
    it("should return error if token expired", function (done) {
        chai.request("http://localhost:5000/")
            .get("groups/1")
            .end(function (err, res) {
                expect(res).to.have.status(400);
                done();
            });
    });
});

describe("POST: Test Login", function () {
    it("should return status:403 for incorrect password", function (done) {
        chai.request("http://localhost:5000/")
            .post("users/login")
            .send({ email: "user1@gmail.com", password: "admin123" })
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(403);
                done();
            });
    });

    it("should return status:401 for non-existing account", function (done) {
        chai.request("http://localhost:5000/")
            .post("users/login")
            .send({ email: "unknownemail@gmail.com", password: "Admin123" })
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(401);
                done();
            });
    });

    it("should return status:200 for registered user", function (done) {
        chai.request("http://localhost:5000/")
            .post("users/login")
            .send({ email: "user1@gmail.com", password: "Admin123" })
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    });
});

describe("PUT: Test user registeration", function () {
    it("should return 200 if user registeration is successful", function (done) {
        chai.request("http://localhost:5000/")
            .put("users/register")
            .send({
                "name" : "newuser101",     
                "email" : "newuseremail@gmail.com",
                "password" : "Admin123",
                "cpassword" : "Admin123"
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });
});