const agentModel = require("../model/agentModel");
const propertyModel = require("../model/propertyModel");
const { ObjectId } = require('mongoose').Types;


class propertyController {
    // property create part
    createProperty(data, file) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    const agent = await agentModel.findById(data.agentId);
                    if (agent) {
                        let newProperty;
                        console.log(file);

                        if (file) {
                            let maltipleImage = [];
                            for (var otherImg of file.maltipleImage) {
                                maltipleImage.push(otherImg.path)
                            }
                            newProperty = new propertyModel(
                                {
                                    ...data,
                                    mainImage: file.mainImage[0].path,
                                    maltipleImage: maltipleImage
                                }
                            )

                            newProperty.save().then(
                                async () => {
                                    await agentModel.updateOne(
                                        {
                                            _id: data.agentId
                                        },
                                        {
                                            $push: {
                                                property: newProperty._id
                                            }
                                        }
                                    )
                                    resolve({
                                        msg: "property added",
                                        status: 1
                                    })
                                }
                            ).catch(
                                (error) => {
                                    console.log(error);
                                    reject({
                                        msg: "property not added due to file image",
                                        status: 0
                                    })
                                }
                            )
                        }
                    } else {
                        reject({
                            msg: 'Agent not found',
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

    // property read part
    propertyRead(query) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    let allProperty
                    let total ;
                    if (query) {
                        let conditions = [];
                        let skip = Number(query.skip || 0)
                        let limit = Number(query.limit || 10)
                        if (query.id) {
                            allProperty = await propertyModel.aggregate([
                                {
                                    $match: { _id: new ObjectId(query.id) }
                                },
                                {
                                    $lookup: {
                                        from: 'agents',
                                        localField: 'agentId',
                                        foreignField: '_id',
                                        as: 'agent'
                                    }
                                }, {
                                    $unwind: '$agent'
                                }
                            ])
                            return resolve({
                                msg: 'property found',
                                status: 1,
                                allProperty: allProperty[0]
                            })
                        }
                        if (query.filter) {
                            conditions.push({
                                $or: [
                                    { action: query.filter },
                                    { status: query.filter },
                                    { propertyType: query.filter }
                                ]
                            }
                            )
                        }
                        if (query.searchProperty) {
                            conditions.push({
                                $or: [
                                    { title: { $regex: new RegExp(query.searchProperty, 'i') } },
                                    { category: { $regex: new RegExp(query.searchProperty, 'i') } },
                                    { state: { $regex: new RegExp(query.searchProperty, 'i') } },
                                    { district: { $regex: new RegExp(query.searchProperty, 'i') } }
                                ]
                            }
                            )
                        }
                        const Property = conditions.length > 0 ? { $and: conditions } : {};
                        allProperty = await propertyModel.aggregate([
                            {
                                $match: Property
                            },
                            {
                                $lookup: {
                                    from: 'agents',
                                    localField: 'agentId',
                                    foreignField: '_id',
                                    as: 'agent'
                                }
                            },
                            { $sort: { createdAt: -1 } },
                            { $skip: skip },
                            { $limit: limit }
                        ])
                        total = await propertyModel.countDocuments(Property);
                    } else {
                        allProperty = await propertyModel.aggregate([
                            {
                                $lookup: {
                                    from: 'agents',
                                    localField: 'agentId',
                                    foreignField: '_id',
                                    as: 'agent'
                                }
                            },
                            { $sort: { createdAt: -1 } },
                        ])
                        total = await propertyModel.countDocuments();
                    }
                    if (!allProperty) {
                        return reject({
                            msg: 'result not found',
                            status: 0
                        })
                    } else {
                        return resolve({
                            msg: 'property found',
                            status: 1,
                            allProperty,
                            total
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

    // propertyDelete part
    propertyDelete(id) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    const deleteProperty = await propertyModel.findById(id);

                    if (deleteProperty) {
                        propertyModel.deleteOne({ _id: id }).then(
                            () => {
                                resolve({
                                    msg: 'Property deleted',
                                    status: 1
                                })
                            }
                        ).catch(
                            () => {
                                reject({
                                    msg: 'Property not deleted',
                                    status: 0
                                })
                            }
                        )
                    } else {
                        reject({
                            msg: 'Property not found',
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

    // propertyEdit part
    async propertyEdit(data, file, id) {
        try {
            let updateData = { ...data };

            if (file) {
                if (file.image) {
                    updateData.mainImage = file.image.path;
                }
                if (file.otherImage) {
                    let otherImages = file.otherImage.map(img => img.path);
                    updateData.maltipleImage = otherImages;
                }
            }
            await propertyModel.updateOne({ _id: id }, { $set: updateData });

            return {
                msg: 'Property updated',
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

    // otherImg pert edit
    otherImgEdit(url, id) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    if (id) {
                        const findProperrty = await propertyModel.findById(id);
                        if (findProperrty) {
                            await propertyModel.updateOne(
                                {
                                    _id: id
                                },
                                {
                                    $set: {
                                        maltipleImage: findProperrty.maltipleImage.filter((oldUrl) => {
                                            return (oldUrl != url)
                                        })
                                    }
                                }
                            ).then(
                                () => {
                                    resolve({
                                        msg: "Image deleted",
                                        status: 1
                                    })
                                }
                            ).catch(
                                () => {
                                    reject(
                                        {
                                            msg: "Image not deleted",
                                            status: 0,
                                        }
                                    )
                                })
                        }
                    }
                } catch {
                    reject({
                        msg: 'Internal server error',
                        status: 0
                    })
                }
            }
        )
    }

    // statusChange part
    statusChange(query, data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    if (query.id) {
                        const property = await propertyModel.findById(query.id)
                        if (property) {
                            let updateProperty = {};
                            if (data.num == 1) {
                                updateProperty.action = 'approved'
                            }
                            if (data.num == 0) {
                                updateProperty.action = 'rejected'
                            }
                            if (data.num == 'available') {
                                updateProperty.status = 'available'
                            }
                            if (data.num == 'sold') {
                                updateProperty.status = 'sold'
                            }
                            if (data.num == 'soon') {
                                updateProperty.status = 'soon'
                            }
                            await propertyModel.updateOne(
                                {
                                    _id: query.id
                                }, {
                                $set: updateProperty
                            }
                            ).then(
                                () => {
                                    resolve({
                                        msg: `status change`,
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
module.exports = propertyController;