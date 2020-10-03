import {Request, Response} from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import config from '../../config/config';
import {User} from '../users/user.model';
import verifyToken from "../../helpers/verifyToken";
import httpStatus from "http-status";
import {OAuth2Client} from "google-auth-library";
import {generateTokens} from "../../helpers/generateTokens";

export default class UserController {
  public authenticate = async (req: Request, res: Response): Promise<any> => {
    const {email, password} = req.body;
    try {
      const user = await User.findOne({where: {email}});
      if (!user) {
        return res.status(404).send({
          success: false,
          message: 'User not found'
        });
      }

      const matchPasswords = await bcrypt.compare(password, user.get('password') as string);
      if (!matchPasswords) {
        return res.status(401).send({
          success: false,
          message: 'Not authorized'
        });
      }
      const {accessToken, refreshToken} = await generateTokens(email);

      await user.update({refreshToken});

      res.status(200).send({
        success: true,
        message: 'Token generated Successfully',
        name: user.get('name'),
        accessToken,
        refreshToken,
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.toString()
      });
    }
  };

  public async verifyFacebookToken(accessToken: string) {
    const queryString = `https://graph.facebook.com/me?access_token=${accessToken}&fields=name,email,picture`;
    try {
      const {data: userPayload} = await axios.get(queryString);
      const {name, email, picture = ''} = userPayload;
      return {
        name, email, emailVerified: true, image: picture?.data?.url || ''
      };
    } catch (error) {
      throw error;
    }
  }

  public async verifyGoogleToken(accessToken: string) {
    const client = new OAuth2Client(config.googleClientId);

    try {
      const ticket = await client.verifyIdToken({
        idToken: accessToken,
        audience: config.googleClientId,
      });
      const payload = ticket.getPayload();
      const {
        email, name, email_verified: emailVerified = true, picture: image = ''
      } = payload;

      return {
        email, name, emailVerified, image
      };
    } catch (error) {
      throw error;
    }
  }

  public async socialLogin(social: string, socialToken: string) {
    const socialFunction = social === 'facebook' ? this.verifyFacebookToken : this.verifyGoogleToken;
    const {name, email, emailVerified, image} = await socialFunction(socialToken);

    let savedUser: User;
    try {
      savedUser = await User.findOne({where: {email}});
      const {accessToken, refreshToken} = await generateTokens(email);
      if (!savedUser) {
        await User.create({
          name, email, avatarUrl: image, registrationType: social, refreshToken
        })
      } else {
        savedUser.update({
          name, email, avatarUrl: image, registrationType: social, refreshToken
        });
      }
      return {name, email, image, accessToken, refreshToken};
    } catch (error) {
      throw error;
    }
  }

  public register = async (req: Request, res: Response): Promise<any> => {
    const {name, email, password, social, accessToken: socialToken} = req.body;

    try {
      if (social) {
        const result = await this.socialLogin(social, socialToken);
        return res.status(200).send(result);
      }
      const hash = await bcrypt.hash(password, config.SALT_ROUNDS);
      const user = new User({
        name,
        email,
        registrationType: 'local',
        password: hash
      });

      await user.save();
      const {accessToken, refreshToken} = await generateTokens(email);

      res.status(201).send({
        success: true,
        message: 'User Successfully created',
        accessToken,
        refreshToken
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.toString()
      });
    }
  };

  public refresh = async (req: Request, res: Response): Promise<any> => {
    const {refreshToken} = req.body;
    const result = await verifyToken(refreshToken);
    const user = await User.findOne({where: {email: result.email}});
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).send({error: 'Wrong token'})
    }
    const tokens = await generateTokens(result.email);
    return res.status(200).send(tokens);
  }

  public getCurrent = async (req: Request, res: Response): Promise<any> => {
    const email = (req.params?.userInfo as any)?.email;
    if (!email) {
      return res.status(200).send();
    }
    const user = await User.scope('mainInfo').findOne({where: {email}});
    if (!user) {
      return res.status(200).send();
    }
    return res.status(200).send(user);
  }
}
