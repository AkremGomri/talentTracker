const Role = require('../../models/roleModel');
const { READ, CREATE, UPDATE, DELETE, MANAGE} = require('../constants/users_abilities');
const { subjects, actions } = require('../constants/users_abilities');

module.exports = seedRoles = async () => {
    let role = await Role.findOne({ "name": "default" });
    if(!role){
        const defaultRole = new Role({
            name: 'default',
            permissions: [
                {
                    "subject": "",
                    "actions": []
                }
            ]
        });
        defaultRole.save();
    }

    role = await Role.findOne({ "name": "admin" });
    if(!role){
        console.log("seeding database with roles");
        const defaultRole = new Role({
            name: 'admin',
            permissions:[
                {
                    "subject": subjects.ROLE,
                    "actions": [
                        actions.MANAGE,
                        actions.CREATE,
                    ]
                }
            ]
        });
        defaultRole.save();
    }
}