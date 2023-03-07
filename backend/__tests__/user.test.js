const request = require('supertest');
const mongoose = require('mongoose');
const fs = require('fs');
const app = require('../app');

let token; // store the JWT token for authentication
let users;
// connect to the database before running tests
beforeAll(async () => {
    console.log("process.env.MONGODB_URL: ",process.env.MONGODB_URL);
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
});

// disconnect from the database after running tests
afterAll(async () => {
    await mongoose.disconnect();
});

describe('User API', () => {
    test('should create a new user', (done) => {
        request(app)
            .post('/user/signUp')
            .send({
            email: 'testuser@example.com',
            password: 'testPassword',
            passwordConfirm: 'testPassword',
            })
            .then((res) => {
                expect(res.statusCode).toEqual(201);
                expect(res.body.message).toEqual('utilisateur crée!');
                done();
            })
            .catch((err) => done(err));
    });

    test('should login with the correct credentials', (done) => {
        request(app)
            .post('/user/logIn')
            .send({
            email: 'testuser@example.com',
            password: 'testPassword',
            })
            .then((res) => {
                expect(res.statusCode).toEqual(200);
                expect(res.body).toHaveProperty('userId');
                expect(res.body.userId).toBeDefined();
                expect(res.body).toHaveProperty('token');
                expect(res.body.token).toBeDefined();
                token = res.body.token; // store the JWT token for use in subsequent requests
                done();
            })
            .catch((err) => done(err));
    });

    test('should access an authenticated API with the token', (done) => {
        request(app)
            .post('/user/test/')
            .set('Authorization', `Bearer ${token}`)
            .then((res) => {
                expect(res.statusCode).toEqual(200);
                expect(res.body.message).toEqual('successful');
                done();
            })
            .catch((err) => done(err));
    });

    test('should delete the user', (done) => {
        request(app)
            .delete('/user/')
            .send({
            email: 'testuser@example.com',
            })
            .then((res) => {
                expect(res.statusCode).toEqual(200);
                expect(res.body.message).toEqual('deleted successfully');
                expect(res.body).toBeDefined();
                done();
            })
            .catch((err) => done(err));
    });
});

describe('Users API', () => {
    test(`should create many users`, (done) => {
        users = [
            {
                "email": "testuser1@example.com",
                "password": "password1",
                "passwordConfirm": "password1"
            },
            {
                "email": "testuser2@example.com",
                "password": "password2",
                "passwordConfirm": "password2"
            }
        ];
        //Arrange
        request(app)
            .post('/user/many')
            .send(users)
            .then((res) => {
                expect(res.statusCode).toEqual(201);
                expect(res.body.status).toEqual('success');
                done();
            })
            .catch((err) => done(err));
        //Act
        //Assert
    });

    test(`should get all users`, (done) => {
        //Arrange
        request(app)
        .get('/user/many')
        .then((res) => {
            console.log("you have ", res.body.data.users.length, " users");
            expect(res.statusCode).toEqual(201);
            expect(res.body.data.users.length).toBeGreaterThan(0);
            expect(res.body.status).toEqual('success');
            // expect(res.body.data).toContain(users);
            done();
        })
        .catch((err) => done(err));
        //Act
    
        //Assert
    
    });

    test(`should delete many users`, (done) => {
        //Arrange
        let emails = users.map((user) => user.email);
        console.log("****** emails: ", emails);

        request(app)
            .delete('/user/many')
            .send(emails)
            .then((res) => {
                expect(res.statusCode).toEqual(201);
                expect(res.body.status).toEqual('success');
                expect(res.body.result.deletedCount).toBeGreaterThan(0);
                expect(res.body.result.deletedCount).toBeLessThanOrEqual(2);
                // expect(res.body.data).toContain({users});
                done();
            })
            .catch((err) => done(err));

        request(app)
        .get('/user/all')
        .then ((res) => {
            expect(res.statusCode).toEqual(201);
            expect(res.body.status).toEqual('success');
            done();
        })
        .catch((err) => done(err));
        //Act
    
        //Assert
    
    });
});
                
describe('Excel API', () => {
    test(`should upload from Excel`, (done) => {
        const fileContent = fs.readFileSync(__dirname + '/users.xlsx');
        request(app)
            .post('/upload-excel')
            .attach('file', fileContent, 'users.xlsx')
            .then((res) => {
                expect(res.statusCode).toEqual(201);
                // expect(res.body.status).toEqual('success');
                done();
            })
            .catch((err) => done(err));

        // make changes here
    }); 
    test(`should delete all added users`, (done) => {
        //Arrange
        let emails = [
            "akremgomri1@gmail.com",
            "Haroungomri@gmail.com"
        ];
        request(app)
        .delete('/user/many')
        .send(emails)
        .then((res) => {
            console.log("****** result: ", res.body.result);
            expect(res.statusCode).toEqual(201);
            expect(res.body.status).toEqual('success');
            expect(res.body.result.deletedCount).toBeGreaterThan(0);
            expect(res.body.result.deletedCount).toBeLessThanOrEqual(2);
            // expect(res.body.data).toContain({users});
            done();
        })
        .catch((err) => done(err));
        //Act
    
        //Assert
    
    });
}); 