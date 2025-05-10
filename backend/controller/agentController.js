const agentModel = require("../model/agentModel");
const bcrypt = require('bcryptjs')


class agentController {

    // create Agent part
    createAgent(data, file) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    if (file) {
                        const newUser = new agentModel({
                            ...data,
                            profile_Photo: file.path,
                            password: await bcrypt.hash(data.password, 10)
                        })
                        newUser.save().then(
                            () => {
                                resolve({
                                    msg: "agent created",
                                    status: 1
                                })
                            }
                        ).catch(
                            (error) => {
                                console.log(error);
                                reject({
                                    msg: "agent not created due to img error",
                                    status: 0
                                })
                            }
                        )
                    } else {
                        const newagent = new agentModel({
                            ...data,
                            password: await bcrypt.hash(data.password, 10)
                        });
                        newagent.save().then(
                            () => {
                                resolve({
                                    msg: "agent created",
                                    status: 1
                                })
                            }
                        ).catch(
                            (error) => {
                                reject({
                                    msg: "agent not created",
                                    status: 0
                                })
                            }
                        )
                    }
                } catch (error) {
                    console.log(error);
                    reject({
                        msg: 'Internal server error',
                        status: 0
                    })
                }
            }
        )
    }

    // readAgent part
    readAgent(query) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    let findagent;
                    let filter = {};
                    if (query.id) {
                        findagent = await agentModel.findById(query.id).populate('property')
                    }
                    if (query.name != 'null') {
                        filter.$or = [
                            { name: new RegExp(query.name) },
                            { email: new RegExp(query.name) },
                            { location: new RegExp(query.name) }
                        ]

                    }
                    if (query.filter) {
                        filter.status = query.filter == 'active' ? true : false
                    }
                    findagent = await agentModel.find(filter).sort({ createdAt: -1 }).skip(Number(query.skip)).limit(Number(query.limit)).populate('property')
                    const total = await agentModel.countDocuments(filter)

                    if (findagent) {
                        return resolve({
                            msg: 'agent found',
                            status: 1,
                            users: findagent,
                            total
                        })
                    } else {
                        return reject({
                            msg: 'agent not found',
                            status: 0
                        })
                    }
                } catch (error) {
                    console.log(error);

                    reject({
                        msg: 'Internal server error',
                        status: 0
                    })
                }
            }
        )
    }

    // statusChange part
    statusChangeAgent(query) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    if (query.id) {
                        const agent = await agentModel.findById(query.id)
                        await agentModel.updateOne(
                            {
                                _id: query.id
                            }, {
                            $set: {
                                status: !agent.status
                            }
                        }
                        ).then(
                            () => {
                                resolve({
                                    msg: 'status change',
                                    status: 1
                                })
                            }
                        ).catch(
                            () => {
                                reject({
                                    msg: 'status not change',
                                    status: 0
                                })
                            }
                        )
                    }
                } catch (error) {
                    reject({
                        msg: 'Internal server error',
                        status: 0
                    })
                }
            }
        )
    }

    // remove-profile part
    removeProfileAgent(query) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    if (query.id) {
                        await agentModel.updateOne(
                            {
                                _id: query.id
                            }, {
                            $set: {
                                profile_Photo: null
                            }
                        }
                        ).then(
                            () => {
                                resolve({
                                    msg: 'Profile Photo Removed',
                                    status: 1
                                })
                            }
                        ).catch(
                            () => {
                                reject({
                                    msg: 'Profile Photo not Removed',
                                    status: 0
                                })
                            }
                        )
                    }
                } catch (error) {
                    reject({
                        msg: 'Internal server error',
                        status: 0
                    })
                }
            }
        )
    }

    // agent update part
    editAgent(data, file, id) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    if (file) {
                        await agentModel.updateOne(
                            {
                                _id: id
                            },
                            {
                                $set: {
                                    ...data,
                                    profile_Photo: file.path
                                }
                            }
                        ).then(
                            () => {
                                resolve({
                                    msg: 'agent updated',
                                    status: 1
                                })
                            }
                        ).catch(
                            () => {
                                reject({
                                    msg: 'agent not updated due to profile photo error',
                                    status: 0
                                })
                            }
                        )
                    } else {
                        await agentModel.updateOne(
                            {
                                _id: id
                            },
                            {
                                $set: {
                                    ...data
                                }
                            }
                        ).then(
                            () => {
                                resolve({
                                    msg: 'agent updated',
                                    status: 1
                                })
                            }
                        ).catch(
                            () => {
                                reject({
                                    msg: 'agent not updated',
                                    status: 0
                                })
                            }
                        )
                    }
                } catch (error) {
                    reject({
                        msg: 'Internal server error',
                        status: 0
                    })
                }
            }
        )
    }

    // agent login chack part
    async loginAgent(data) {
        try {
            const agent = await agentModel.findOne({ email: data.email });
            if (agent) {
                const passwordMatch = await bcrypt.compare(data.password, agent.password);
                if (passwordMatch) {
                    return {
                        msg: 'login successfully',
                        status: 1,
                        user: { ...user.toJSON(), password: null },
                    }
                } else {
                    return {
                        msg: 'Please enter vaild password',
                        status: 0
                    }
                }
            } else {
                return {
                    msg: 'Please enter vaild email',
                    status: 0
                }
            }
        } catch (error) {
            console.error("Login error:", error);
            return {
                msg: 'Internal server error',
                status: 0
            }
        }
    }
}
module.exports = agentController;