const userModel = require("../model/userModel");
const bcrypt = require('bcryptjs')

class userController {

    // createUser part
    createUser(data, file) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    if (file) {
                        const newUser = new userModel({
                            ...data,
                            profile_Photo: file.path,
                            password: await bcrypt.hash(data.password, 10)
                        })
                        newUser.save().then(
                            () => {
                                resolve({
                                    msg: "user created",
                                    status: 1
                                })
                            }
                        ).catch(
                            (error) => {
                                console.log(error);
                                reject({
                                    msg: "user not created due to img error",
                                    status: 0
                                })
                            }
                        )
                    } else {
                        const newUser = new userModel({
                            ...data,
                            password: await bcrypt.hash(data.password, 10)
                        });
                        newUser.save().then(
                            () => {
                                resolve({
                                    msg: "user created",
                                    status: 1
                                })
                            }
                        ).catch(
                            (error) => {
                                reject({
                                    msg: "user not created",
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

    // readUser part
    readUser(query) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    let findUser;
                    let filter = {};
                    if (query.id) {
                        findUser = await userModel.findById(query.id);
                        return resolve({
                            msg: 'user found',
                            status: 1,
                            users: findUser
                        })
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

                    findUser = await userModel.find(filter).sort({ createdAt: -1 }).skip(query.skip).limit(query.limit);
                    const total = await userModel.countDocuments(filter)

                    if (findUser) {
                        resolve({
                            msg: 'user found',
                            status: 1,
                            users: findUser,
                            total
                        })
                    } else {
                        reject({
                            msg: 'user not found',
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
    statusChangeUser(query) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    if (query.id) {
                        const user = await userModel.findById(query.id)
                        await userModel.updateOne(
                            {
                                _id: query.id
                            }, {
                            $set: {
                                status: !user.status
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
    removeProfileUser(query) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    if (query.id) {
                        await userModel.updateOne(
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

    // user update part
    editUser(data, file, id) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    if (file) {
                        await userModel.updateOne(
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
                                    msg: 'user updated',
                                    status: 1
                                })
                            }
                        ).catch(
                            () => {
                                reject({
                                    msg: 'user not updated due to profile photo error',
                                    status: 0
                                })
                            }
                        )
                    } else {
                        await userModel.updateOne(
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
                                    msg: 'user updated',
                                    status: 1
                                })
                            }
                        ).catch(
                            () => {
                                reject({
                                    msg: 'user not updated',
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

    // user login chack part
    async loginUser(data) {
        try {
            const user = await userModel.findOne({ email: data.email });
            if (user) {
                const passwordMatch = await bcrypt.compare(data.password, user.password);
                if (passwordMatch) {
                    return {
                        msg: 'login successfully',
                        status: 1,
                        user: { ...user.toJSON(), password: null },
                        userToken: tokenGenerate(user.toJSON())
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
module.exports = userController;