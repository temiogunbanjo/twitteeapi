import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app.js';
import AUser from '../src/core/domain/UserModel.js';
import model from '../models';

const { User } = model;
const { expect } = chai;
chai.use(chaiHttp);

describe('Api server repository tests', () => {
  const testUser = new AUser(
    'olifedayo90@gmail.com', 'dada', 'mathew', '0908654321',
  );

  const testUserB = new AUser(
    'olifedayo90@gmail.com', 'dada', 'mathew', '0908654321',
  );
  before(async () => { sample = await User.create(testUserB); });
  after(async () => {
    User.destroy({ where: {}, force: true });
  });
  it('Should create a user record', (done) => {
    chai.request(app)
      .post('/api/v1/create-user')
      .send(testUser)
      .end((err, res) => {
        expect(res.status).eql(200);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('success');
        expect(res.body.data).to.eql('Created Successfully');
        done();
      });
  });
});
