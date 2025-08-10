import { useState } from "react";
import useCurrencyFormatter from "../hooks/useCurrencyFormatter";
import AccountSelect from "./AccountSelect";
import CurrencyInput from "./CurrencyInput";
import { ModalCloseButton } from "./Modal";
import useRefreshKey from "../hooks/useRefreshKey";
import AlertDialog, { AlertDialogShowButton, AlertDialogShowFunction } from "./AlertDialog";

export function IncomeTransactionForm({ getResult, editData = {} }) {
    const { currFormat } = useCurrencyFormatter();
    const { triggerRefresh } = useRefreshKey();

    //// FORM DATA
    const [data, setData] = useState(editData);
    const destinationBalanceAfter = data.destination_balance + data.amount;

    //// VALIDATION
    const [errorState, setErrorState] = useState({});
    const validate = () => {
        const error = {};
        if (!data.title) error.title = '*transaction must have a title.';
        if (!data.destination_id) error.destination = '*destination account is required';
        if (data.amount <= 0) error.amount = '*transaction amount cannot be zero or negative';
        setErrorState(error);
        if (Object.keys(error).length == 0) AlertDialogShowFunction('save_dialog');
    }

    //// SAVING
    const save = async () => {
        const result = await window.electronAPI.transaction.addIncome({ ...data });
        if (getResult) getResult(result);
        if (!result.success) return;
        setTimeout(() => {
            setData({});
            triggerRefresh();
        }, 300);
    }
    return (
        <>
            <label className="label">Title</label>
            <input value={data.title ?? ''} onChange={(e) => setData((prev) => ({ ...prev, title: e.target.value }))} type="text" placeholder="..." className="input w-full" />
            {errorState.title && <label className="label text-error">{errorState.title}</label>}

            <label className="label">To</label>
            <AccountSelect where="type IN ('cash', 'bank')" selectedID={data.destination_id} getVal={(val) => setData((prev) => ({ ...prev, destination_id: val?.id, destination_balance: val?.balance }))} />
            {data.destination_id &&
                <label className="label">Balance: {currFormat(data.destination_balance)}&nbsp;&nbsp;|&nbsp;&nbsp;Balance After: {currFormat(destinationBalanceAfter)}</label>
            }
            {errorState.destination && <label className="label text-error">{errorState.destination}</label>}

            <label className="label">Amount</label>
            <CurrencyInput value={data.amount ?? 0} getVal={(val) => setData((prev) => ({ ...prev, amount: val }))} className="input w-full" />
            {errorState.amount && <label className="label text-error">{errorState.amount}</label>}

            <label className="label">Note</label>
            <textarea value={data.note ?? ''} onChange={(e) => setData((prev) => ({ ...prev, note: e.target.value }))} className="textarea w-full" placeholder="..."></textarea>

            <div className="flex w-full gap-2 mt-1">
                <button data-btn-close type="button" className="btn btn-outline grow">Cancel</button>
                <button onClick={validate} className="btn btn-primary grow">Save</button>
                <AlertDialog id="save_dialog" className="p-4 rounded-box bg-base-100 gap-2 flex flex-col w-80">
                    <h3 className="font-semibold text-lg">Are you sure you want to save this transaction to your records?</h3>
                    <div className="grid grid-cols-2 w-full gap-2">
                        <button data-btn-close className="btn btn-outline">No, Wait</button>
                        <button data-btn-close onClick={save} className="btn btn-primary">Yes, Save</button>
                    </div>
                </AlertDialog>
            </div>
        </>
    )
}

export function ExpenseTransactionForm({ getResult, editData = {} }) {
    const { currFormat } = useCurrencyFormatter();
    const { triggerRefresh } = useRefreshKey();

    //// FORM DATA
    const [data, setData] = useState(editData);
    const sourceBalanceAfter = data.source_balance - data.amount;

    //// VALIDATING
    const validate = () => {
        const error = {};
        if (!data.title) error.title = '*transaction must have a title.';
        if (!data.source_id) error.source = '*source account is required';
        if (data.amount <= 0) error.amount = '*transaction amount cannot be zero or negative ';
        if (sourceBalanceAfter < 0) error.amount = '*transaction amount cannot exceeds account balance'
        setErrorState(error);
        if (Object.keys(error).length === 0) AlertDialogShowFunction('save_dialog');
    }

    //// SAVING
    const [errorState, setErrorState] = useState({});
    async function save() {
        const result = await window.electronAPI.transaction.addExpense({ ...data });
        if (getResult) getResult(result);
        if (!result.success) return;
        setTimeout(() => {
            setData({});
            triggerRefresh();
        }, 300);
    }
    return (
        <>
            <label className="label">Title</label>
            <input value={data.title ?? ''} onChange={(e) => setData((prev) => ({ ...prev, title: e.target.value }))} type="text" placeholder="Type here" className="input w-full" />
            {errorState.title && <label className="label text-error">{errorState.title}</label>}

            <label className="label">Source Of Fund</label>
            <AccountSelect where="type IN ('cash', 'bank')" selectedID={data.source_id} getVal={(val) => setData((prev) => ({ ...prev, source_id: val?.id, source_balance: val?.balance }))} />
            {data.source_id &&
                <label className="label">Balance: {currFormat(data.source_balance)}&nbsp;&nbsp;|&nbsp;&nbsp;Balance After: {currFormat(sourceBalanceAfter)}</label>
            }
            {errorState.source && <label className="label text-error">{errorState.source}</label>}

            <label className="label">Amount</label>
            <CurrencyInput value={data.amount} getVal={(val) => setData((prev) => ({ ...prev, amount: val }))} className="input w-full" />
            {errorState.amount && <label className="label text-error">{errorState.amount}</label>}

            <label className="label">Note</label>
            <textarea value={data.note} onChange={(e) => setData((prev) => ({ ...prev, note: e.target.value }))} className="textarea w-full" placeholder="..."></textarea>
            <div className="flex w-full gap-2 mt-1">
                <button data-btn-close type="button" className="btn btn-outline grow">Cancel</button>
                <button onClick={validate} className="btn btn-primary grow">Save</button>
                <AlertDialog id="save_dialog" className="p-4 rounded-box bg-base-100 gap-2 flex flex-col w-80">
                    <h3 className="font-semibold text-lg">Are you sure you want to save this transaction to your records?</h3>
                    <div className="grid grid-cols-2 w-full gap-2">
                        <button data-btn-close className="btn btn-outline">No, Wait</button>
                        <button data-btn-close onClick={save} className="btn btn-primary">Yes, Save</button>
                    </div>
                </AlertDialog>
            </div>
        </>
    )
}

