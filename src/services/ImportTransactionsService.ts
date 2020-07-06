import csvParse from 'csv-parse';
import fs from 'fs';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const readCSVStream = fs.createReadStream(filePath);
    const createTransactionService = new CreateTransactionService();

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const transactions: Transaction[] = [];

    parseCSV.on('data', async row => {
      const transaction = await createTransactionService.execute({
        title: row[0],
        type: row[1],
        value: parseFloat(row[2]),
        category: row[3],
      });
      transactions.push(transaction);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    const fileExist = await fs.promises.stat(filePath);
    if (fileExist) {
      await fs.promises.unlink(filePath);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
