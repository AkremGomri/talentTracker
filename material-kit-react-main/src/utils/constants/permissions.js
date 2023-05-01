// const { getUserFields, getFieldFields, getRoleFields, getSkillFields, getSubFieldFields } = require("./getDbFields");

/* fields */
const all = "All";
const email = "email";
const password = "password";
const role = "role";
const manager = "manager";
const manages = "manages";
const skills = "skills";
const name = "name";
const permissions = "permissions";
const deleted = "deleted";
const subFields = "subFields";
const parentField = "parentField";
const skillElements = "skillElements";
const nbUsers = "nbUsers";
const parentSubField="parentSubField";

/* fields grouped together */
const userFields = [name, email, password, role, manager, manages, skills, deleted];
const fieldFields = [name, subFields, nbUsers, deleted];
const subFieldFields = [name, parentField, skills, nbUsers, deleted];
const skillFields = [name, parentSubField, skillElements, nbUsers, deleted];
const roleFields = [name, permissions, nbUsers, deleted];

/* subjects */
const User = {
  name: "users",
  fields: userFields,
  mode: ["All users", "Related users", "Only me"]
};

const Role = {
  name: "roles",
  fields: roleFields
};

const Field = {
  name: "fields",
  fields: fieldFields
}

const SubField = {
  name: "subfields",
  fields: subFieldFields
}

const Skill = {
  name: "skills",
  fields: skillFields
}
/* actions */
const MANAGE = "All";
const Post = "Post";
const Get = "Get";
const Patch = "Patch";
const Put = "Put";
const Delete = "Delete";

exports.fields = {
  email,
  password,
  role,
  manager,
  manages,
  skills,
  name,
  permissions,
  all,
};

exports.permissions = {
  User,
  Role,
  Field,
  SubField,
  Skill
};

exports.actions = {
  // MANAGE,
  Post,
  Get,
  Put,
  Patch,
  Delete
};
