"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// All the required imports
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Creating a Router using Express
const router = express_1.default.Router();
// Route 1 : To Create  a User PORT : api/auth/createuser
router.post("/signup", [
    (0, express_validator_1.body)("Name", "Enter a Valid Name").isLength({ min: 3 }),
    (0, express_validator_1.body)("Email", "Enter a Valid Email").isEmail(),
    (0, express_validator_1.body)("Password", "Enter a Valid Password").isLength({ min: 5 }),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let Check = false;
    // IF there will be any error it will validate and check
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ Check, errors: errors.array() });
    }
    // Now Checking if there is no other user existing with the same email
    let user = yield User_1.default.findOne({ Email: req.body.Email });
    if (user) {
        return res
            .status(400)
            .json({ Check, error: "User with same email exist" });
    }
    // Now if it passes all the tests
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedpassword = yield bcrypt_1.default.hash(req.body.Password, salt);
    // Creating a User
    try {
        const user = yield User_1.default.create({
            Name: req.body.Name,
            Email: req.body.Email,
            Password: hashedpassword,
            Posts: [],
        });
        const token = jsonwebtoken_1.default.sign({ user: { id: user.id } }, process.env.JWT);
        Check = true;
        res.status(200).json({ Check, msg: "User Created", authtoken: token, user });
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal error Occured");
    }
}));
//Route 2 : To Authenticate and login the user
router.post("/signin", [
    (0, express_validator_1.body)("Email", "Enter a Valid Email").isEmail(),
    (0, express_validator_1.body)("Password", "Password Cannot be Blank").exists(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let Check = false;
    // Again we will check for errors first
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ Check, errors: errors.array() });
        }
        const { Email, Password } = req.body;
        // Now for the Validation part first we will check if the entered email exist or not
        let user = yield User_1.default.findOne({ Email });
        if (!user) {
            return res.status(400).json({
                Check,
                error: "Please Check Wheather the Email and the Password are Correct",
            });
        }
        // Now if user exist then we will check for the given password
        let passcomp = yield bcrypt_1.default.compare(Password, user.Password);
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
        const authtoken = jsonwebtoken_1.default.sign(data, process.env.JWT);
        res.json({ Check, authtoken, user });
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal  error Occured");
    }
}));
// Route 3 : To Change the Password
router.post("/changepassword", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let Check = false;
    // Again we will check for errors first
    const { Email, Password } = req.body;
    try {
        const user = yield User_1.default.findOne({ Email: Email });
        if (user) {
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashedpassword = yield bcrypt_1.default.hash(Password, salt);
            user.Password = hashedpassword;
            user.save();
            Check = true;
            res.send({ Check, user });
        }
        else {
            res.status(400).send({ Check, Msg: "User not found" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal  error Occured");
    }
}));
module.exports = router;
