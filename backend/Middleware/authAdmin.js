const { verifyToken } = require("../helping")

const authAdmin = (req, res, next) => {

    if (req.headers.authorization) {
        const verify = verifyToken(req.headers.authorization);
        if (verify) {
            req.user = verify
            next()
        } else {
            res.send({
                msg: "Invaild token",
                status: 0
            })
        }
    } else {
        res.send(
            {
                msg: "Please provide token",
                status: 0
            }
        )
    }
}
module.exports = authAdmin;