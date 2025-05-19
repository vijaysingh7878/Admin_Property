// const bcrypt = require('bcryptjs')
// const adminModel = require("../model/adminModel");
// const { tokenGenerate } = require('../helping')

// class adminController {

//     // create admin part
//     async createAdmin(data) {
//         try {
//             const newAdmin = new adminModel({
//                 ...data,
//                 password: await bcrypt.hash(data.password, 10)
//             })
//             await newAdmin.save()
//             return {
//                 msg: 'Admin created',
//                 status: 1
//             }
//         } catch (error) {
//             console.log(error);

//             return {
//                 msg: 'Internal server error',
//                 status: 0
//             }
//         }
//     }

//     // read admin part
//     readAdmin(query) {
//         return new Promise(
//             async (resolve, reject) => {
//                 try {
//                     let findAdmin;
//                     if (query.id) {
//                         findAdmin = await adminModel.findById(query.id);
//                         if (findAdmin) {
//                             resolve({
//                                 msg: 'user found',
//                                 status: 1,
//                                 admin: findAdmin
//                             })
//                         } else {
//                             reject({
//                                 msg: 'user not found',
//                                 status: 0
//                             })
//                         }
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

//     // admin login chack part
//     async loginAdmin(data) {
//         try {
//             const admin = await adminModel.findOne({ email: data.email });
//             if (admin) {
//                 const passwordMatch = await bcrypt.compare(data.password, admin.password);
//                 if (passwordMatch) {
//                     return {
//                         msg: 'login successfully',
//                         status: 1,
//                         admin: { ...admin.toJSON(), password: null },
//                         adminToken: tokenGenerate(admin.toJSON())
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

//     //  admin update part
//     editAdmin(data, file, id) {
//         return new Promise(
//             async (resolve, reject) => {
//                 try {
//                     const foundAdmin = await adminModel.findById(id)
//                     if (data.old_password && data.new_password) {
//                         const passwordMatch = await bcrypt.compare(data.old_password, foundAdmin.password);
//                         if (!passwordMatch) {
//                             return reject({ msg: 'Old password is incorrect', status: 0 });
//                         }
//                         const isSamePassword = await bcrypt.compare(data.new_password, foundAdmin.password);
//                         if (isSamePassword) {
//                             return reject({ msg: 'New password must be different from old password', status: 0 });
//                         }
//                         const hashedPassword = await bcrypt.hash(data.new_password, 10);
//                         await adminModel.updateOne(
//                             {
//                                 _id: id
//                             },
//                             {
//                                 $set: {
//                                     password: hashedPassword
//                                 }
//                             }
//                         ).then(async () => {
//                             const admin = await adminModel.findById(id)
//                             resolve({
//                                 msg: 'admin password updated',
//                                 status: 1,
//                                 admin: admin
//                             }
//                             )
//                         }
//                         )
//                     }
//                     if (data.new_password) {
//                         const hashedPassword = await bcrypt.hash(data.new_password, 10);
//                         await adminModel.updateOne(
//                             {
//                                 _id: id
//                             },
//                             {
//                                 $set: {
//                                     password: hashedPassword
//                                 }
//                             }
//                         ).then(async () => {
//                             const admin = await adminModel.findById(id)
//                             resolve({
//                                 msg: 'admin password updated',
//                                 status: 1,
//                                 admin: admin
//                             }
//                             )
//                         }
//                         )
//                     }
//                     if (file) {
//                         await adminModel.updateOne(
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
//                             async () => {
//                                 const admin = await adminModel.findById(id)
//                                 resolve({
//                                     msg: 'admin updated',
//                                     status: 1,
//                                     admin: admin
//                                 })
//                             }
//                         ).catch(
//                             () => {
//                                 reject({
//                                     msg: 'admin not updated due to profile photo error',
//                                     status: 0
//                                 })
//                             }
//                         )
//                     } else {
//                         await adminModel.updateOne(
//                             {
//                                 _id: id
//                             },
//                             {
//                                 $set: {
//                                     ...data
//                                 }
//                             }
//                         ).then(
//                             async () => {
//                                 const admin = await adminModel.findById(id)
//                                 resolve({
//                                     msg: 'admin updated',
//                                     status: 1,
//                                     admin: admin
//                                 })
//                             }
//                         ).catch(
//                             () => {
//                                 reject({
//                                     msg: 'admin not updated',
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

//     //  admin password update part
//     editAdminPassword(data) {
//         return new Promise(
//             async (resolve, reject) => {
//                 try {
//                     const foundAdmin = await adminModel.findOne({ email: data.email })
//                     if (foundAdmin) {
//                         if (data.new_password) {
//                             const hashedPassword = await bcrypt.hash(data.new_password, 10);
//                             await adminModel.updateOne(
//                                 {
//                                     _id: foundAdmin._id
//                                 },
//                                 {
//                                     $set: {
//                                         password: hashedPassword
//                                     }
//                                 }
//                             ).then(() => {
//                                 return resolve({
//                                     msg: 'admin password updated',
//                                     status: 1,
//                                 }
//                                 )
//                             }
//                             )
//                         } else {
//                             return reject({
//                                 msg: 'Please enter vaild password',
//                                 status: 0,
//                             }
//                             )
//                         }
//                     } else {
//                         return reject({
//                             msg: 'admin not found',
//                             status: 0,
//                         }
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
// }

// module.exports = adminController;