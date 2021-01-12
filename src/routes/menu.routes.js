import { Router } from 'express'
import * as menuCtrl from '../controllers/menu.controllers'
import { authJwt } from '../middlewares';

const router = Router()

router.get('/get-menus', [
                    authJwt.verifyToken
                ],
                menuCtrl.getMenus
)

router.post('/add-menu', [
                    authJwt.verifyToken
                ],
                menuCtrl.addMenu
)

router.put('/update-menu/:id', [
                    authJwt.verifyToken
                ],
                menuCtrl.updateMenu
)

router.put('/activate-menu/:id', [
                    authJwt.verifyToken
                ],
                menuCtrl.activateMenu
)

router.delete('/delete-menu/:id',
                [
                    authJwt.verifyToken
                ], 
                menuCtrl.deleteMenu
)


export default router;  