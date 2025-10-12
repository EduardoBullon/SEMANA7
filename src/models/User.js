import mongoose from "mongoose";

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[#\$%&*@]).{8,}$/;

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: (v) => passwordRegex.test(v),
        message:
          "La contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 dígito y 1 caracter especial (# $ % & * @).",
      },
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    name: { type: String },
    lastName: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    birthdate: { type: Date, required: true },
    url_profile: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

UserSchema.virtual("age").get(function () {
  if (!this.birthdate) return null;
  const diffMs = Date.now() - this.birthdate.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
});

export default mongoose.model("User", UserSchema);
