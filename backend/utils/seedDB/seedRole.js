const Role = require('../../models/roleModel');
const { READ, CREATE, UPDATE, DELETE, MANAGE} = require('../constants/users_abilities');
const { subjects, actions } = require('../constants/users_abilities');

module.exports = seedRoles = async () => {

    let [defaultRole, adminRole] = await Promise.all([Role.findOne({ "name": "default" }), Role.findOne({ "name": "admin" })]);
    
    if(!defaultRole){
        defaultRole = new Role({
            name: 'default',
            permissions: [
                {
                    "subject": "",
                    "actions": []
                }
            ]
        });
        await defaultRole.save();
    }

    if(!adminRole){
        adminRole = new Role({
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
        await adminRole.save();
    }

    await Promise.all([defaultRole.save(), adminRole.save()]);
}