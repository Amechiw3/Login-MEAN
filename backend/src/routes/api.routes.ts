import { Router, Response, Request} from "express";
import { UsersRoutes } from "./users.routes";

class ApiRoutes {
   public router: Router = Router();
   public userRoutes: Router = new UsersRoutes().router;

   constructor(){
      this.config()
   }

   config(): void {
      this.router.get('/', (request: Request, response: Response) => {
         response.json({
            status: 200,
            message: 'Welcome to API RESTFul'
         })
      });
      this.users();
   }

   users(): void {
      this.router.use(this.userRoutes);
   }
}
export default new ApiRoutes().router;
