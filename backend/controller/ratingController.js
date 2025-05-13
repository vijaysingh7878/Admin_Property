const mongoose = require("mongoose");
const ratingModel = require("../model/ratingModel");
const agentModel = require("../model/agentModel");

class ratingController {
    async addRating(data) {

        const { rating, comment } = data;
        const agentId = new mongoose.Types.ObjectId(data.agentId)
        const userId = new mongoose.Types.ObjectId(data.userId)
        try {
            const result = await ratingModel.findOneAndUpdate(
                { agentId, userId },
                { rating, comment },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            await agentModel.findOneAndUpdate(
                agentId,
                {
                    $push: { rating: result._id }
                }
            )
            return ({
                status: 1, msg: 'Rating submitted successfully', data: result
            })
        } catch (error) {
            console.error('Add rating error:', error);
            return ({
                status: 0, msg: 'Error while submitting rating'
            })
        }
    }

    // Get agent ratings and average
    async getRatingsByAgent(data) {
        try {
            const id =new mongoose.Types.ObjectId(data.id)
console.log(id);

            const ratings = await ratingModel.find({ agentId: id });
            console.log(ratings);
            
            const total = ratings.length;
            const average =
                total > 0 ? (ratings.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1) : 0;

            return ({
                status: 1,
                averageRating: average,
                totalReviews: total,
                ratings,
            });
        } catch (error) {
            console.error('Fetch ratings error:', error);
            return ({ status: 0, msg: 'Error while fetching ratings' });
        }
    };
}

module.exports = ratingController;
