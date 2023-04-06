/* fields */
const all = "All";
const email = "Email";
const password = "Password";
const role = "Role";
const manager = "Manager";
const manages = "Manages";
const skills = "Skills";
const name = "Name";
const permissions = "Permissions";
/* fields grouped together */
const userFields = [ email, password, role, manager, manages, skills ];

const roleFields = [ all ];

/* subjects */
const USERS = {
  name: "users",
  fields: userFields,
  mode: ["All users", "Related users", "Only me"]
};

const ROLE = {
  name: "Role",
  fields: roleFields
};

/* actions */
const MANAGE = "All";
const CREATE = "Create";
const READ = "Read";
const UPDATE = "Update";
const DELETE = "Delete";

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
  USERS,
  ROLE
};

exports.actions = {
  // MANAGE,
  CREATE,
  READ,
  UPDATE,
  DELETE
};
