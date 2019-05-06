import {NextFunction, Request, Response} from 'express';
import { UserSchema } from "../models/user.model";
import { IUser } from "../interfaces/IUsers";
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { keys } from "../keys";
import helper from "../lib/helpers";

export class UsersControllers {
    public async index(request: Request, response: Response) {
        const users = await UserSchema.find({});
        response.json({
            status: 200,
            message: 'Users retrieved success!!',
            count: users.length,

            users: users.map(user => {
                return helper.toProfileJSON(user)
            })
        });
    }

    public async save(request: Request, response: Response) {
        let newUser: IUser = new UserSchema;
        newUser.username = request.body.username;
        newUser.email = request.body.email;
        var password = helper.hashPassword(request.body.password);

        newUser.salt = password.salt;
        newUser.hash = password.hash;

        try {
            await newUser.save()
                .then(result => {
                    response.json({
                        status: 201,
                        message: "Created user success!!",
                        createdUser: helper.toAuthJSON(result)
                    });
                });
        } catch (e) {
            response.json({
                status: 500,
                error: e
            });
        }
    }

    public async get(request: Request, response: Response) {
        UserSchema.findById(request.params.ID)
            .then(function(user) {
                if (user) {
                    response.json({
                        status: 200,
                        user: helper.toAuthJSON(user)
                    });
                } else {
                    response.json({
                        status: 500,
                        message: "No valid entry found for provided ID"
                    });
                }
            })
            .catch()
    }

    public async update(request: Request, response: Response, next: NextFunction) {
        UserSchema.findById(request.params.ID, function (error, user) {
            if (!user) {
                return next(
                    response.json({
                        status:500,
                        message: "Could not load Document"
                    })
                )
            } else {
                if(typeof request.body.username !== 'undefined') { user.username = request.body.username; }
                if(typeof request.body.email !== 'undefined') { user.email = request.body.email; }
                if(typeof request.body.bio !== 'undefined') { user.bio = request.body.bio; }
                if(typeof request.body.image !== 'undefined') { user.image = request.body.image; }
                if(typeof request.body.password !== 'undefined') {
                    let password = helper.hashPassword(request.body.password);
                    user.salt = password.salt;
                    user.hash = password.hash;
                }

                user.save(function (error) {
                    if (error) {
                        response.json({
                            status: 500,
                            error
                        })
                    } else {
                        response.json({
                            status: 200,
                            message: "User updated",
                            user: helper.toAuthJSON(user)
                        })
                    }
                })
            }
        })
    }

    public async delete(request: Request, response: Response, next: NextFunction) {
        UserSchema.findById(request.params.ID, function (error, user) {
            if (!user) {
                return next(
                    response.json({
                        status:500,
                        message: "Could not load Document"
                    })
                )
            } else {
                user.remove(function (error) {
                    if (error) {
                        response.json({
                            status: 500,
                            error
                        })
                    } else {
                        response.json({
                            status: 200,
                            message: "User deleted"
                        })
                    }
                })
            }
        })
    }
}
