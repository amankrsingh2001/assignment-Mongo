const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
  name: {
    type:String,
    trim:true
  },
  username:{
    type:String,
    trim:true,
    unique:true
  },
  email: {
    type: String, unique: true
  },
  password: String
});

const Todo = new Schema({
    userId: ObjectId,
    title: {
      type:String,
      triim:true
    },
    done:{
      type:Boolean,
      default:false
    },
    createdAt:{
      type:Date,
      default:Date.now(),
      index:{
        expireAfterSeconds: 5 * 24 * 60 * 60
      }
    },
    doneBy: {
      type: String, 
      default: null,
      immutable: true
    },
},{
    timestamps: true, 
});

const UserModel = mongoose.model('users', User);
const TodoModel = mongoose.model('todos', Todo);

module.exports = {
    UserModel,
    TodoModel
}