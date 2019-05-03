import { Router } from 'express'
import { UsersControllers } from "../controllers/users.controllers";

export class UsersRoutes {
    public router: Router = Router();
    public usersControllers: UsersControllers = new UsersControllers();
    constructor(){
        this.config();
    }

    config(): void {
        this.router.get('/users/', this.usersControllers.index);
        this.router.post('/users/', this.usersControllers.newUser);
    }
}
