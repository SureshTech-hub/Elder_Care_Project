// const jwt = require("jsonwebtoken");
// const jwtConfig = require("../config/jwt");

// const generateToken = (user) => {
//   return jwt.sign(
//     {
//       id: user._id,
//       email: user.email,
//       role: user.role,
//     },
//     jwtConfig.secret,
//     {
//       expiresIn: jwtConfig.expiresIn,
//     }
//   );
// };

// module.exports = generateToken;

const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");

console.log("JWT Secret:", jwtConfig.secret);

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role,
        },
        jwtConfig.secret,
        {
            expiresIn: jwtConfig.expiresIn,
        }
    );
};

module.exports = generateToken;