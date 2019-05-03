import { Request, Response } from 'express';
import {UserSchema, UserModel} from "../models/user.model";
import { IUser } from "../interfaces/IUsers";
import crypto from 'crypto';

export class UsersControllers {
    public async index(request: Request, response: Response) {
        const users = await UserSchema.find({});
        response.json({
            status: 200,
            message: 'Users retrieved success!!',
            count: users.length,
            users
        });
    }

    public async newUser(request: Request, response: Response) {
        let data: UserModel = new UserModel;
        data.username = request.body.username;
        data.email = request.body.username;
        data.setPassword(request.body.password);

        const newUser: IUser = new UserSchema(data);
        try {
            await newUser.save()
                .then(result => {
                    response.json({
                        status: 201,
                        message: "Created user success!!",
                        createdUser: {
                            _id: result._id,
                            username: result.username,
                            email: result.email
                        }
                    });
                });
        } catch (e) {
            response.json({
                status: 500,
                error: e
            });
        }
    }
}

export default new UsersControllers();
