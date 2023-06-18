const request = require('supertest');
const mongoose = require('mongoose');
const fs = require('fs');
const app = require('../app');
const constants = require('../utils/constants/users_abilities');

let token;

describe('One Role CRUD API', () => {
    // beforeAll(async () => {
    //     // Perform any setup tasks before running the tests
    //     // For example, you can establish a connection to the database here
    //     await mongoose.connect("mongodb+srv://Akrem:v2r3d6ixEVyMQDb5@talenttracker.ye5awzk.mongodb.net/test?retryWrites=true&w=majority", {
    //       useNewUrlParser: true,
    //       useUnifiedTopology: true,
    //     });
    //   });
      
    afterAll(async () => {
        // Perform any necessary cleanup tasks after running the tests
        // For example, you can close the MongoDB connection here
        await mongoose.connection.close();
      });
    const roleName = "testRoleAllPowerful";
    const rolePermissions = Object.values(constants.permissions).map((table, index) => {
        return {
            "subject": table.name,
            "actions": {
                "Post": table.fields
            }
        }
    });
    console.log("rolePermissions: ", rolePermissions);

    test('login in before testing', (done) => {
        request(app)
            .post('/api/user/login/')
            .send({
            email: 'admin@gmail.com',
            password: 'admin',
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

    test('should create a new role', (done) => {
        request(app)
            .post('/api/admin/role')
            .set('Authorization', `Bearer ${token}`)
            .send({
                "name": roleName,
                "permissions": rolePermissions
            })
            .then((res) => {
                expect(res.statusCode).toEqual(201);
                expect(res.body.status).toEqual('success');
                expect(res.body.data.name).toEqual(roleName);
                expect(res.body.data.permissions[0].subject).toEqual(rolePermissions[0].subject);
                expect(res.body.data.permissions[0].actions.Post[0]).toEqual(rolePermissions[0].actions.Post[0]);
                done();
            })
            .catch((err) => done(err));
    }, );

    test('should read the role', (done) => {
        request(app)
            .get('/api/admin/role')
            .set('Authorization', `Bearer ${token}`)
            .send({
                "name": roleName,
            })
            .then((res) => {
                expect(res.statusCode).toEqual(201);
                expect(res.body.status).toEqual('success');
                expect(res.body.data.name).toEqual(roleName);
                expect(res.body.data.permissions[0].subject).toEqual(rolePermissions[0].subject);
                expect(res.body.data.permissions[0].actions.Post[0]).toEqual(rolePermissions[0].actions.Post[0]);
                done();
            })
            .catch((err) => done(err));
    });

    test('should update a new role', (done) => {
        request(app)
            .put('/api/admin/role')
            .set('Authorization', `Bearer ${token}`)
            .send({
                "name": roleName,
                "permissions": rolePermissions.slice(1)
            })
            .then((res) => {
                console.log("res.body.data: ", res.body.data);
                expect(res.statusCode).toEqual(201);
                expect(res.body.status).toEqual('success');
                expect(res.body.data.name).toEqual(roleName);
                expect(res.body.data.permissions[0].subject).toEqual(rolePermissions[1].subject);
                expect(res.body.data.permissions[0].actions.Post[0]).toEqual(rolePermissions[1].actions.Post[0]);
                done();
            })
            .catch((err) => done(err));
    });

    test('should delete the role', (done) => {
        request(app)
            .delete('/api/admin/role')
            .set('Authorization', `Bearer ${token}`)
            .send({
                "name": roleName,
            })
            .then((res) => {
                expect(res.statusCode).toEqual(201);
                expect(res.body.status).toEqual('success');
                expect(res.body.data.result.acknowledged).toEqual(true);
                expect(res.body.data.result.deletedCount).toEqual(1);
                done();
            })
            .catch((err) => done(err));
    });
});