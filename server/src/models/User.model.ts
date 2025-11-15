import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    email: string;
    password?: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    passwordResetToken: String,
    passwordResetExpires: Date,
}, {
    timestamps: true
});

// Middleware to hash the password before saving
UserSchema.pre('save', async function (next) {
    // 1. Check if the password field has been modified
    if (!this.isModified('password')) {
        return next(); // Use return here for clarity
    }
    
    // 2. Explicitly cast this.password to string to satisfy the bcrypt function argument type
    const passwordToHash = this.password as string;

    // 3. Generate salt (using a number is standard and type-safe)
    const salt = await bcrypt.genSalt(10);
    
    // 4. Hash the password using the string variable
    this.password = await bcrypt.hash(passwordToHash, salt);

    next();
});

// Method to compare entered password
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password!);
};

const User = mongoose.model<IUser>('User', UserSchema);
export default User;