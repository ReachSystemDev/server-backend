import { Router } from 'express'
const router = Router()

import * as authCtrl  from '../controllers/auth.controllers'
import { verifySignUp } from '../middlewares'


router.post('/sign-up', 
                    [
                        verifySignUp.checkDuplicateUsernameOrEmail,
                        verifySignUp.checkPassword
                    ], 
                    authCtrl.signUp
                )
 
router.post('/sign-in', authCtrl.signIn)

router.post('/refresh-access-token', authCtrl.refreshAccessToken)


export default router