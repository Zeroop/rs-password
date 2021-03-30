const server = require("./appTest");
const mockData = require("./__mocks__/UserMork");
const route = require('../routes/index');
let chaiHttp = require('chai-http');
let chai = require('chai');
let should = chai.should();

chai.use(chaiHttp);

  describe('Reset password ', function() {
    it('/POST resetpassword', (done) => {
      chai.request(server)
      .post('/resetpassword')
      .send(mockData)
      .end((err, res) => {
            res.should.have.status(200);
        done();
      });
    });
    
    it('/get verify', (done) => {
      chai.request(server)
      .get('/resetpassword')
      .end((err, res) => {
           
        done();
      });
    });
  });
