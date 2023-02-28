const Role = require('../models/roleModel');

exports.createNewRole = async (req, res, next) => {
  if(!req.body.name){
    console.log("req.body.name missing");
    return res.status(400).json({ error: "missing field" });
  }

  console.log("req.body.name: " + req.body.name);

  let newRole;
  try{
    newRole = await Role.create(req.body);
  } catch(error){
    console.log("error adding new role: ",error);
    res.status(500).json(error)
  }
  
  res.status(201).json({
      status: 'success',
      data: {
          newRole
      }
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
    res.status(500).json(error)
  }
  
  res.status(201).json({
      status: 'success',
      data: {
          role
      }
  });
};

exports.updateRole = async (req, res, next) => {
  if(!req.body.name && !req.params.id){
    console.log("req.body.name and req.params.id missing");
    return res.status(400).json({ error: "missing fields" });
  }

  console.log("req.body.name: " + req.body.name);

  let updatedRole
  try{
    if (typeof req.body.name === "string") {
      updatedRole = await Role.findOneAndUpdate({ "name": req.body.name }, req.body);
    } else {
      updatedRole = await Role.findOneAndUpdate({ "_id": req.params.id }, req.body);
    }
  } catch(error){
    console.log("error adding new role: ",error);
    res.status(500).json(error)
  }
  
  res.status(201).json({
      status: 'success',
      data: {
          updatedRole
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
      result = await Role.deleteOne({ "name": req.body.name });
    } else {
      result = await Role.deleteOne({ "_id": req.params.id });
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