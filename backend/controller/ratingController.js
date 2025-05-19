const mongoose = require("mongoose");
const ratingModel = require("../model/ratingModel");
const agentModel = require("../model/agentModel");

class ratingController {
    async addRating(data) {
        const { rating, comment } = data;
        const propertyId = new mongoose.Types.ObjectId(data.propertyId);
        const commenterId = new mongoose.Types.ObjectId(data.commenterId);
        const propertyOwnerId = new mongoose.Types.ObjectId(data.propertyOwnerId);

        try {
            const result = await ratingModel.findOneAndUpdate(
                { propertyId, commenterId },
                {
                    propertyId,
                    commenterId,
                    propertyOwnerId,
                    rating,
                    comment
                },
                { upsert: true, new: true }
            );

            return {
                status: 1,
                msg: 'Rating submitted successfully',
                data: result
            };
        } catch (error) {
            console.error('Add rating error:', error);
            return {
                status: 0,
                msg: 'Error while submitting rating'
            };
        }
    }


    // Get agent ratings and average
    async getRatingsByAgent(data) {
        try {
            const id = new mongoose.Types.ObjectId(data.id);
            const ratings = await ratingModel.find({ propertyOwnerId: id });

            const total = ratings.length;
            const average =
                total > 0 ? (ratings.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1) : 0;

            return {
                status: 1,
                averageRating: average,
                totalReviews: total,
                ratings,
            };
        } catch (error) {
            console.error('Fetch ratings error:', error);
            return { status: 0, msg: 'Error while fetching ratings' };
        }
    }

}

module.exports = ratingController;
