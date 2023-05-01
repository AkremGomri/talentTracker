export const selectUserToModify = state => state.users.selectedUser;
export const selectAllUsers = state => {
    console.log(
        'selectAllUsers********: ',
        state.users.all
    );
    return state.users.all
};
