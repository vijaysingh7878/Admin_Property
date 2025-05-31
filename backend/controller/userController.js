const mongoose = require("mongoose");
const userModel = require("../model/userModel");
const bcrypt = require('bcryptjs');
const agentModel = require("../model/agentModel");
const { tokenGenerate } = require("../helping");

class userController {

    // createUser part
    createUser(data, file) {
        return new Promise(

            async (resolve, reject) => {
                try {
                    const findAdmin = await userModel.findOne({ role: data.role == "admin" });
                    if (findAdmin) {
                        return reject({
                            msg: `Admin permission required`,
                            status: 0
                        })
                    }
                    const newData = {
                        ...data,
                        role: data.role || 'user',
                        password: await bcrypt.hash(data.password, 10)
                    };
                    if (file) {
                        const newUser = new userModel({
                            ...newData,
                            profile_Photo: file.path
                        })
                        newUser.save().then(
                            () => {
                                resolve({
                                    msg: `${newUser.role} created`,
                                    status: 1
                                })
                            }
                        ).catch(
                            (error) => {
                                console.log(error);
                                reject({
                                    msg: `${newUser.role} not created`,
                                    status: 0
                                })
                            }
                        )
                    } else {
                        const newUser = new userModel({
                            ...newData
                        });
                        newUser.save().then(
                            () => {
                                resolve({
                                    msg: `${newUser.role} created`,
                                    status: 1
                                })
                            }
                        ).catch(
                            (error) => {
                                console.log(error);

                                reject({
                                    msg: `${newUser.role} not created`,
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
    readUser(userToken, query) {
        return new Promise(async (resolve, reject) => {
            try {
                let findUser;
                let filter = {};
                if (userToken && userToken.role != 'admin') {
                    findUser = await userModel.findById(userToken._id).populate('likedProperties').populate('property');
                    return resolve({
                        msg: `${findUser.role} found`,
                        status: 1,
                        users: findUser
                    });
                }

                if (query.id) {
                    findUser = await userModel.findById(query.id).populate('likedProperties').populate('property');
                    return resolve({
                        msg: `${findUser.role} found`,
                        status: 1,
                        users: findUser
                    });
                }

                if (query.role) {
                    filter.role = query.role;
                }

                if (query.name && query.name !== 'null') {
                    filter.$or = [
                        { name: new RegExp(query.name, 'i') },
                        { email: new RegExp(query.name, 'i') },
                        { location: new RegExp(query.name, 'i') }
                    ];
                }

                if (query.filter) {
                    filter.status = query.filter === 'active';
                }

                findUser = await userModel
                    .find(filter)
                    .sort({ createdAt: -1 })
                    .skip(Number(query.skip))
                    .limit(Number(query.limit)).populate('likedProperties').populate('property');

                const total = await userModel.countDocuments(filter);

                const all_Users = query.role ? findUser : findUser.filter(data => data.role !== 'admin');

                if (findUser) {
                    resolve({
                        msg: 'User(s) found',
                        status: 1,
                        users: all_Users,
                        total
                    });
                } else {
                    reject({
                        msg: 'No users found',
                        status: 0
                    });
                }
            } catch (error) {
                console.log(error);
                reject({
                    msg: 'Internal server error',
                    status: 0
                });
            }
        });
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
                    const finduser = await userModel.findById(id)
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
                            async () => {
                                const update_user = await userModel.findById(id);
                                resolve({
                                    msg: `${finduser.role} updated`,
                                    status: 1,
                                    user: update_user
                                })
                            }
                        ).catch(
                            () => {
                                reject({
                                    msg: `${finduser.role} not updated due to profile photo error`,
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
                            async () => {
                                const update_user = await userModel.findById(id);
                                resolve({
                                    msg: `${finduser.role} updated`,
                                    status: 1,
                                    user: update_user
                                })
                            }
                        ).catch(
                            () => {
                                reject({
                                    msg: `${finduser.role} updated not updated`,
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
            console.log(data)
            const user = await userModel.findOne({ email: data.email }).populate('likedProperties');

            if (!user) {
                return {
                    msg: 'Please enter a valid email',
                    status: 0
                };
            }

            const passwordMatch = await bcrypt.compare(data.password, user.password);

            if (!passwordMatch) {
                return {
                    msg: 'Please enter a valid password',
                    status: 0
                };
            }

            return {
                msg: 'Login successful',
                status: 1,
                user: { ...user.toJSON(), password: null },
                userToken: tokenGenerate(user.toJSON())
            };
        } catch (error) {
            console.error("Login error:", error);
            return {
                msg: 'Internal server error',
                status: 0
            };
        }
    }

    // user Delete part
    userDelete(Id) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    const id = new mongoose.Types.ObjectId(Id);
                    const deleteUser = await userModel.findById(id);
                    if (deleteUser) {
                        userModel.deleteOne({ _id: id }).then(
                            () => {
                                resolve({
                                    msg: `${deleteUser.role} deleted`,
                                    status: 1
                                })
                            }
                        ).catch(
                            () => {
                                reject({
                                    msg: `${deleteUser.role} not deleted`,
                                    status: 0
                                })
                            }
                        )
                    } else {
                        reject({
                            msg: `${deleteUser.role} deleted`,
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

    // like part
    addToLike(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    const userId = new mongoose.Types.ObjectId(data.userId)
                    const propertyId = new mongoose.Types.ObjectId(data.propertyId)
                    const like_Property = await userModel.findOne({
                        _id: userId,
                        likedProperties: propertyId
                    })
                    if (like_Property) {
                        return (reject({
                            msg: 'Already added',
                            status: 0
                        }))
                    } else {
                        const user = await userModel.findByIdAndUpdate(
                            {
                                _id: userId,
                            }, {
                            $addToSet: {
                                likedProperties: propertyId
                            }
                        },
                            { new: true }
                        )
                        const populatedUser = await userModel.findById(user._id).populate('likedProperties');
                        return (resolve({
                            msg: 'Add to like',
                            status: 1,
                            user: populatedUser
                        }))
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

    // remove part
    removeToLike(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    const userId = new mongoose.Types.ObjectId(data.userId)
                    const propertyId = new mongoose.Types.ObjectId(data.propertyId)
                    const like_Property = await userModel.findOne({
                        _id: userId,
                        likedProperties: propertyId
                    })
                    if (like_Property) {
                        const user = await userModel.findByIdAndUpdate(
                            {
                                _id: userId,
                            }, {
                            $pull: {
                                likedProperties: propertyId
                            }
                        },
                            {
                                new: true
                            }
                        )
                        const populatedUser = await userModel.findById(user._id).populate('likedProperties');
                        return (resolve({
                            msg: 'Remove to like',
                            status: 1,
                            user: populatedUser
                        }))

                    } else {
                        return (reject({
                            msg: 'Property not found',
                            status: 0
                        }))
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

    // password part
    editPassword(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    const foundAdmin = await userModel.findOne({ email: data.email })
                    if (foundAdmin) {
                        if (data.new_password) {
                            const hashedPassword = await bcrypt.hash(data.new_password, 10);
                            await userModel.updateOne(
                                {
                                    _id: foundAdmin._id
                                },
                                {
                                    $set: {
                                        password: hashedPassword
                                    }
                                }
                            ).then(() => {
                                return resolve({
                                    msg: 'admin password updated',
                                    status: 1,
                                }
                                )
                            }
                            )
                        } else {
                            return reject({
                                msg: 'Please enter vaild password',
                                status: 0,
                            }
                            )
                        }
                    } else {
                        return reject({
                            msg: 'admin not found',
                            status: 0,
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

    // adminLogin chack part
    async adminLogin(data) {
        try {
            const user = await userModel.findOne({ email: data.email });

            if (!user) {
                return {
                    msg: 'Please enter a valid email',
                    status: 0
                };
            }

            if (user.role != 'admin') {
                return {
                    msg: 'Access denied. Admins only',
                    status: 0
                };
            }

            const passwordMatch = await bcrypt.compare(data.password, user.password);

            if (!passwordMatch) {
                return {
                    msg: 'Please enter a valid password',
                    status: 0
                };
            }

            const userType = user.role;

            return {
                msg: 'Login successful',
                status: 1,
                userType,
                user: { ...user.toJSON(), password: null },
                userToken: tokenGenerate(user.toJSON())
            };
        } catch (error) {
            console.error("Login error:", error);
            return {
                msg: 'Internal server error',
                status: 0
            };
        }
    }

    // roleChange part
    roleChange(id, data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    if (id) {
                        const user = await userModel.findById(id)
                        await userModel.updateOne(
                            {
                                _id: id
                            }, {
                            $set: {
                                role: data.userRole
                            }
                        }
                        ).then(
                            () => {
                                resolve({
                                    msg: 'Role change',
                                    status: 1
                                })
                            }
                        ).catch(
                            () => {
                                reject({
                                    msg: 'Role not change',
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

}
module.exports = userController;