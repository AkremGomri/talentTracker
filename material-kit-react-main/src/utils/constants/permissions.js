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
/* fields grouped together */
const userFields = [ email, password, role, manager, manages, skills, deleted ];

const roleFields = [ all ];

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
  fields: ["name", "subFields"]
}

/* actions */
const MANAGE = "All";
const Post = "Post";
const Get = "Get";
const Patch = "Patch";
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
  Field
};

exports.actions = {
  // MANAGE,
  Post,
  Get,
  Patch,
  Delete
};
