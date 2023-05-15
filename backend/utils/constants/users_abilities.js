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
const parentItem = "parentItem";
const childrenItems = "childrenItems";
const subFields = "subFields";
const options = "options";
const question = "question";
const parentField = "parentField";
const skillElements = "skillElements";
const nbUsers = "nbUsers";
const parentSubField="parentSubField";
const description = "description";
const designation = "designation";
const hardDelete = "hardDelete"

/* fields grouped together */
const userFields = [name, email, password, role, manager, manages, skills, designation, deleted];
const fieldFields = [name, childrenItems, subFields, nbUsers, deleted];
const subFieldFields = [name, parentItem, childrenItems, parentField, skills, nbUsers, deleted];
const skillFields = [name, parentItem, childrenItems, parentSubField, skillElements, nbUsers, deleted];
const skillElementFields = [name, parentItem, options, question, deleted];
const roleFields = [name, permissions, nbUsers, deleted];
const JobTitleFields = [name, description, nbUsers, deleted];

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

const JobTitle = {
  name: "jobtitles",
  fields: JobTitleFields
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

const SkillElement = {
  name: "skillElements",
  fields: skillElementFields
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
  description,
  nbUsers,
  // deleted,
  all,
  
  hardDelete,
};

exports.permissions = {
  User,
  Role,
  JobTitle,
  Field,
  SubField,
  Skill,
  SkillElement
};

exports.actions = {
  // MANAGE,
  Post,
  Get,
  Put,
  Patch,
  Delete
};
