import * as bcrypt from 'bcrypt'

class HashingService {

    static hash = (plainText:string) => {
        const saltRounds = Number(process.env.SALTROUND);
        const hashResult = bcrypt.hashSync(plainText, saltRounds);
        return hashResult
    }
    
    static compare = ({ plainText, hashValue} : { plainText:string, hashValue:string }) => {
        const match = bcrypt.compareSync(plainText, hashValue);
        return match
    }
}

export default HashingService;