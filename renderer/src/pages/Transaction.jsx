import React, { useEffect, useState } from 'react';
import Dropdown from '../components/Dropdown';
import useTitle from '../hooks/useTitle';
import Modal, { ModalBox, ModalCloseFunction, ModalShowButton } from '../components/Modal';
import { AnimatePresence, motion } from 'framer-motion';
import AccountSelect from '../components/AccountSelect';
import { DebtFundingTransactionForm, DebtRepaymentTransactionForm, DebtSpendingTransactionForm, ExpenseTransactionForm, IncomeTransactionForm, LendingTransactionForm, RepaymentTransactionForm, TransferTransactionForm } from '../components/TransactionForms';
import useDateFormatter from '../hooks/useDateFormatter';
import TransactionCard from '../components/TransactionCard';
import AlertDialog, { AlertDialogShowButton } from '../components/AlertDialog';

const MotionWrapper = ({ children, ...props }) => {
    return (
        <motion.fieldset
            {...props}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "backOut" }}
            className="fieldset font-normal"
        >
            {children}
        </motion.fieldset>
    )
}

const Transaction = () => {
    const setTitle = useTitle();
    setTitle('Transaction');
    const dateFormat = useDateFormatter();

    // TRANSACTIONS DATA
    const [transactionsData, setTransactionsData] = useState([]);
    const [filters, setFilters] = useState({});
    async function fillUpTransactionsData() {
        const data = await window.electronAPI.transaction.getAll();
        setTransactionsData(data);
    }

    useEffect(() => {
        fillUpTransactionsData();
    }, [])

    const [transactionType, setTransactionType] = useState('income');
    const [result, setResult] = useState({});

    useEffect(() => {
        if (!result.success) return;

        ModalCloseFunction('transaction_modal');
        setTransactionsData([...[result.dataResult], ...transactionsData]);
    }, [result])

    const RenderAddTransactionForm = () => {
        switch (transactionType) {
            case 'income':
                return <MotionWrapper key={transactionType}><IncomeTransactionForm getResult={(result) => setResult(result)} /></MotionWrapper>
            case 'expense':
                return <MotionWrapper key={transactionType}><ExpenseTransactionForm getResult={(result) => setResult(result)} /></MotionWrapper>
            case 'transfer':
                return <MotionWrapper key={transactionType}><TransferTransactionForm getResult={(result) => setResult(result)} /></MotionWrapper>
            case 'lending':
                return <MotionWrapper key={transactionType}><LendingTransactionForm getResult={(result) => setResult(result)} /></MotionWrapper>
            case 'repayment':
                return <MotionWrapper key={transactionType}><RepaymentTransactionForm getResult={(result) => setResult(result)} /></MotionWrapper>
            case 'debt_funding':
                return <MotionWrapper key={transactionType}><DebtFundingTransactionForm getResult={(result) => setResult(result)} /></MotionWrapper>
            case 'debt_spending':
                return <MotionWrapper key={transactionType}><DebtSpendingTransactionForm getResult={(result) => setResult(result)} /></MotionWrapper>
            case 'debt_repayment':
                return <MotionWrapper key={transactionType}><DebtRepaymentTransactionForm getResult={(result) => setResult(result)} /></MotionWrapper>

            default:
                break;
        }
    }

    let date = '';
    return (
        <div className="flex flex-col gap-2 p-8">
            <div className="top-18 z-1 sticky flex items-center gap-2">
                <label className="input">
                    <svg className="opacity-50 h-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </g>
                    </svg>
                    <input type="search" placeholder="Search" />
                </label>
                <Dropdown className="dropdown-center">
                    <Dropdown.Button id="dropdown_filter_toggle" className="btn btn-neutral">
                        Filters
                    </Dropdown.Button>
                    <Dropdown.Content>
                        <form onSubmit={(e) => { e.preventDefault(); document.getElementById('dropdown_filter_toggle').click() }} className="gap-x-2 gap-y-1.5  grid grid-cols-2 [&>.label]:ml-1 p-3 w-md">
                            <label className="col-span-2 label">Date Range</label>
                            <label className="input">
                                From:
                                <input value={filters.from ?? ''} max={filters.to} onChange={(e) => setFilters({ ...filters, from: e.target.value })} type="date" className="grow" placeholder="dd/mm/yyyy" />
                            </label>
                            <label className="input">
                                To:
                                <input value={filters.to ?? ''} min={filters.from} onChange={(e) => setFilters({ ...filters, to: e.target.value })} type="date" className="grow" placeholder="dd/mm/yyyy" />
                            </label>
                            <label className="col-span-2 label">Transaction Type</label>
                            <select value={filters.type ?? ''} onChange={(e) => setFilters({ ...filters, type: e.target.value })} className="col-span-2 w-full select">
                                <option>All</option>
                                <option value="tranfer">Transfer</option>
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                                <option value="debt">Debt</option>
                            </select>
                            <label className="col-span-2 label">Account Involved</label>
                            <AccountSelect className="col-span-2" selectedID={filters.accountID} getVal={(val) => setFilters({ ...filters, accountID: val?.id })}>
                                <option>All</option>
                            </AccountSelect>
                            <button type="button" onClick={() => { setFilters({}); document.getElementById('dropdown_filter_toggle').click() }} className="btn-outline btn">Clear</button>
                            <button className="btn btn-neutral">Apply Filters</button>
                        </form>
                    </Dropdown.Content>
                </Dropdown>
                <ModalShowButton targetID="transaction_modal" className="btn btn-primary ml-auto">Create Transaction</ModalShowButton>
            </div>
            {transactionsData[0] ? '' :
                <div className="flex p-10 text-base-content/50 justify-center w-full">
                    No Data Found
                </div>
            }
            {transactionsData.map((row, index) => {
                const current_row_date = dateFormat(row.created_at, { year: 'numeric', month: 'long' });
                return (
                    <React.Fragment key={index}>
                        {(current_row_date != date) &&
                            <div className="flex items-center gap-2 px-2 text-nowrap">
                                {date = current_row_date}
                                <div className="border-t border-base-content/50 w-full h-min"></div>
                            </div>
                        }
                        <TransactionCard data={row} />
                    </React.Fragment>
                )
            })}

            <Modal id="transaction_modal">
                <ModalBox className="overflow-hidden">
                    <h2 className="text-lg">Create New Transaction</h2>

                    <fieldset className="fieldset font-semibold">
                        <label className="label">
                            Type
                            <div className="tooltip tooltip-right w-min">
                                <div className="tooltip-content p-4 flex flex-col text-start translate-y-[40%] [&>div]:flex [&>div>div]:ml-2 [&_span]:opacity-80 [&_span]:font-normal gap-1">
                                    <div>List of Transaction Types:</div>
                                    <div>-<div>Income:<span> Money received, such as from salary, sales, or other sources of earnings.</span></div></div>
                                    <div>-<div>Expense:<span> Money spent directly on goods, services, or other costs.</span></div></div>
                                    <div>-<div>Transfer:<span> Moving money between your own accounts (e.g. bank to wallet).</span></div></div>
                                    <div>-<div>Lending:<span> Lending money to someone.</span></div></div>
                                    <div>-<div>Repayment:<span> Repayment for the money you previously lent.</span></div></div>
                                    <div>-<div>Debt Funding:<span> Borrowed money added to your account (e.g. borrowing from a friend into your wallet).</span></div></div>
                                    <div>-<div>Debt Spending:<span> Borrowing money to spend immediately, without adding it to your account.</span></div></div>
                                    <div>-<div>Debt Repayment:<span> Paying back money you previously borrowed (reducing your debt).</span></div></div>
                                </div>
                                <button className="[&>svg]:size-4 flex gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12 2 6.47715 6.47715 2 12 2 17.5228 2 22 6.47715 22 12 22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12 20 7.58172 16.4183 4 12 4 7.58172 4 4 7.58172 4 12 4 16.4183 7.58172 20 12 20ZM13 10.5V15H14V17H10V15H11V12.5H10V10.5H13ZM13.5 8C13.5 8.82843 12.8284 9.5 12 9.5 11.1716 9.5 10.5 8.82843 10.5 8 10.5 7.17157 11.1716 6.5 12 6.5 12.8284 6.5 13.5 7.17157 13.5 8Z"></path></svg>
                                </button>
                            </div>
                        </label>
                        <div className="flex">
                            <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)} className="select w-full">
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                                <option value="transfer">Transfer</option>
                                <option value="lending">Lending</option>
                                <option value="repaymentk">Repayment</option>
                                <option value="debt_funding">Debt Funding</option>
                                <option value="debt_spending">Debt Spending</option>
                                <option value="debt_repayment">Debt Repayment</option>
                            </select>
                        </div>

                        <AnimatePresence mode="wait">
                            {RenderAddTransactionForm()}
                        </AnimatePresence>
                    </fieldset>
                </ModalBox>
            </Modal>
        </div>
    );
}

export default Transaction;