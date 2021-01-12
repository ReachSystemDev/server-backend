import { Router } from 'express'
import * as userCtrl from '../controllers/user.controllers'
import multipart from 'connect-multiparty'
import { authJwt, verifySignUp } from '../middlewares'


const router = Router()
const md_upload_avatar = multipart({ uploadDir: './uploads/avatar' })
 


router.get('/',
                [
                    authJwt.verifyToken
                ],
                userCtrl.getUsers
)

router.get('/users-active',
                [
                    authJwt.verifyToken,
                ],
                userCtrl.getUsersActive
)

router.get('/get-avatar/:avatarName',
                [
                ],
                userCtrl.getAvatar
)

router.put('/update-user/:id',
                [
                    authJwt.verifyToken,
                ],
                userCtrl.updateUser
)

router.put('/upload-avatar/:id',
                [
                    authJwt.verifyToken,
                    md_upload_avatar
                ],
                userCtrl.uploadAvatar
)

router.put('/activate-user/:id',
                [
                    authJwt.verifyToken,
                ],
                userCtrl.activateUser
)

router.delete('/delete-user/:id',
                [
                    authJwt.verifyToken
                ], 
                userCtrl.deleteUser
)

router.post('/sign-up-admin', 
                [
                    authJwt.verifyToken,
                        verifySignUp.checkDuplicateUsernameOrEmail,
                        verifySignUp.checkPassword
                ],
                userCtrl.signUpAdmin
)

export default router