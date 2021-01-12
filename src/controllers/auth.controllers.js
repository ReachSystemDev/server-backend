import User from '../models/User'
// import Role from '../models/Role'
// import jwt from 'jsonwebtoken'
import config from '../config'
import { createAccessToken, createRefreshToken, decodedToken } from '../middlewares/authJwt'
import moment from 'moment'





export const signUp = async (req, res) => {

    try {
        const {email, password } = req.body

        const newUser = new User({
            email: email.toLowerCase(),
            active: false,
            password: await User.encryptPassword(password)
        })

        const savedUser = await newUser.save()

        if (!savedUser) {
            return res.status(500).json({
                message: 'Server error, try again'
            })
        }

        return res.status(200).json({
            message: 'User created successfully'
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server Error, try again'
        })
    }
}



export const signin = async (req, res) => {
    const userFound = await User.findOne({ email: req.body.email }).populate('roles')
    if (!userFound) return res.status(400).json({ message: 'User no found' })

    const matchPassword = await User.comparePassword(req.body.password, userFound.password)

    if (!matchPassword) return res.status(401).json({ token: null, message: 'Invalid password' })

    const token = jwt.sign({ id: userFound._id }, config.SECRET, {
        expiresIn: 86400
    })

    res.json({ token })
}

export const signIn = async (req, res) => {
    try {
        const userFound = await User.findOne({
            email: req.body.email
        })

        if (!userFound) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const matchPassword = await User.comparePassword(req.body.password, userFound.password)

        if (!matchPassword) return res.status(401).json({
            token: null,
            message: 'Invalid password'
        })

        if (!userFound.active) {
            return res.status(200).json({
                code: 200,
                message: 'User is not activated'
            })
        }

        return res.status(200).json({
            accessToken: createAccessToken(userFound),
            refreshToken: createRefreshToken(userFound)
        })


    } catch (err) {
        return res.status(500).json({
            message: err
        })
    }
}


export const willExpireToken = (token) => {
    const { exp } = decodedToken(token)
    const currentDate = moment().unix()

    if (currentDate > exp) {
        return true
    }

    return false
}

export const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body
        const isTokenExpired = willExpireToken(refreshToken)
        if (isTokenExpired) {
            return res.status(404).json({
                message: 'The token has expired'
            })
        }

        const { id } = decodedToken(refreshToken)

        const userFound = await User.findOne({ _id: id })
        if (!userFound) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        return res.status(200).json({
            accessToken: createAccessToken(userFound),
            refreshToken: refreshToken
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Error server '
        })
    }



}

