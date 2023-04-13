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
                    "subject": permissions.Role.name,
                    "actions": {
                        // [actions.MANAGE] : [permissions.ROLE.fields[0], permissions.ROLE.fields[1]],
                        [actions.Post] : [ ...permissions.Role.fields ],
                        [actions.Get] : [ ...permissions.Role.fields ],
                        [actions.Patch] : [ ...permissions.Role.fields ],
                        [actions.Delete] : [ ...permissions.Role.fields ]

                    },
                },
                {
                    "subject": permissions.User.name,
                    "actions":{
                        // [actions.MANAGE] : [...permissions.ROLE.fields],
                        [actions.Post] : [...permissions.User.fields],
                        [actions.Get] : [...permissions.User.fields],
                        [actions.Patch] : [...permissions.User.fields],
                        [actions.Delete] : [...permissions.User.fields],

                    },
                },
                {
                    "subject": permissions.Field.name,
                    "actions":{
                        // [actions.MANAGE] : [...permissions.ROLE.fields],
                        [actions.Post] : [...permissions.Field.fields],
                        [actions.Get] : [...permissions.Field.fields],
                        [actions.Patch] : [...permissions.Field.fields],
                        [actions.Delete] : [...permissions.Field.fields],

                    },
                },
            ]
        });
        await adminRole.save();
    }

    await Promise.all([defaultRole.save(), adminRole.save()]);
}