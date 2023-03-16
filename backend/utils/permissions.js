const constants = require('./constants');


exports.canAddRole = (userPermissions) => {
    return userPermissions.some((permission) => {
        console.log("known that required subject is: ", constants.subjects.ROLE, " and required action is: ", constants.actions.CREATE);
        console.log(permission.subject === constants.subjects.ROLE && permission.actions.includes(constants.actions.CREATE));
        return permission.subject === constants.subjects.ROLE && (permission.actions.includes(constants.actions.CREATE) || permission.actions.includes(constants.actions.ALL));
        // return permission.actions.includes(addRoleCapability);
    });
}

exports.canDoThis = (userPermissions, role, actions) => {
    if (typeof actions === "object" && Array.isArray(actions)) {
        return userPermissions.some((permission) => {
            return permission.subject === role && (actions.every(action => action) permission.actions.includes(actions) || permission.actions.includes(constants.actions.ALL));
            // return permission.actions.includes(addRoleCapability);
        });
      } else if (typeof actions === "string") {
        return userPermissions.some((permission) => {
            return permission.subject === role && (permission.actions.includes(actions) || permission.actions.includes(constants.actions.ALL));
            // return permission.actions.includes(addRoleCapability);
        });      } else {
        console.log("actions is not a list or a string");
      }

}

// userPermissions.some((permission) => {
//     console.log("known that required subject is: ", constants.subjects.ROLE, " and required action is: ", constants.actions.CREATE);
//     console.log(permission.subject === constants.subjects.ROLE && permission.actions.includes(constants.actions.CREATE));
//     return permission.subject === constants.subjects.ROLE && permission.actions.includes(constants.actions.CREATE);
//     // return permission.actions.includes(addRoleCapability);
//   });