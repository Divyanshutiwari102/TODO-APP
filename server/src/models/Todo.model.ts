import mongoose, { Document, Schema } from 'mongoose';

export interface ITodo extends Document {
    user: mongoose.Schema.Types.ObjectId;
    todo: string;
    isDone: boolean; // Mark as Completed or Not Completed
}

const TodoSchema: Schema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    todo: {
        type: String,
        required: true,
    },
    isDone: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    timestamps: true,
});

const Todo = mongoose.model<ITodo>('Todo', TodoSchema);
export default Todo;