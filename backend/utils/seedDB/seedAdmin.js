const User = require('../../models/userModel');
const Role = require('../../models/roleModel');

module.exports = seedAdmin = async () => {
    const role = await Role.findOne({ "name": "admin" });
    const user = await User.findOne({ "role": role._id });
    if(!user){
        const defaultAdmin = new User({
            email: 'admin@gmail.com',
            password: 'admin',
            passwordConfirm: 'admin',
            role: role._id
        });
        defaultAdmin.save();
    }
}