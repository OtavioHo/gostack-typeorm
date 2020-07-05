// import AppError from '../errors/AppError';

import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoryRepository = getRepository(Category);
    const existCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    let category_id: string;

    if (existCategory) {
      category_id = existCategory.id;
    } else {
      const newCategory = categoryRepository.create({ title: category });
      category_id = (await categoryRepository.save(newCategory)).id;
    }

    const transactionRepository = getRepository(Transaction);
    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id,
    });

    transactionRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
