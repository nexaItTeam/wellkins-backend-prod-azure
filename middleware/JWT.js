const { sign, verify } = require("jsonwebtoken");

const createTokens = (user) => {
    const accessToken = sign(
        { username: user.username, id: user.id },
        "jwtsecretplschange",
        { expiresIn: '24h' }
    );

    return accessToken;
};

const validateToken = (req, res, next) => {
    // const accessToken = req.cookies["x-auth-token"];
    const accessToken = req.header('x-auth-token');
    console.log("accessToken", accessToken)
    if (!accessToken)
        return res.status(401).json({ error: "User not Authenticated!" });

    try {
        const validToken = verify(accessToken, "jwtsecretplschange");
        console.log("validToken", validToken)
        if (validToken) {
            req.authenticated = true;
            req.user =
                validToken
            return next();
        }
    } catch (err) {
        return res.status(401).json({ error: err });
    }
};

module.exports = { createTokens, validateToken };