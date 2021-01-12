import Menu from '../models/Menu'

export const addMenu = async (req, res) => {
    try {
        const { title, url, order, active } = req.body

        const newMenu = Menu({
            title,
            url,
            order,
            active
        })

        const menuSaved = await newMenu.save()

        if (!menuSaved) {
            return res.status(500).json({
                message: 'Server error al guardar'
            })
        }

        return res.status(200).json({
            message: 'Menu created successfully'
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Server error, try again'
        })
    }

}

export const getMenus = async (req, res) => {
    try {
        const menus = await Menu.find().sort({ order: 'asc' })

        if (!menus) {
            return res.status(404).json({
                message: 'No users'
            })
        }
        return res.status(200).json({
            menus
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

export const updateMenu = async (req,res) => {
    try {
        const menuData = req.body
        const { id } = req.params

        const updateMenu = await Menu.findByIdAndUpdate(id, menuData, {
            new: true
        })

        if (!updateMenu) {
            return res.status(404).json({
                message: 'Menu not found'
            })
        }

        return res.status(200).json({
            message: 'The menu has been updated' 
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Error server'
        })
    }
}

export const activateMenu = async (req,res) => {
    try {
        const { active } = req.body
        const { id } = req.params

        const updateMenu = await Menu.findByIdAndUpdate(id, { active }, {
            new: true
        })

        if (!updateMenu) {
            return res.status(404).json({
                message: 'Menu not found'
            })
        }

        return res.status(200).json({
            message: active ? 'Menu has been activated' : 'Menu has been deactivated'
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Error server'
        })
    }
} 

export const deleteMenu = async (req, res) => {
    try {
        const { id } = req.params
        if (id) {
            const menuDelete = await Menu.findOneAndDelete({ _id: id })
            if (!menuDelete) {
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
