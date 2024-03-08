import express from "express";
import mongoose from "mongoose";
import cors from "cors";
const app = express();
const PORT = 5000;
require('dotenv').config();
app.use(express.json());
app.use(cors({origin: ["http://localhost:5173" , "https://social-gamma-nine.vercel.app"]}));

// function to connect to the database

const connecttomongo = async()=>{
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Database connected");
}
app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`);
})
connecttomongo();

app.use("/auth" , require("./routes/Auth"));
app.use("/post" , require("./routes/Post"));
app.use("/intract", require("./routes/Interaction"));

app.get("/", (req, res) => {
    res.send("Welcome to the backend");
});


export default app;