import chai from 'chai';
import chaiHttp from 'chai-http';
import GeneralError from '../src/ErrorHelpers/GeneralError.js';
import ServerError from '../src/ErrorHelpers/ServerError.js';
import app from '../src/app.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('Test error handlers', () => {
  const error = new GeneralError('error', 400, true, 'sample error just occured');
  const serverError = new ServerError('error', 500, false, 'Sample server error');
  it('It should be a type of Error class', (done) => {
    expect(error).to.be.instanceOf(Error);
    expect(serverError).to.be.instanceOf(Error);
    done();
  });

  it('Should be an operational error', (done) => {
    expect(error.isOperational).to.be.equal(true);
    expect(serverError.isOperational).to.be.equal(false);
    done();
  });

  it('Should return not found error', (done) => {
    chai.request(app)
      .get('/api/v1/845989')
      .end((err, res) => {
        expect(res.status).eql(404);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
        done();
      });
  });
});
