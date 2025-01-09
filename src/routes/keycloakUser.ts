import express from "express";
import  {UserController}  from "../controller/user";
import  Validate  from "../middleware/validate";
import KeyCloak from "../middleware/keycloakAuth";
import UserValidator  from "../validation/user";

import {KeycloakAdminClient} from '../setup/keycloak'


    //const Keycloak = await import('@one.chat/shared/setup/keycloak.js')
    //const kcAdminClient = await Keycloak.setupKeycloakAdmin();

    const userRouter = express.Router();

    const userController = new UserController();

    userRouter.get("/token-details", KeyCloak.protect() ,async (req:any, res) => {
        res.json(req.kauth?.authService?.getUser());
    });

    //user.trade.read.all
    userRouter.get("/trade_token", KeyCloak.protect("user.trade.token", "read", "own"), userController.tradeToken.bind(userController))

    //with auth and roles
    userRouter.get('/users',KeyCloak.protect(), Validate(UserValidator.get), userController.getUsers.bind(userController))
    userRouter.get('/:userId',KeyCloak.protect(), userController.getUser.bind(userController))
    userRouter.get('/phone/:phone',KeyCloak.protect(), userController.getUserByPhone.bind(userController))

    userRouter.patch('/:userId/profile',KeyCloak.protect("user","update"), userController.updateProfile.bind(userController))
    userRouter.patch('/:userId/update/password',KeyCloak.protect("user", "update"), userController.updatePassword.bind(userController))

    userRouter.patch('/:userId/assign/permission', userController.addUserToGroup.bind(userController))



export default userRouter;
