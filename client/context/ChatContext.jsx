import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";


export const ChatContext= createContext();

export const ChatProvider=({children})=>{

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const {socket, axios}=useContext(AuthContext);

    const getUsers= async()=>{
        try {
            const {data}=await axios.get('/api/messages/users');
            if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error(error.message);
        }
    }

    const getMessages= async(userId)=>{
        try {
            const {data}=await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages);
            }
        } catch(error){
            console.log("Error fetching messages:", error);
            toast.error(error.message);
        }
    }

    const sendMessage= async(messageData)=>{
        try {
            const {response}=await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if(response.success){
                setMessages((prevMessages)=>[...prevMessages, response.newMessage]);
            } else{
                toast.error(response.message);
            }
        } catch (error) {
            console.log();
            toast(error.message);
        }
    }

    const subscribeToMessages=()=>{
        if(!socket) return;

        socket.on("newMessage", (newMessage)=>{
            if(selectedUser && newMessage.senderId===selectedUser._id){
                newMessage.seen= true;
                setMessages((prevMessages)=>[...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            } else{
                setUnseenMessages((prevUnseenMessages)=>({
                    ...prevUnseenMessages, [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]? prevUnseenMessages[newMessage.senderId]+1:1
                }));
            }
        });
    }

    const unsubscribeFromMessages= ()=>{
        if(socket) socket.off("newMessage");
    }

    useEffect(()=>{
        subscribeToMessages();
        return ()=>unsubscribeFromMessages();
    }, [socket, selectedUser]);

    const value={
        messages,
        users,
        selectedUser,
        getUsers,
        setMessages,
        sendMessage,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}