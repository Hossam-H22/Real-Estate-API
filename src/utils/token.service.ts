
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

export interface TokenPayloadType {
    id: string,
    isLoggedIn: boolean,
    role: string,
}

class TokenService {

    static generateToken(options :{
        payload?:any, 
        secret?:string, 
        expiresIn?:any
    } = {
        payload:{}, 
        secret: process.env.TOKEN_SIGNATURE, 
        expiresIn:60*60
    }){
        let { payload, expiresIn, secret } = options;
        if(!secret){
            secret = process.env.TOKEN_SIGNATURE || "";
        }
        const token = jwt.sign(payload, secret, { expiresIn });
        return token;
    }
    
    static verifyToken(
        token: string, 
        options:{ secret?: string } = { secret: process.env.TOKEN_SIGNATURE }
    ){
        let { secret } = options;
        if(!secret){
            secret = process.env.TOKEN_SIGNATURE || "";
        }
        const decoded = jwt.verify(token, secret);
        return (decoded as TokenPayloadType);
    }
}

export default TokenService;