const mongoose = require("mongoose");
const propertyModel = require("../model/propertyModel");
const reqModel = require("../model/reqModel");
const userModel = require("../model/userModel");

class ReqController {

    // create req part
    async createReq(user_Id, data) {
        try {
            if (!user_Id || !data.property_Id) {
                return {
                    msg: 'Missing required fields',
                    status: 0
                };
            }

            const requestType = data.requestType;

            const user = await userModel.findById(user_Id);
            if (!user) {
                return {
                    msg: 'Login please or enter a valid user_Id',
                    status: 0
                };
            }

            const property = await propertyModel.findById(data.property_Id);
            if (!property) {
                return {
                    msg: 'Property not found',
                    status: 0
                };
            }

            const existedReq = await reqModel.findOne({
                user_Id: user_Id,
                property_Id: data.property_Id
            });

            if (existedReq) {
                // if (existedReq.requestType === 'visit' && requestType === 'visit') {
                //     return {
                //         msg: 'Already visited',
                //         status: 0
                //     };
                // }

                // if (existedReq.requestType === 'visit' && requestType === 'buy') {
                //     await reqModel.updateOne(
                //         {
                //             user_Id: user_Id,
                //             property_Id: data.property_Id
                //         },
                //         {
                //             $set: { requestType: 'buy' }
                //         }
                //     );
                //     return {
                //         msg: 'Visit request upgraded to Buy request successfully',
                //         status: 1
                //     };
                // }

                // if (existedReq.requestType === 'buy' && requestType === 'buy') {
                //     return {
                //         msg: 'You already have a buy request for this property',
                //         status: 0
                //     };
                // }

                return {
                    msg: 'You already have a request for this property',
                    status: 0
                };
            }

            const newRequest = new reqModel({
                user_Id: user_Id,
                property_Id: data.property_Id,
                propertyOwnerId: property.user_Id,
                requestType: requestType,
                message: data.message || ''
            });

            await newRequest.save();

            return {
                msg: `${requestType} request created successfully`,
                status: 1
            };

        } catch (error) {
            console.error(error);
            return {
                msg: 'Internal server error',
                status: 0
            };
        }
    }

    // read req part
    async readReq(query) {
        try {
            const category = {}
            if (query.id) {
                category._id = new mongoose.Types.ObjectId(query.id);
            }
            if (query.filter) {
                category.requestType = query.filter.toLowerCase()
            }
            const request = await reqModel.find(category).populate('user_Id').populate('property_Id').populate('propertyOwnerId')
            // const request = await reqModel.aggregate([
            //     { $match: category },
            //     {
            //         $lookup: {
            //             from: 'users',
            //             localField: 'user_Id',
            //             foreignField: '_id',
            //             as: 'user'
            //         }
            //     },
            //     { $unwind: '$user' },
            //     {
            //         $lookup: {
            //             from: 'properties',
            //             localField: 'property_Id',
            //             foreignField: '_id',
            //             as: 'property'
            //         }
            //     },
            //     { $unwind: '$property' },
            //     {
            //         $lookup: {
            //             from: 'users',
            //             localField: 'propertyOwnerId',
            //             foreignField: '_id',
            //             as: 'propertyOwner'
            //         }
            //     },
            //     { $unwind: '$propertyOwner' }
            // ])
            return (
                {
                    msg: 'Request found',
                    status: 1,
                    request
                }
            )

        } catch (error) {
            console.log(error);
            return (
                {
                    msg: 'Internal server error',
                    status: 0
                }
            )
        }
    }


    // user Delete part
    reqDelete(Id) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    const id = new mongoose.Types.ObjectId(Id);
                    const delete_Req = await reqModel.findById(id);
                    if (delete_Req) {
                        reqModel.deleteOne({ _id: id }).then(
                            () => {
                                resolve({
                                    msg: 'Request deleted',
                                    status: 1
                                })
                            }
                        ).catch(
                            () => {
                                reject({
                                    msg: 'Request not deleted',
                                    status: 0
                                })
                            }
                        )
                    } else {
                        reject({
                            msg: 'Request not found',
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
}
module.exports = ReqController;