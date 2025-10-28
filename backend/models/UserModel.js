// backend/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: 6,
    },
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        qty: {
          type: Number,
          default: 1,
        },
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default:
        "data:image/webp;base64,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",
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
