import { ROLES } from '../models/Role'
import User from '../models/User'

export const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    // const user = await User.findOne({ username: req.body.username })

    // if (user) return res.status(400).json({ message: 'The user already exist' })

    const email = await User.findOne({ email: req.body.email.toLowerCase() })

    if (email) return res.status(400).json({ message: 'The email already exist' })

    next()

} 


export const checkPassword = async (req, res, next) => {
    if (req.body.password.length <= 5) {
        return res.status(400).json({ message: 'Password no valid' })
    }else{
        next()

    }
 
} 


export const checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                return res.status(400).json({
                    message: `Role ${req.body.roles[i]} does not exist`
                })
            }
        }
    }

    next()
}