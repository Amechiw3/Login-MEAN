import { Router } from 'express'
import { UsersControllers } from "../controllers/users.controllers";

export class UsersRoutes {
    public router: Router = Router();
    private usersControllers: UsersControllers;

    constructor(){
        this.usersControllers = new UsersControllers();
        this.config();
    }

    config(): void {
        this.router.get('/users/', this.usersControllers.index);
        this.router.post('/users/', this.usersControllers.save);
        this.router.get('/users/:ID', this.usersControllers.get)
                   .patch('/users/:ID', this.usersControllers.update)
                   .put('/users/:ID', this.usersControllers.update)
                   .delete('/users/:ID', this.usersControllers.delete);

    }
}
