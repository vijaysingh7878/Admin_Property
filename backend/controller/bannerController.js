const mongoose = require("mongoose");
const bannerModel = require("../model/bannerImgModel");

class bannerController {

    // banner create part
    async createBanner(data, file) {
        try {
            if (file) {
                const newBanner = await bannerModel({
                    bannerImage: file.path,
                    banner_Category: data.banner_Category
                })
                await newBanner.save()
                return ({
                    msg: "Banner image uploaded",
                    status: 1
                })
            } else {
                return ({
                    msg: "Please enter vaild image",
                    status: 0
                })
            }
        } catch (error) {
            return ({
                msg: "Internal server error",
                status: 0
            })
        }

    }

    // banner read part
    async readBanner() {
        try {
            const allBanner = await bannerModel.find();
            return ({
                msg: "All image found",
                status: 1,
                allBanner
            })
        } catch (error) {
            return ({
                msg: "Internal server error",
                status: 0
            })
        }

    }

    // banner status part
    async status_Changr(data, id) {
        try {
            const Id = new mongoose.Types.ObjectId(id)
            const allBanner = await bannerModel.findById(Id);
            if (!allBanner) {
                return ({
                    msg: "Banner not found",
                    status: 0
                })
            }
            await bannerModel.updateOne(
                { _id: id },
                {
                    $set: {
                        isPublished: data.num == 0 ? false : true
                    }
                }
            )
            return ({
                msg: "Status change",
                status: 1
            })
        } catch (error) {
            return ({
                msg: "Internal server error",
                status: 0
            })
        }

    }

    // banner detele part
    async delete_Banner(id) {
        try {
            const Id = new mongoose.Types.ObjectId(id)
            const allBanner = await bannerModel.findById(Id);
            if (!allBanner) {
                return ({
                    msg: "Banner not found",
                    status: 0
                })
            }
            await bannerModel.deleteOne(
                { _id: id }
            )
            return ({
                msg: "Banner deleted",
                status: 1
            })
        } catch (error) {
            return ({
                msg: "Internal server error",
                status: 0
            })
        }

    }
}

module.exports = bannerController;