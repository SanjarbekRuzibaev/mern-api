import jwt from 'jsonwebtoken'

//id as payload here
const generateToken = (id) => {
    //second arg would be secret
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d' //expiration time is 30 days after creation
    })
}
export default generateToken