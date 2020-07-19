import path from 'path';
import fs from 'fs';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';
import uploadConfig from '../config/uploadConfig';

class ImportTransactionsService {
  async execute(fileName: string): Promise<Transaction[]> {
    const importedFilePath = path.join(uploadConfig.directory, fileName);
    const createTransactionService = new CreateTransactionService();
    const fileContent = await (await fs.promises.readFile(importedFilePath))
      .toLocaleString()
      .split(/\r\n|\n/)
      .slice(1, -1);
    await fs.promises.unlink(importedFilePath);
    const transactions: Transaction[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const stringLine of fileContent) {
      if (typeof stringLine === typeof '') {
        const [title, typeStr, valueStr, category] = stringLine
          .split(',')
          .map(item => item.trim());
        const type = typeStr === 'income' ? 'income' : 'outcome';
        const value = Number(valueStr);
        // eslint-disable-next-line no-await-in-loop
        const transaction = await createTransactionService.execute({
          title,
          type,
          value,
          category,
        });
        transactions.push(transaction);
      }
    }
    return transactions;
  }
}

export default ImportTransactionsService;
