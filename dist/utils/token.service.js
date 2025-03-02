"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class TokenService {
    static generateToken(options = {
        payload: {},
        secret: process.env.TOKEN_SIGNATURE,
        expiresIn: 60 * 60
    }) {
        let { payload, expiresIn, secret } = options;
        if (!secret) {
            secret = process.env.TOKEN_SIGNATURE || "";
        }
        const token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
        return token;
    }
    static verifyToken(token, options = { secret: process.env.TOKEN_SIGNATURE }) {
        let { secret } = options;
        if (!secret) {
            secret = process.env.TOKEN_SIGNATURE || "";
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return decoded;
    }
}
exports.default = TokenService;
