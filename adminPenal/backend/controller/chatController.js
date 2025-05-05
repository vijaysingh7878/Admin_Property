const chatModel = require("../model/chatModel");

class chatController {

    async createChat(data) {

        try {
            const user = await chatModel.findOne(
                {
                    $or: [
                        { senderId: data.senderId, receiverId: data.receiverId },
                        { senderId: data.receiverId, receiverId: data.senderId }
                    ]
                });
            if (user) {
                await chatModel.updateOne(
                    {
                        $or: [
                            { senderId: data.senderId, receiverId: data.receiverId },
                            { senderId: data.receiverId, receiverId: data.senderId }
                        ]
                    }, {
                    $push: {
                        message: {
                            msg: data.message,
                            senderId: data.senderId,
                            timestamp: new Date()
                        }
                    }
                }
                )
                return {
                    msg: "msg save",
                    status: 1,
                }
            } else {
                const newChat = await chatModel({
                    senderId: data.senderId,
                    receiverId: data.receiverId,
                    message: [{senderId: data.senderId, msg: data.message, timestamp: new Date() }]
                })
                newChat.save();
                return {
                    msg: "new user msg save",
                    status: 1,
                }
            }

        } catch (error) {
            console.log(error);

            return {
                msg: "Internal server error",
                status: 0
            }
        }
    }

    async readChat(data) {
        try {
            const user = await chatModel.findOne(
                {
                    $or: [
                        { senderId: data.senderId, receiverId: data.receiverId },
                        { senderId: data.receiverId, receiverId: data.senderId }
                    ]
                });
            if (user) {
                return {
                    msg: "msg save",
                    status: 1,
                    user: user
                }
            } else {
                return {
                    msg: "not found",
                    status: 0,
                    user: { message: [] }
                }
            }

        } catch (error) {
            console.log(error);

            return {
                msg: "Internal server error",
                status: 0
            }
        }
    }


}

module.exports = chatController;