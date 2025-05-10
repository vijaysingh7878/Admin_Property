const mongoose = require("mongoose");
const chatModel = require("../model/chatModel");



class chatController {

    async createChat(data) {

        try {
            const senderId = new mongoose.Types.ObjectId(data.senderId);
            const receiverId = new mongoose.Types.ObjectId(data.receiverId);
            const user = await chatModel.findOne(
                {
                    $or: [
                        { senderId: senderId, receiverId: receiverId },
                        { senderId: receiverId, receiverId: senderId }
                    ]
                });
            if (user) {
                await chatModel.updateOne(
                    {
                        $or: [
                            { senderId: senderId, receiverId: receiverId },
                            { senderId: receiverId, receiverId: senderId }
                        ]
                    }, {
                    $push: {
                        message: {
                            msg: data.message,
                            senderId: senderId,
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
                const newChat = chatModel({
                    senderId: data.senderId,
                    receiverId: data.receiverId,
                    message: [{ senderId: data.senderId, msg: data.message, timestamp: new Date() }]
                })
                await newChat.save();
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

    async readAllUser() {
        try {
            const user = await chatModel.aggregate([
                {
                    $addFields: {
                        senderId: { $toObjectId: "$senderId" },
                        receiverId: { $toObjectId: "$receiverId" }
                    }
                },
                {
                    $lookup: {
                        from: 'agents',
                        let: { sid: "$senderId", rid: "$receiverId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $or: [
                                            { $eq: ["$_id", "$$sid"] },
                                            { $eq: ["$_id", "$$rid"] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'agent'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: { sid: "$senderId", rid: "$receiverId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $or: [
                                            { $eq: ["$_id", "$$sid"] },
                                            { $eq: ["$_id", "$$rid"] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'user'
                    }
                },
                {
                    $addFields: {
                        receiver: {
                            $cond: {
                                if: { $gt: [{ $size: "$agent" }, 0] },
                                then: { $arrayElemAt: ["$agent", 0] },
                                else: { $arrayElemAt: ["$user", 0] }
                            }
                        }
                    }
                },
                {
                    $project: {
                        agent: 0,
                        user: 0
                    }
                }
            ]);

            if (user) {
                return {
                    msg: "user found",
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