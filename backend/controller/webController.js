// const mongoose = require("mongoose");
// const webModel = require("../model/webModel");


// class webController {
//     async add(data, file) {
//         try {
//             const result = await webModel.findOneAndUpdate(
//                 {
//                     websiteName: data.websiteName,
//                     logo: file.path,
//                     contact_Number: data.contact_Number,
//                     email: data.email
//                 },
//                 { upsert: true, new: true }
//             );

//             return {
//                 status: 1,
//                 msg: 'Setting saved successfully',
//                 data: result
//             };
//         } catch (error) {
//             console.error('Add setting error:', error);
//             return {
//                 status: 0,
//                 msg: 'Error while saving setting'
//             };
//         }
//     }



//     async read(data) {
//         try {
//             const id = new mongoose.Types.ObjectId(data.id);
//             const result = await webModel.findOne(
//                 {
//                     _id: data.id
//                 }
//             );


//             return {
//                 status: 1,
//                 result
//             };
//         } catch (error) {
//             console.error('error:', error);
//             return { status: 0, msg: 'Error' };
//         }
//     }

// }

// module.exports = webController;
