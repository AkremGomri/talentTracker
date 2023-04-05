const User = require('../../models/userModel');
const Role = require('../../models/roleModel');

module.exports = seedAdmin = async () => {
    const admin_user = await User.findOne({ email: "admin@gmail.com" }).populate({
        path: "role",
        match: { name: "admin" }
    }).exec();
            
    if(!admin_user){
        const role = await Role.findOne({ "name": "admin" });
        const defaultAdmin = new User({
            email: 'admin@gmail.com', 
            password: 'admin',
            passwordConfirm: 'admin',
            role: role._id
        });
        await defaultAdmin.save();
    }
}