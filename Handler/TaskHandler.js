import stream from 'stream';
import CsvReadableStream from 'csv-reader';
import AutoDetectDecoderStream from 'autodetect-decoder-stream';
import KoinXTransaction from '../Database/model.js';

class TaskHandler {
    static task_1 = async (req, res) => {
        if (!req.file) {
            console.log("File not found");
            return res.status(400).json({
                message: "No file uploaded"
            });
        }
        let isFirstRow = true;
        const buffer = req.file.buffer;
        const bufferStream = new stream.PassThrough();
        bufferStream.end(buffer);

        const transactions = [];
        bufferStream.pipe(
            new AutoDetectDecoderStream({
                defaultEncoding: '1255'
            })).pipe(
                new CsvReadableStream({
                    parseNumbers: true,
                    parseBooleans: true,
                    trim: true
                })
            ).on('data', async function (row) {
                if (isFirstRow) {
                    isFirstRow = false
                    return;
                }
                try {
                    const transaction = new KoinXTransaction({
                        userId: row[0],
                        utcTime: new Date(row[1]),
                        operation: row[2],
                        market: row[3],
                        amount: parseFloat(row[4]),
                        price: parseFloat(row[5]),
                    });
                    await transaction.validate();
                    const Transaction = await transaction.save()
                } catch (error) {
                    console.error("Error processing CSV row:", error);
                    return res.status(400).json({
                        message: 'Invalid data format in CSV file'
                    });
                }
            }).on('end', async function () {
                console.log("All transactions saved successfully");
                return res.status(201).json({
                    message: "Data Added Successfully"
                })
            }).on('error', function (error) {
                console.log("Error reading CSV file:", error);
                return res.status(500).json({
                    message: 'Error processing CSV file'
                });
            });
    }


    static task_2 =async (req, res) => {
        try {
            const { timestamp } = req.query;
     
            const targetDate = new Date(timestamp);
    
       
            const transactions = await KoinXTransaction.find({ utcTime: { $lte: targetDate } });
    
  
            const balance = {};
            transactions.forEach(transaction => {
                if (!balance[transaction.market]) {
                    balance[transaction.market] = 0;
                }
                if (transaction.operation === 'Buy') {
                    balance[transaction.market] += transaction.amount;
                } else if (transaction.operation === 'Sell') {
                    balance[transaction.market] -= transaction.amount;
                }
            });
    

            Object.keys(balance).forEach(asset => {
                if (balance[asset] === 0) {
                    delete balance[asset];
                }
            });
    
            res.status(200).json({
                balance:balance
            });
        } catch (error) {
            console.error('Error fetching asset balance:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default TaskHandler;
