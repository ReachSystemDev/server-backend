// import jwt, { decode } from 'jsonwebtoken'
import jwt from 'jwt-simple';
import config from '../config'
import User from '../models/User'
import Role from '../models/Role'
import moment from 'moment';


export const verifyToken = async (req, res, next) => {
    const token = req.headers['x-access-token']

    if (!token) return res.status(403).json({ 
        message: 'No token provided' 
    })

    try {
        const payload = jwt.decode(token, config.SECRET)

        if(payload.exp <= moment.unix()){
            return res.status(404).json({
                message: 'The token has expired'
            })
        }
        req.user = payload
        next()

    } catch (err) {
        return res.status(401).json({ 
            message: 'Unauthorized' 
        })
    }

    

}





export const isModerator = async (req, res, next) => {
    const user = await User.findById(req.userId)
    const roles = await Role.find({ _id: { $in: user.roles } })

    console.log(roles)

    for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'moderator') {
            next()
            return
        }
    }

    return res.status(403).json({ message: 'Requer Moderator role' })
}

export const isAdmin = async (req, res, next) => {
    const user = await User.findById(req.userId)
    const roles = await Role.find({ _id: { $in: user.roles } })


    for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'admin') {
            next()
            return
        }
    }

    return res.status(403).json({ message: 'Requer Admin role' })
}



export const createAccessToken = (user) => {
    const { _id, name, lastname, email, role } = user
    const payLoad = {
        id: _id,
        name: name,
        lastname: lastname,
        email: email,
        role: role,
        createToken: moment().unix(),
        exp: moment()
            .add(3, 'hours')
            .unix()
    }

    return jwt.encode(payLoad, config.SECRET)
}


export const createRefreshToken = (user) => {
    const { _id } = user
    const payLoad = {
        id: _id,
        exp: moment()
            .add(3, 'days')
            .unix()
    }

    return jwt.encode(payLoad, config.SECRET)
}

export const decodedToken = (token) => {

    return jwt.decode(token, config.SECRET, true)

}

