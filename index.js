const express = require("express");
const { UserModel, TodoModel } = require("./db");
const { auth, JWT_SECRET } = require("./auth");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

mongoose.connect("");

const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const username = req.body.username

  const existingUser = await UserModel.findOne({ email: email, username:username });

  if (existingUser) {
    return res.status(401).json({ message: "Email or Username already registered" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await UserModel.create({
    email: email,
    password: hashedPassword,
    name: name,
    username:username
  });

  res.json({
    message: "You are signed up",
  });
});

app.post("/signin", async  (req, res)=> {
try {
      const email = req.body.email;
      const password = req.body.password;
    
      const response = await UserModel.findOne({
        email: email, //How can we find a user if we have hashed the password
      });
     

      if(!response){
        return res.status(401).json({message:'User Not Found'})
      }
   

      const validUser =  bcrypt.compare(password, response.password)
    
      if(!validUser){
        return res.status(403).json({message:"Invalid Credentials"})
      }
    
      if (validUser) {
        const token = jwt.sign({ id: response._id,email:response.email},
          JWT_SECRET
        );
        res.json({ token });
      } else {
        res.status(403).json({
          message: error.message,
        });
      }
} catch (error) {
    return res.status(500).json({message:"Something went wrong"})
}
});

app.post("/todo", auth, async function (req, res) {
  const userId = req.userId;
  const title = req.body.title;
  const done = req.body.done;
  const doneBy = req.body.username

    const userExist = await UserModel.findOne({username:doneBy})

    if(!userExist){
        return res.status(401).json({message:'User who got task doesn"t exsit please assign to other one'})
    }

  await TodoModel.create({
    userId,
    title,
    done,
    doneBy,
  });

  res.json({
    message: "Todo created",
  });
});

app.get("/todos", auth, async function (req, res) {
  const userId = req.userId;

  const todos = await TodoModel.find({
    userId,
  });

  res.json({
    todos,
  });
});

app.listen(3000, () => {
  console.log("Connected");
});
