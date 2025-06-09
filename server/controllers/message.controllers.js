import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.models.js";


export const getUsersForSidebar= async()=>{
    try {
        const userId = req.user._id; // Assuming req.user is set by the protectedRoute middleware
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password").sort({ createdAt: -1 });

        // Count number of messages not seen
        const unseenMessages={};
        const promises=filteredUsers.map(async(user)=>{
            const messages= await Message.find({
                senderId: user._id,
                receiverId: userId,
                seen: false
            })
            if(messages.length>0){
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({
            success: true,
            users: filteredUsers,
            unseenMessages
        });
    } catch (error) {
        res.json({
            success: false,
            message: "Error fetching users for sidebar",
            error: error.message
        });
    }
}


// Get all messages for selected user
export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params; // Assuming userId is passed as a URL parameter
        const myId = req.user._id; // Assuming req.user is set by the protectedRoute middleware

        const messages= await Message.find({
            $or: [
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myId}
            ]
        });

        await Message.updateMany({
            senderId: selectedUserId,
            receiverId: myId
        }, { seen: true });

        res.json({
            success: true,
            messages
        });
        
    } catch (error) {
        res.json({
            success: false,
            message: "Error fetching messages",
            error: error.message
        });
    }
};

// Mark message seen
export const markMessageAsSeen = async (req, res) => {
    try {
        const {id}=req.params;
        await Message.findByIdAndUpdate(id, { seen: true });
        res.json({
            success: true,
        });
    } catch (error) {
        res.json({
            success: false,
            message: "Error marking message as seen",
            error: error.message
        });
    }
}

// Send message to the selected user
export const sendMessage = async (req, res) => {
    try {
        const {text, image}= req.body; // Assuming text and image are sent in the request body
        const receiverId= req.params.id; // Assuming receiverId is passed as a URL parameter
        const senderId = req.user._id; // Assuming req.user is set by the protectedRoute middleware

        let imageUrl;
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url; // Get the secure URL of the uploaded image
        }

        const newMessage= await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl || null, // Use the uploaded image URL or null if no image is provided
        });

        res.json({
            success: true,
            newMessage
        });
    } catch (error) {
        res.json({
            success: false,
            message: "Error marking message as seen",
            error: error.message
        });
    }
}