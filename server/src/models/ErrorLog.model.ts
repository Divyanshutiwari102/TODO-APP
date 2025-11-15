import mongoose, { Document, Schema } from 'mongoose';

// Defines the mandatory log collection structure
interface IErrorLog extends Document {
    method: string;
    url: string;
    message: string;
    stack?: string;
    timestamp: Date;
    body?: any;
    user?: mongoose.Schema.Types.ObjectId;
}

const ErrorLogSchema: Schema = new Schema({
    method: { type: String, required: true },
    url: { type: String, required: true },
    message: { type: String, required: true },
    stack: { type: String },
    timestamp: { type: Date, default: Date.now },
    body: { type: Schema.Types.Mixed },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
}, {
    collection: 'error_logs' // Mandatory separate collection name
});

const ErrorLog = mongoose.model<IErrorLog>('ErrorLog', ErrorLogSchema);
export default ErrorLog;