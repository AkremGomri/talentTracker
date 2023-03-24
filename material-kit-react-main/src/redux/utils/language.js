export const selectNotifications = state => state.notifications;
export const selectIAmConnected = state => state.socketIO.IAmConnected;
export const selectAllMyConnectedFriends = state => state.socketIO.connectedFriends;
export const selectThisFriendIsConnected = (friendId) => {
    return (state) => state.socketIO.connectedFriends.includes(friendId);
}
