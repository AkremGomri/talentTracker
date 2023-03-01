const seedAdmin = require ("./seedAdmin");
const seedRole = require("./seedRole");

module.exports = () => {
    seedRole();
    seedAdmin();
}