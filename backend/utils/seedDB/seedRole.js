const Role = require('../../models/roleModel');
const { READ, CREATE, UPDATE, DELETE, MANAGE} = require('../constants/users_abilities');
const { permissions, actions } = require('../constants/users_abilities');

module.exports = seedRoles = async () => {

    let [defaultRole, adminRole] = await Promise.all([Role.findOne({ "name": "default" }), Role.findOne({ "name": "admin" })]);
    
    if(!defaultRole){
        defaultRole = new Role({
            name: 'default',
            permissions: [
                {
                    "subject": "",
                    "actions": {}
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
                    "subject": permissions.ROLE.name,
                    "actions": {
                        // [actions.MANAGE] : [permissions.ROLE.fields[0], permissions.ROLE.fields[1]],
                        [actions.CREATE] : [permissions.ROLE.fields[0]],
                        [actions.READ] : [permissions.ROLE.fields[0]],
                        [actions.UPDATE] : [permissions.ROLE.fields[0]],
                        [actions.DELETE] : [permissions.ROLE.fields[0]]

                    },
                },
                {
                    "subject": permissions.USERS.name,
                    "actions":{
                        // [actions.MANAGE] : [...permissions.ROLE.fields],
                        [actions.CREATE] : [...permissions.ROLE.fields]

                    },
                },
            ]
        });
        await adminRole.save();
    }

    await Promise.all([defaultRole.save(), adminRole.save()]);
}