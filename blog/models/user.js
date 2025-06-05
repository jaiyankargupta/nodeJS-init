const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("node:crypto");
const { createTokenForUser } = require("../services/auth");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    salt: {
      type: String,
    },

    password: {
      type: String,
      required: true,
    },
    ProfileImage: {
      type: String,
      default: "/images/default.webp",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },

  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  const salt = randomBytes(16).toString("hex");
  const hashPass = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  user.salt = salt;
  user.password = hashPass;
  next();
});

userSchema.static(
  "matchedPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) throw new Error("User not found!");

    const salt = user.salt;
    const hashedPassword = user.password;
    const userHashPass = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    if (hashedPassword !== userHashPass) throw new Error("Incorrect Password");
    const token = createTokenForUser(user);
    return token;
  }
);

const User = model("user", userSchema);

module.exports = User;
