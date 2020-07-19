import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRepository = getRepository(Transaction);
    const transactionExists = await transactionRepository.findOne({ id });
    if (!transactionExists) {
      throw new AppError('Transaction not found', 404);
    }
    await transactionRepository.remove(transactionExists);
  }
}

export default DeleteTransactionService;
