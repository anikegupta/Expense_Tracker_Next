import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: [3, 'Atleast 3 characters are required!'],
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required !'],
    minLength: [6, 'Atleast 6 characters are required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required !'],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid Email [abc@gmail.com]!!'],
    unique: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  avatar: {
    type: String,
    default: '',
  },
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(15);
  const hashedPassword = await bcrypt.hash(user.password, salt);
  user.password = hashedPassword;
  next();
});

export default mongoose.models.User || mongoose.model('User', userSchema);