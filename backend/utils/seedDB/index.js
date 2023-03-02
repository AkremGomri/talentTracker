const seedAdmin = require ("./seedAdmin");
const seedRole = require("./seedRole");

module.exports = async () => {
    await seedRole();
    seedAdmin();
}