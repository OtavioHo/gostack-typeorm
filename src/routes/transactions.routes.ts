import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';
import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find({
    relations: ['category'],
  });
  const balance = await transactionsRepository.getBalance();
  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, type, value, category } = request.body;
  const transaction = await new CreateTransactionService().execute({
    title,
    type,
    value,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  await new DeleteTransactionService().execute({ id });

  return response.status(204).json();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const { path } = request.file;
    const transactions = await new ImportTransactionsService().execute(path);

    return response.json(transactions);
  },
);

export default transactionsRouter;
