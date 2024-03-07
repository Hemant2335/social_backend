// All the required imports
import express from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
import jwt, { Secret } from "jsonwebtoken";
import Middleware from "../middlewares/Middleware";
import { Request, Response } from "express";

// Creating a Router using Express
const router = express.Router();

// Route 1 : To Create  a User PORT : api/auth/createuser

router.post(
  "/signup",
  [
    body("Name", "Enter a Valid Name").isLength({ min: 3 }),
    body("Email", "Enter a Valid Email").isEmail(),
    body("Password", "Enter a Valid Password").isLength({ min: 5 }),
  ],
  async (req: Request, res: Response) => {
    let Check = false;

    // IF there will be any error it will validate and check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ Check, errors: errors.array() });
    }

    // Now Checking if there is no other user existing with the same email
    let user = await User.findOne({ Email: req.body.Email });
    if (user) {
      return res
        .status(400)
        .json({ Check, error: "User with same email exist" });
    }

    // Now if it passes all the tests

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(req.body.Password, salt);

    // Creating a User
    try {
      const user = await User.create({
        Name: req.body.Name,
        Email: req.body.Email,
        Password: hashedpassword,
        Posts: [],
      });
      const token = jwt.sign(
        { user: { id: user.id } },
        process.env.JWT as string
      );
      Check = true;
      res.status(200).json({ Check, msg: "User Created", authtoken: token , user  });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal error Occured");
    }
  }
);

//Route 2 : To Authenticate and login the user

router.post(
  "/signin",
  [
    body("Email", "Enter a Valid Email").isEmail(),
    body("Password", "Password Cannot be Blank").exists(),
  ],
  async (req: Request, res: Response) => {
    let Check = false;

    // Again we will check for errors first

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ Check, errors: errors.array() });
      }
      const { Email, Password } = req.body;

      // Now for the Validation part first we will check if the entered email exist or not

      let user = await User.findOne({ Email });
      if (!user) {
        return res.status(400).json({
          Check,
          error: "Please Check Wheather the Email and the Password are Correct",
        });
      }

      // Now if user exist then we will check for the given password

      let passcomp = await bcrypt.compare(Password, user.Password);

      if (!passcomp) {
        return res.status(400).json({
          Check,
          error: "Please Check Wheather the Email and the Password are Correct",
        });
      }
      // Now if the Password is Correct we will Generate a auth token for the user
      const data = {
        user: {
          id: user.id,
        },
      };
      Check = true;
      const authtoken = jwt.sign(data, process.env.JWT as Secret);
      res.json({ Check, authtoken , user });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal  error Occured");
    }
  }
);

// Route 3 : To Change the Password

router.post(
  "/changepassword",
  async (req: Request, res: Response) => {
    let Check = false;
    // Again we will check for errors first
    const { Password } = req.body;
    try {
      const userID = req.body.user.id;
      const user = await User.findById(userID);
      if (user) {
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(Password, salt);
        user.Password = hashedpassword;
        user.save();
        Check = true;
        res.send({ Check, user });
      } else {
        res.status(400).send({Check , Msg : "User not found"});
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal  error Occured");
    }
  }
);

module.exports = router;
