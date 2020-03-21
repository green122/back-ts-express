import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import * as jwt from "jwt-then";
import { MongoClient } from "mongodb";
import config from "../../config/config";
import Listing from "./listing.model";

export default class UserController {
  public findAll = async (req: Request, res: Response): Promise<any> => {
    try {
      const users = await Listing.find();

      if (!users) {
        return res.status(404).send({
          success: false,
          message: "Users not found",
          data: null
        });
      }

      res.status(200).send({
        success: true,
        data: users
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.toString(),
        data: null
      });
    }
  };

  public findOne = async (req: Request, res: Response): Promise<any> => {
    try {
      console.log(req.params.id);
      const user = await Listing.findById(req.params.id, { password: 0 });
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found",
          data: null
        });
      }

      res.status(200).send({
        success: true,
        data: user
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.toString(),
        data: null
      });
    }
  };

  public update = async (req: Request, res: Response): Promise<any> => {
    console.log(req.file, req.files);
    const { images, name, lastName, email, password } = req.body;
    try {
      const listingCreated = await Listing.find
      // const userUpdated = await Listing.findByIdAndUpdate(
      //   req.params.id,
      //   {
      //     $set: {
      //       name,
      //       lastName,
      //       email,
      //       password
      //     }
      //   },
      //   { new: true }
      // );
      res.status(200).send({
        success: true,
        images: (req.files as any[]).map((fileInfo: any) => fileInfo.location)
        // data: userUpdated
      })
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.toString(),
        data: null
      });
    }
  };

  public remove = async (req: Request, res: Response): Promise<any> => {
    try {
      const user = await Listing.findByIdAndRemove(req.params.id);

      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found",
          data: null
        });
      }
      res.status(204).send();
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.toString(),
        data: null
      });
    }
  };
}
