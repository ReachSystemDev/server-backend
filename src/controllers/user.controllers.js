import fs from 'fs'
import path from 'path'
import User from '../models/User';


export const getUsers = async (req, res) => {
    try {
        const users = await User.find()
        if (!users) {
            return res.status(404).json({
                message: 'No users'
            })
        }
        return res.status(200).json({
            users
        })
    } catch (error) {
        return res.status(500).json({
            message: err
        })
    }
}

export const getUsersActive = async (req, res) => {
    try {
        const { active } = req.query

        const users = await User.find({ active })

        if (!users) {
            return res.status(404).json({
                message: 'No users'
            })
        }

        return res.status(200).json({
            users
        })

    } catch (error) {
        return res.status(500).json({
            message: err
        })
    }
}

export const uploadAvatar = async (req, res) => {
    try {

        const userFound = await User.findById(req.params.id)

        if (!userFound) {
            return res.status(500).json({
                message: 'User not found'
            })
        }

        if (!req.files.avatar) {
            return res.status(500).json({
                message: 'You need upload an image'
            })
        }

        const { path } = req.files.avatar

        const fileExt = path.split('\\')[2].split('.')[1]

        if (fileExt !== 'png' && fileExt !== 'jpeg' && fileExt !== 'jpg') {
            return res.status(400).json({
                message: 'Only png, jpg and jpeg extensions are allowed'
            })
        }

        userFound.avatar = path.split('\\')[2]

        const updateUser = await User.findByIdAndUpdate(req.params.id, userFound, {
            new: true
        })

        return res.status(200).json({
            avatar: updateUser.avatar
        })

    } catch (err) {

        return res.status(500).json({
            message: err,
            messageCustom: 'Error server'
        })

    }

}

export const getAvatar = async (req, res) => {
    try {
        const { avatarName } = req.params

        const filePath = `./uploads/avatar/${avatarName}`

        await fs.promises.stat(filePath);

        return res.status(200).sendFile(path.resolve(filePath))

    } catch (err) {
        if (err.code === 'ENOENT') {
            return res.status(404).json({
                message: 'The avatar does not exist'
            })
        }
        return res.status(500).json({
            message: 'Error server'
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const { name, lastname, role, email, password } = req.body

        const userData = {
            name: name,
            lastname: lastname,
            role: role,
            email: email.toLowerCase(),
        }

        if (password) {
            userData.password = await User.encryptPassword(password)
        }


        const idUser = req.params.id

        const updateUser = await User.findByIdAndUpdate(idUser, userData, {
            new: true
        })

        if (!updateUser) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        return res.status(200).json({
            message: 'User update'
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Error server'
        })
    }
}

export const activateUser = async (req, res) => {
    try {
        const { id } = req.params
        const { active } = req.body

        const updateUser = await User.findByIdAndUpdate(id, { active }, {
            new: true
        })

        if (!updateUser) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        return res.status(200).json({
            message: active ? 'User has been activated' : 'User has been deactivated'
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Error server'
        })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        if (id) {
            const userDelete = await User.findOneAndDelete({ _id: id })
            if (!userDelete) {
                return res.status(500).json({
                    message: 'Error Server'
                })
            }
            return res.status(200).json({
                message: 'User deleted'
            })
        }

        return res.status(404).json({
            message: 'User not found'
        })

    } catch (error) {
        return res.status(500).json({
            message: 'User not found'
        })
    }

}

export const signUpAdmin = async (req, res) => {

    try {
        const { username, name, lastname, role, email, password } = req.body

        const newUser = new User({
            username,
            name,
            lastname,
            role,
            email: email.toLowerCase(),
            active: true,
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
