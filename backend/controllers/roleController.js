const Role = require('../models/roleModel');
const User = require('../models/userModel');


exports.createNewRole = async (req, res, next) => {
  const data = req.body;
  console.log("data: " + data);
  if(!data?.name || !data?.permissions){
    console.log("data missing");
    return res.status(400).json({ error: "missing field" });
  }

  console.log("data.name: " + data.name);

  let newRole = {
    name: data.name,
    permissions: data.permissions
  };
  try{
    const validationResult = await Role.prototype.joiValidate(newRole);
    if (validationResult.error) {
      console.log("validation error:", validationResult.error);
      return res.status(400).json({ error: validationResult.error.details[0].message });
    }
    newRole = await Role.create(newRole);
  } catch(error){
    console.log("error adding new role: ",error);
    return res.status(500).json(error)
  }
  
  return res.status(201).json({
      status: 'success',
      data: newRole
  });
};

exports.getRole = async (req, res, next) => {
  if(!req.body.name && !req.params.id){
    console.log("req.body.name missing and req.params.id missing");
    return res.status(400).json({ error: "missing fields" });
  }

  console.log("req.body.name: " + req.body.name);

  let role;
  try{
    if (typeof req.body.name === "string") {
      role = await Role.findOne({ "name": req.body.name });
    } else {
      role = await Role.findOne({ "_id": req.params.id });
    }
  } catch(error){
    console.log("error adding new role: ",error);
    return res.status(500).json(error)
  }

  if(!role){
    return res.status(404).json({
      status: 'fail',
      message: 'No role found'
    });
  }
  
  return res.status(201).json({
      status: 'success',
      data: {
          role
      }
  });
};

exports.updateRole = async (req, res, next) => {
  const data = req.body;
  if( (!data.name && !req.params.id) || !data.permissions){
    console.log("data.name and req.params.id missing");
    return res.status(400).json({ error: "missing fields" });
  }

  console.log("data.name: " + data.name);

  let updates = {
    name: data.name,
    permissions: data.permissions
  };

  try{
    if (typeof data.name === "string") {
      updatedRole = await Role.findOneAndUpdate({ "name": data.name }, updates);
    } else {
      updatedRole = await Role.findOneAndUpdate({ "_id": req.params.id }, updates);
    }
    if (updatedRole === null) {
      throw "role " + data.name + " not found"
    }
  } catch(error){
    console.log("error adding new role: ",error);
    return res.status(500).json(error)
  }

  return res.status(201).json({
      status: 'success',
      data: {
          updatedRole,
      }
  });
};

exports.deleteRole = async (req, res, next) => {
  if(!req.body.name && !req.params.id){
    console.log("req.body.name and req.params.id missing");
    return res.status(400).json({ error: "missing fields" });
  }

  console.log("req.body.name: " + req.body.name);

  let result;
  try{
    if (typeof req.body.name === "string") {
      result = await Role.findOneAndDelete({ "name": req.body.name } );
    } else {
      result = await Role.findOneAndDelete({ "_id": req.params.id });
    }
    if(result.deletedCount === 0){
      throw "role " + req.body.name + " not found"
    }
  } catch(error){
    console.log("error deleting role: ",error);
    return res.status(500).json(error)
  }
  
  return res.status(201).json({
      status: 'success',
      data: {
          result
      }
  });
};

/*          Dabatabase easy manipulation            */
exports.createManyRoles = async (req, res, next) => {
  const data  = req.body.roles;
  if(!data){
    console.log("data missing");
    return res.status(400).json({ error: "missing field" });
  }

  console.log("data: " + data);

  let newRoles;
  try{
    newRoles = await Role.insertMany(data);
  } catch(error){
    console.log("error creating many new data: ",error);
    res.status(500).json(error)
  }

  return res.status(201).json({
      status: 'success',
      data: {
          newRoles
      }
  });
}

exports.updateManyRoles = async (req, res, next) => {
  const data = req.body.roles;
  if(!data){
    console.log("data missing");
    return res.status(400).json({ error: "missing field" });
  }

  console.log("data: " + data);

  let updatedRoles;
  try{
    updatedRoles = await Role.updateMany(data);
  } catch(error){
    console.log("error updating many data: ",error);
    return res.status(500).json(error)
  }

  return res.status(201).json({
      status: 'success',
      data: {
          updatedRoles
      }
  });
}

exports.getAllRoles = async (req, res, next) => {
  let roles;
  try{
    roles = await Role.find();
  } catch(error){
    console.log("error getting all roles: ",error);
    return res.status(500).json(error)
  }
  
  return res.status(201).json({
      status: 'success',
      data: {
          roles
      }
  });
}

exports.deleteAllRoles = async (req, res, next) => {
  let result;
  try{
    result = await Role.deleteMany({});
  } catch(error){
    console.log("error deleting many roles: ",error);
    return res.status(500).json(error)
  }
  
  return res.status(201).json({
      status: 'success',
      data: {
          result
      }
  });
};
