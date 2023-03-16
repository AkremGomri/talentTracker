const request = require('supertest');
const mongoose = require('mongoose');
const fs = require('fs');
const app = require('../app');
const constants = require('../utils/constants/users_abilities');

describe('One Role CRUD API', () => {
    const roleName = "testRole";
    test('should create a new role', (done) => {
        request(app)
            .post('/admin/role')
            .send({
                "name": roleName,
                "permissions": [{
                    "subject": Object.values(constants.subjects)[0],
                    "actions": [
                        Object.values(constants.actions)[0],
                    ]
                }]
            })
            .then((res) => {
                expect(res.statusCode).toEqual(201);
                expect(res.body.status).toEqual('success');
                expect(res.body.data.name).toEqual(roleName);
                expect(res.body.data.permissions[0].subject).toEqual(Object.values(constants.subjects)[0]);
                expect(res.body.data.permissions[0].actions[0]).toEqual(Object.values(constants.actions)[0]);
                done();
            })
            .catch((err) => done(err));
    }, 10000);

    test('should read the role', (done) => {
        request(app)
            .get('/admin/role')
            .send({
                "name": roleName,
            })
            .then((res) => {
                expect(res.statusCode).toEqual(201);
                expect(res.body.status).toEqual('success');
                expect(res.body.data.name).toEqual(roleName);
                expect(res.body.data.permissions[0].subject).toEqual(Object.values(constants.subjects)[0]);
                expect(res.body.data.permissions[0].actions[0]).toEqual(Object.values(constants.actions)[0]);
                done();
            })
            .catch((err) => done(err));
    });

    test('should update a new role', (done) => {
        request(app)
            .put('/admin/role')
            .send({
                "name": roleName,
                "permissions": [{
                    "subject": Object.values(constants.subjects)[1],
                    "actions": [
                        Object.values(constants.actions)[1],
                    ]
                }]
            })
            .then((res) => {
                console.log("name: ",Object.values(constants.subjects)[1]);
                console.log("roleName: ",res.body.data.permissions[0].subject);
                expect(res.statusCode).toEqual(201);
                expect(res.body.status).toEqual('success');
                expect(res.body.data.name).toEqual(roleName);
                expect(res.body.data.permissions[0].subject).toEqual(Object.values(constants.subjects)[1]);
                expect(res.body.data.permissions[0].actions[0]).toEqual(Object.values(constants.actions)[1]);
                done();
            })
            .catch((err) => done(err));
    });

    test('should delete the role', (done) => {
        console.log("********** bb: ",Object.values(constants.subjects)[0]);
        request(app)
            .delete('/admin/role')
            .send({
                "name": roleName,
                "permissions": [{
                    "subject": Object.values(constants.subjects)[1],
                    "actions": [
                        Object.values(constants.actions)[1],
                    ]
                }]
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