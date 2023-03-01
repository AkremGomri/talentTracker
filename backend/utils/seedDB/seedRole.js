const Role = require('../../models/roleModel');
const { READ, CREATE, UPDATE, DELETE, MANAGE} = require('../constants/users_abilities');

module.exports = seedRoles = async () => {
    let role = await Role.findOne({ "name": "default" });
    if(!role){
        const defaultRole = new Role({
            name: 'default',
            abilities: {
                can: [READ, CREATE, UPDATE],
                cannot: [DELETE]
            }
        });
        defaultRole.save();
    }

    role = await Role.findOne({ "name": "admin" });
    if(!role){
        console.log("seeding database with roles");
        const defaultRole = new Role({
            name: 'admin',
            abilities: {
                can: [MANAGE],
            }
        });
        defaultRole.save();
    }
}