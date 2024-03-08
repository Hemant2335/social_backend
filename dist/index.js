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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 5000;
require('dotenv').config();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: ["http://localhost:5173", "https://social-gamma-nine.vercel.app"] }));
// function to connect to the database
const connecttomongo = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(process.env.MONGO_URI);
    console.log("Database connected");
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
connecttomongo();
app.use("/auth", require("./routes/Auth"));
app.use("/post", require("./routes/Post"));
app.use("/intract", require("./routes/Interaction"));
app.get("/", (req, res) => {
    res.send("Welcome to the backend");
});
exports.default = app;
