import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const reducer = (
      accumulator: Balance,
      currentValue: Transaction,
    ): Balance => {
      if (currentValue.type === 'income') {
        accumulator.income += currentValue.value;
        accumulator.total += currentValue.value;
      } else {
        accumulator.outcome += currentValue.value;
        accumulator.total -= currentValue.value;
      }
      return accumulator;
    };

    const allTransactions = await this.find();
    const initialBalance: Balance = { income: 0, outcome: 0, total: 0 };

    const balance = allTransactions.reduce(reducer, initialBalance);

    return balance;
  }
}

export default TransactionsRepository;
