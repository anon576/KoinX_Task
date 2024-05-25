import mongoose from 'mongoose'

const Transaction = new mongoose.Schema({
    userId: { type: String, required: true },
    utcTime: { type: Date, required: true },
    operation: { type: String, required: true },
    market: { type: String, required: true },
    amount: { type: Number, required: true },
    price: { type: Number, required: true }
})


const KoinXTransaction = mongoose.model('Transaction',Transaction)

export default KoinXTransaction