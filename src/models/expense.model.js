import mongoose, {Schema} from "mongoose";

const expenseSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'expense category is required'],
    },
    description: String,
    amount: {
        type : Number,
        required: [true, 'expense amount is required'],
        default: 0
    },
    expenseDate: Date
}, {timestamps: true})


expenseSchema.pre(/findOne|findById/, function() {
    this.populate({
        path: 'user',
        select: 'username fullName',
    }).populate({
        path: 'category',
        select: 'name'
    })
})
export const Expense = mongoose.model('Expense', expenseSchema)