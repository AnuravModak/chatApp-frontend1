import axios from 'axios';

const api=axios.create({
    baseURL:"http://192.168.0.170:8080",
});



export const fetchUsers=()=> api.get("/api/users/admin/all/users");
export const fetchUserById =(id)=> api.get(`/api/users/admin/user/${id}`);
export const fetchUserByUsername =(username)=> api.get(`/api/users/admin/username/${username}`);
export const fetchMessagesBetweenUsers =(senderId, receiverId)=> api.get(`/admin/getMessages/${senderId}/${receiverId}`);
export const sendMessage = (messageData) => api.post("/api/chat/send", messageData);
export const onlineStatus = (id, isOnline) => 
    api.post("/api/users/online-status", null, { params: { userId: id, isOnline } })