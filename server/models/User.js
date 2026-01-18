import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    password: { type: String, required: true, minlength: 6 },

    phone: {
      type: String,
      required: true,
      match: [/^\+254\d{9}$/, 'Invalid Kenyan phone number'],
    },

    avatar: { type: String, default: '' },

    role: { type: String, default: 'user' },

    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/* ===================== 🔐 Pre-save Hook ===================== */
/**
 * Hash password only once before saving when the password field is modified.
 */
userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next(); // only hash when changed
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

/* ===================== 🔍 Compare Passwords ===================== */
/**
 * Checks if the provided password matches the stored hash.
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/* ===================== 🔄 Set New Password ===================== */
/**
 * Set a new plaintext password on the user instance.
 * Do NOT hash here — the pre('save') hook will hash once when saving.
 *
 * Usage:
 *   await user.setPassword('myNewPlaintext');
 *   await user.save(); // pre-save will hash it
 */
userSchema.methods.setPassword = async function (newPassword) {
  this.password = newPassword; // set plaintext, pre-save will hash once
};

const User = mongoose.model('User', userSchema);
export default User;
