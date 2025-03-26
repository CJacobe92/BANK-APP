import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema(
    {
        firstname: {type: String, required: true},
        lastname: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
    },
    {
        timestamps: true, //created_at and updated_at
    }
);

// pre-save hook

userSchema.pre('save', async function(next){
    if (!this.isModified("password")) return next();

    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
})

const User = mongoose.model('User', userSchema);

export default User;