export function TransferTransactionForm({ editData }) {
    const [data, setData] = useState({});
    const { currFormat } = useCurrencyFormatter();

    const sourceBalanceAfter = (data.source?.balance ?? 0) - data.amount;
    const destinationBalanceAfter = (data.destination?.balance ?? 0) + data.amount;

    return (
        <fieldset className="fieldset flex flex-col pt-0">
            <label className="label">Title</label>
            <input type="text" placeholder="Type here" className="input w-full" />
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                <label className="label">From</label>
                <label className="label">To</label>
                <AccountSelect where="type IN ('cash', 'bank')" showBalance={false} getVal={(val) => setData({ ...data, source: val })} />
                <AccountSelect where="type IN ('cash', 'bank')" showBalance={false} getVal={(val) => setData({ ...data, destination: val })} />
                <label className="label">Balance After: {currFormat((data.source?.balance ?? 0) - data.amount)}</label>
                <label className="label">Balance After: {currFormat((data.destination?.balance ?? 0) + data.amount)}</label>
            </div>
            <label className="label">Amount</label>
            <CurrencyInput value={0} getVal={(val) => { setData({ ...data, amount: val }) }} className="input w-full" />
            <label className="label">Note</label>
            <textarea className="textarea w-full" placeholder="..."></textarea>
            <div className="flex w-full gap-2 mt-1">
                <ModalCloseButton type="button" targetID="transaction_modal" className="btn btn-outline grow">Cancel</ModalCloseButton>
                <button className="btn btn-primary grow">Save</button>
            </div>
        </fieldset>
    )
}

export function LendingTransactionForm({ editData }) {
    const [data, setData] = useState({});
    const { currFormat } = useCurrencyFormatter();

    const sourceBalanceAfter = (data.source?.balance ?? 0) - data.amount;
    const destinationBalanceAfter = (data.destination?.balance ?? 0) + data.amount;

    return (
        <fieldset className="fieldset flex flex-col pt-0">
            <label className="label">Title</label>
            <input type="text" placeholder="Type here" className="input w-full" />
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                <label className="label">From</label>
                <label className="label">To</label>
                <AccountSelect where="type IN ('cash', 'bank')" showBalance={false} getVal={(val) => setData({ ...data, source: val })} />
                <AccountSelect where="type = 'receivable'" showBalance={false} getVal={(val) => setData({ ...data, destination: val })} />
                <label className="label">Balance After: {data.source ? currFormat(sourceBalanceAfter) : '-'}</label>
                <label className="label">Owed: {data.destination ? currFormat(destinationBalanceAfter) : '-'}</label>
            </div>
            <label className="label">Amount</label>
            <CurrencyInput value={0} getVal={(val) => setData({ ...data, amount: val })} className="input w-full" />
            <label className="label">Note</label>
            <textarea className="textarea w-full" placeholder="..."></textarea>
            <div className="flex w-full gap-2 mt-1">
                <ModalCloseButton type="button" targetID="transaction_modal" className="btn btn-outline grow">Cancel</ModalCloseButton>
                <button className="btn btn-primary grow">Save</button>
            </div>
        </fieldset>
    )
}

export function RepaymentTransactionForm({ editData }) {
    const [data, setData] = useState({});
    return (
        <>

        </>
    )
}

export function DebtFundingTransactionForm({ editData }) {
    const [data, setData] = useState({});
    return (
        <>

        </>
    )
}

export function DebtSpendingTransactionForm({ editData }) {
    const [data, setData] = useState({});
    return (
        <fieldset className="fieldset flex flex-col">
            <label className="label">Title</label>
            <input type="text" placeholder="Type here" className="input w-full" />
            <label className="label">Debt Account</label>
            <AccountSelect where="type = 'debt'" balanceCalc={-(data.amount ?? 0)} getVal={(val) => console.log(JSON.stringify(val))} />
            <label className="label">Amount</label>
            <CurrencyInput value={0} getVal={(val) => { setData({ ...data, amount: val }); console.log(val) }} className="input w-full" />
            <label className="label">Note</label>
            <textarea className="textarea w-full" placeholder="..."></textarea>
            <div className="flex w-full gap-2 mt-1">
                <ModalCloseButton type="button" targetID="transaction_modal" className="btn btn-outline grow">Cancel</ModalCloseButton>
                <button className="btn btn-primary grow">Save</button>
            </div>
        </fieldset>
    );
}

export function DebtRepaymentTransactionForm({ editData }) {
    const [data, setData] = useState({});
    return (
        <>

        </>
    );
}