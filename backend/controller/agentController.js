// const mongoose = require("mongoose");
// const bcrypt = require('bcryptjs');
// const ratingModel = require("../model/ratingModel");
// const userModel = require("../model/userModel");


// class agentController {

//     // create Agent part
//     createAgent(data, file) {
//         return new Promise(
//             async (resolve, reject) => {
//                 try {
//                     if (file) {
//                         const newUser = new userModel({
//                             ...data,
//                             profile_Photo: file.path,
//                             password: await bcrypt.hash(data.password, 10)
//                         })
//                         newUser.save().then(
//                             () => {
//                                 resolve({
//                                     msg: "agent created",
//                                     status: 1
//                                 })
//                             }
//                         ).catch(
//                             (error) => {
//                                 console.log(error);
//                                 reject({
//                                     msg: "agent not created due to img error",
//                                     status: 0
//                                 })
//                             }
//                         )
//                     } else {
//                         const newagent = new userModel({
//                             ...data,
//                             password: await bcrypt.hash(data.password, 10)
//                         });
//                         newagent.save().then(
//                             () => {
//                                 resolve({
//                                     msg: "agent created",
//                                     status: 1
//                                 })
//                             }
//                         ).catch(
//                             (error) => {
//                                 console.log(error);
                                
//                                 reject({
//                                     msg: "agent not created",
//                                     status: 0
//                                 })
//                             }
//                         )
//                     }
//                 } catch (error) {
//                     console.log(error);
//                     reject({
//                         msg: 'Internal server error',
//                         status: 0
//                     })
//                 }
//             }
//         )
//     }

//     // readAgent part
//     readAgent(query) {
//         return new Promise(
//             async (resolve, reject) => {
//                 try {
//                     let findagent;
//                     let filter = {};
//                     if (query.id) {
//                         const id = new mongoose.Types.ObjectId(query.id)
//                         filter._id = id
//                         findagent = await userModel.findById(id).populate('property').populate('rating');
//                         return resolve({
//                             msg: 'one agent found',
//                             status: 1,
//                             users: findagent,
//                         })
//                     }
//                     if (query.name != 'null') {
//                         filter.$or = [
//                             { name: new RegExp(query.name) },
//                             { email: new RegExp(query.name) },
//                             { location: new RegExp(query.name) }
//                         ]
//                     }
//                     if (query.filter) {
//                         filter.status = query.filter == 'active' ? true : false
//                     }
//                     findagent = await userModel.find(filter).sort({ createdAt: -1 }).skip(Number(query.skip)).limit(Number(query.limit)).populate('property')
//                     const total = await userModel.countDocuments(filter)

//                     if (findagent) {
//                         return resolve({
//                             msg: 'agent found',
//                             status: 1,
//                             users: findagent,
//                             total
//                         })
//                     } else {
//                         return reject({
//                             msg: 'agent not found',
//                             status: 0
//                         })
//                     }
//                 } catch (error) {
//                     console.log(error);
//                     reject({
//                         msg: 'Internal server error',
//                         status: 0
//                     })
//                 }
//             }
//         )
//     }

//     // statusChange part
//     statusChangeAgent(query) {
//         return new Promise(
//             async (resolve, reject) => {
//                 try {
//                     if (query.id) {
//                         const agent = await userModel.findById(query.id)
//                         await userModel.updateOne(
//                             {
//                                 _id: query.id
//                             }, {
//                             $set: {
//                                 status: !agent.status
//                             }
//                         }
//                         ).then(
//                             () => {
//                                 resolve({
//                                     msg: 'status change',
//                                     status: 1
//                                 })
//                             }
//                         ).catch(
//                             () => {
//                                 reject({
//                                     msg: 'status not change',
//                                     status: 0
//                                 })
//                             }
//                         )
//                     }
//                 } catch (error) {
//                     reject({
//                         msg: 'Internal server error',
//                         status: 0
//                     })
//                 }
//             }
//         )
//     }

