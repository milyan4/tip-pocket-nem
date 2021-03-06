import {
  XEM,
  Account,
  AccountHttp,
  Address,
  AccountInfoWithMetaData,
  SignedTransaction,
  SimpleWallet,
  Password,
  Pageable,
  NemAnnounceResult,
  NEMLibrary,
  NetworkTypes,
  TimeWindow,
  Transaction,
  TransferTransaction,
  TransactionHttp,
} from 'nem-library';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SendParameters } from './wallet/data-class';

NEMLibrary.bootstrap(NetworkTypes.MAIN_NET);

const accountHttpWithCustomNode: AccountHttp = new AccountHttp([
  { protocol: 'http', domain: '176.9.68.110', port: 7890 },
  { protocol: 'http', domain: '108.61.182.27', port: 7890 },
  { protocol: 'http', domain: '104.238.161.61', port: 7890 },
  { protocol: 'http', domain: '185.122.58.130', port: 7890 },
  { protocol: 'http', domain: 'nempragt5.manitpro.be', port: 7890 },
  { protocol: 'http', domain: 'asia.manitpro.be', port: 7890 },
  { protocol: 'http', domain: 'rabanne.manitpro.be', port: 7890 },
  { protocol: 'http', domain: '153.122.85.177', port: 7890 },
]);

export default class Nem {
  private accountHttp: AccountHttp = accountHttpWithCustomNode;

  // アカウント作成
  public createAccount(walletName: string, pass: string): SimpleWallet {
    const password = new Password(pass);
    return SimpleWallet.create(walletName, password);
  }

  public getAllTransactionsPaginated(addr: string): Pageable<Transaction[]> {
    const address = new Address(addr);
    return this.accountHttp.allTransactionsPaginated(address);
  }

  public getBalance(addr: string): Observable<AccountInfoWithMetaData> {
    const address = new Address(addr);
    return this.accountHttp.getFromAddress(address);
  }

  public send(account: Account, parameters: SendParameters): Observable<NemAnnounceResult> {
    const transferTransaction = TransferTransaction.create(
      TimeWindow.createWithDeadline(),
      new Address(parameters.receiverAddress),
      new XEM(parameters.amount),
      parameters.message,
    );

    const transactionHttp = new TransactionHttp();

    const signedTransaction: SignedTransaction = account.signTransaction(transferTransaction);

    return transactionHttp.announceTransaction(signedTransaction);
  }

  public getDivisibility(): number {
    return Math.pow(10, 6);
  }
}

