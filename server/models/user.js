const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],

    validate: {
      validator: function(username) {
        // console.log(this);
        return User.find({ "_id": { "$ne": this._id }})
          .then(members => {
            const duplicate = members.filter(member => member.username.toLowerCase() === username.toLowerCase())[0];
            if (duplicate) return false;
          })
      },
      message: props => `Username ${props.value} has been taken already.`,
    }

  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },

  projects: [{
    type: Schema.Types.ObjectId,
    ref: "Project",
  }],

  todos: [{
    type: Schema.Types.ObjectId,
    ref: "Todo",
  }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;