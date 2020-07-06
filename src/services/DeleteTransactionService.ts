import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const transactionExist = await transactionRepository.find({
      where: { id },
    });

    if (transactionExist) await transactionRepository.remove(transactionExist);
    else throw new AppError('Transaction not found', 404);
  }
}

export default DeleteTransactionService;