//     // remove-profile part
//     removeProfileAgent(query) {
//         return new Promise(
//             async (resolve, reject) => {
//                 try {
//                     if (query.id) {
//                         await userModel.updateOne(
//                             {
//                                 _id: query.id
//                             }, {
//                             $set: {
//                                 profile_Photo: null
//                             }
//                         }
//                         ).then(
//                             () => {
//                                 resolve({
//                                     msg: 'Profile Photo Removed',
//                                     status: 1
//                                 })
//                             }
//                         ).catch(
//                             () => {
//                                 reject({
//                                     msg: 'Profile Photo not Removed',
//                                     status: 0
//                                 })
//                             }
//                         )
//                     }
//                 } catch (error) {
//                     reject({
//                         msg: 'Internal server error',
//                         status: 0
//                     })
//                 }
//             }
//         )
//     }

//     // agent update part
//     editAgent(data, file, id) {
//         return new Promise(
//             async (resolve, reject) => {
//                 try {
//                     if (file) {
//                         await userModel.updateOne(
//                             {
//                                 _id: id
//                             },
//                             {
//                                 $set: {
//                                     ...data,
//                                     profile_Photo: file.path
//                                 }
//                             }
//                         ).then(
//                             () => {
//                                 resolve({
//                                     msg: 'agent updated',
//                                     status: 1
//                                 })
//                             }
//                         ).catch(
//                             () => {
//                                 reject({
//                                     msg: 'agent not updated due to profile photo error',
//                                     status: 0
//                                 })
//                             }
//                         )
//                     } else {
//                         await userModel.updateOne(
//                             {
//                                 _id: id
//                             },
//                             {
//                                 $set: {
//                                     ...data
//                                 }
//                             }
//                         ).then(
//                             () => {
//                                 resolve({
//                                     msg: 'agent updated',
//                                     status: 1
//                                 })
//                             }
//                         ).catch(
//                             () => {
//                                 reject({
//                                     msg: 'agent not updated',
//                                     status: 0
//                                 })
//                             }
//                         )
//                     }
//                 } catch (error) {
//                     reject({
//                         msg: 'Internal server error',
//                         status: 0
//                     })
//                 }
//             }
//         )
//     }

//     // agent login chack part
//     async loginAgent(data) {
//         try {
//             const agent = await userModel.findOne({ email: data.email });
//             if (agent) {
//                 const passwordMatch = await bcrypt.compare(data.password, agent.password);
//                 if (passwordMatch) {
//                     return {
//                         msg: 'login successfully',
//                         status: 1,
//                         user: { ...user.toJSON(), password: null },
//                     }
//                 } else {
//                     return {
//                         msg: 'Please enter vaild password',
//                         status: 0
//                     }
//                 }
//             } else {
//                 return {
//                     msg: 'Please enter vaild email',
//                     status: 0
//                 }
//             }
//         } catch (error) {
//             console.error("Login error:", error);
//             return {
//                 msg: 'Internal server error',
//                 status: 0
//             }
//         }
//     }

//     // user Delete part
//     agentDelete(Id) {
//         return new Promise(
//             async (resolve, reject) => {
//                 try {
//                     const id = new mongoose.Types.ObjectId(Id);
//                     const deleteAgent = await userModel.findById(id);
//                     if (deleteAgent) {
//                         userModel.deleteOne({ _id: id }).then(
//                             () => {
//                                 resolve({
//                                     msg: 'Agent deleted',
//                                     status: 1
//                                 })
//                             }
//                         ).catch(
//                             () => {
//                                 reject({
//                                     msg: 'Agent not deleted',
//                                     status: 0
//                                 })
//                             }
//                         )
//                     } else {
//                         reject({
//                             msg: 'Agent not found',
//                             status: 0
//                         })
//                     }

//                 } catch (error) {
//                     console.log(error);
//                     reject({
//                         msg: 'Internal server error',
//                         status: 0
//                     })
//                 }
//             }
//         )
//     }
// }
// module.exports = agentController;