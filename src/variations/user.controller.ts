import * as bcrypt from './node_modules/bcrypt';
import { Request, Response } from 'express';
import * as jwt from './node_modules/jwt-then';
import { MongoClient } from 'mongodb';
import config from '../../config/config';
import User from './user.model';
import CONFIG from '../../config/config';

export default class UserController {
  public findAll = async (req: Request, res: Response): Promise<any> => {

    MongoClient.connect(CONFIG.DB_HOST, (err, db) => {
      const datab = db.db('sample_airbnb');
      datab.collection('listingsAndReviews').find().limit(5).toArray().then(result => {
        console.log(result);
        res.status(200).send({
          success: true,
          data: result
        });
        return;
      })
      // datab.collection('listingsAndReviews').find({ $toDecimal: true }).limit(5).toArray().then(result => {
      //   res.status(200).send({
      //     success: true,
      //     data: result
      //   });
      //   return;
      // })
    });

    // try {
    //   const users = await User.find();
      
    //   if (!users) {
    //     return res.status(404).send({
    //       success: false,
    //       message: 'Users not found',
    //       data: null
    //     });
    //   }

    //   res.status(200).send({
    //     success: true,
    //     data: users
    //   });
    // } catch (err) {
    //   res.status(500).send({
    //     success: false,
    //     message: err.toString(),
    //     data: null
    //   });
    // }
  };

  public findOne = async (req: Request, res: Response): Promise<any> => {
    try {
      const user = await User.findById(req.params.id, { password: 0 });
      if (!user) {
        return res.status(404).send({
          success: false,
          message: 'User not found',
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
    const { name, lastName, email, password } = req.body;
    try {
      const userUpdated = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            name,
            lastName,
            email,
            password
          }
        },
        { new: true }
      );
      if (!userUpdated) {
        return res.status(404).send({
          success: false,
          message: 'User not found',
          data: null
        });
      }
      res.status(200).send({
        success: true,
        data: userUpdated
      });
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
      const user = await User.findByIdAndRemove(req.params.id);

      if (!user) {
        return res.status(404).send({
          success: false,
          message: 'User not found',
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
