require("dotenv").config();
const API_VERIFICATION = process.env.API_VERIFICATION_TOKEN;

class Authorization {
    static authorization(req, res, next) {
        if (!req.headers.authorization) {
            return res.status(403).json({error: "No authorization token sent!"});
        }
        if (req.headers.authorization === `BEARER ${API_VERIFICATION}`) {
            next();
            return;
        }
        res.status(401).send();
    }
}

module.exports = {Authorization};
