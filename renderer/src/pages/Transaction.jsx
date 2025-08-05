import { useState } from 'react';
import Dropdown from '../components/Dropdown';
import useTitle from '../hooks/useTitle';
function Transaction() {
    const [filters, setFilters] = useState({});
    useTitle('Transaction');
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
                        <form onSubmit={(e) => { e.preventDefault(); document.getElementById('dropdown_filter_toggle').click() }} className="gap-2 grid grid-cols-2 [&>.label]:ml-1 p-3 w-[26rem]">
                            <label className="col-span-2 label">Date Range</label>
                            <label className="input">
                                From:
                                <input value={filters.from} max={filters.to} onChange={(e) => setFilters({ ...filters, from: e.target.value })} type="date" className="grow" placeholder="dd/mm/yyyy" />
                            </label>
                            <label className="input">
                                To:
                                <input value={filters.to} min={filters.from} onChange={(e) => setFilters({ ...filters, to: e.target.value })} type="date" className="grow" placeholder="dd/mm/yyyy" />
                            </label>
                            <label className="col-span-2 label">Transaction Type</label>
                            <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} className="col-span-2 w-full select">
                                <option>All</option>
                                <option value="tranfer">Transfer</option>
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                                <option value="debt">Debt</option>
                            </select>
                            <label className="col-span-2 label">Account Involved</label>
                            <select value={filters.account} onChange={(e) => setFilters({ ...filters, account: e.target.value })} className="col-span-2 w-full select">
                                <option>All</option>
                                <option value="Wallet">Wallet</option>
                                <option value="BCA Account">BCA Account</option>
                            </select>
                            <button type="button" onClick={() => { setFilters({}); document.getElementById('dropdown_filter_toggle').click() }} className="btn-outline btn">Clear</button>
                            <button className="btn btn-neutral">Apply Filters</button>
                        </form>
                    </Dropdown.Content>
                </Dropdown>
                <button className="ml-auto btn btn-primary" onClick={() => document.getElementById('make_transaction_modal').showModal()}>Make Transaction</button>
            </div>
            <div className="flex items-center gap-2 px-2 text-nowrap">
                February 2025
                <div className="border-t border-base-content/50 w-full h-min"></div>
            </div>
            <div className="flex items-center gap-2 bg-base-200 hover:shadow-md px-8 py-4 border-def border-base-300 rounded-field transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
                <div className="flex flex-col min-w-[25%]">
                    <h3 className="font-semibold">Debt Transaction</h3>
                    <span className="text-xs text-base-content/50">Sunday, 20 Feb 2025</span>
                </div>
                <div className="flex flex-col min-w-[30%]">
                    <div className="flex items-center">Total: <div className="ml-1 badge badge-neutral">Rp100.000</div></div>
                    <span className="text-xs text-base-content/50">To: Wallet (Balance after: Rp500.000)</span>
                </div>
                <span className="max-w-[30%] text-xs text-base-content/50 text-ellipsis line-clamp-3">Note: Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus animi adipisci recusandae incidunt optio voluptas magnam error quisquam ipsa voluptatum dolore architecto, saepe, praesentium maiores officiis tempore repellat facere reiciendis!</span>
                <div className="ml-auto badge badge-soft badge-error">Debt</div>
            </div>
            <div className="flex items-center gap-2 bg-base-200 hover:shadow-md px-8 py-4 border-def border-base-300 rounded-field transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
                <div className="flex flex-col min-w-[25%]">
                    <h3 className="font-semibold">Expense Transaction</h3>
                    <span className="text-xs text-base-content/50">Sunday, 20 Feb 2025</span>
                </div>
                <div className="flex flex-col min-w-[30%]">
                    <div className="flex items-center">Total: <div className="ml-1 badge badge-neutral">Rp200.000</div></div>
                    <span className="text-xs text-base-content/50">Source: Wallet (Balance after: Rp400.000)</span>
                </div>
                <span className="max-w-[30%] text-xs text-base-content/50 text-ellipsis line-clamp-3">Note: Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus animi adipisci recusandae incidunt optio voluptas magnam error quisquam ipsa voluptatum dolore architecto, saepe, praesentium maiores officiis tempore repellat facere reiciendis!</span>
                <div className="ml-auto badge badge-soft badge-warning">Expense</div>
            </div>
            <div className="flex items-center gap-2 bg-base-200 hover:shadow-md px-8 py-4 border-def border-base-300 rounded-field transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
                <div className="flex flex-col min-w-[25%]">
                    <h3 className="font-semibold">Transfer Transaction</h3>
                    <span className="text-xs text-base-content/50">Sunday, 20 Feb 2025</span>
                </div>
                <div className="flex flex-col min-w-[30%]">
                    <div className="flex items-center">Total: <div className="ml-1 badge badge-neutral">Rp600.000</div></div>
                    <span className="text-xs text-base-content/50">From: BCA Account (Balance after: Rp1.100.000), <br /> To: Wallet (Balance after: Rp600.000)</span>
                </div>
                <span className="max-w-[30%] text-xs text-base-content/50 text-ellipsis line-clamp-3">Note: Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus animi adipisci recusandae incidunt optio voluptas magnam error quisquam ipsa voluptatum dolore architecto, saepe, praesentium maiores officiis tempore repellat facere reiciendis!</span>
                <div className="ml-auto badge badge-soft badge-info">Transfer</div>
            </div>
            <div className="flex items-center gap-2 bg-base-200 hover:shadow-md px-8 py-4 border-def border-base-300 rounded-field transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
                <div className="flex flex-col min-w-[25%]">
                    <h3 className="font-semibold">Income Transaction</h3>
                    <span className="text-xs text-base-content/50">Sunday, 20 Feb 2025</span>
                </div>
                <div className="flex flex-col min-w-[30%]">
                    <div className="flex items-center">Total: <div className="ml-1 badge badge-neutral">Rp1.600.000</div></div>
                    <span className="text-xs text-base-content/50">To: BCA Account (Balance after: Rp1.700.000)</span>
                </div>
                <span className="max-w-[30%] text-xs text-base-content/50 text-ellipsis line-clamp-3">Note: Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus animi adipisci recusandae incidunt optio voluptas magnam error quisquam ipsa voluptatum dolore architecto, saepe, praesentium maiores officiis tempore repellat facere reiciendis!</span>
                <div className="ml-auto badge badge-soft badge-success">Income</div>
            </div>
            <div className="flex items-center gap-2 px-2 text-nowrap">
                January 2025
                <div className="border-t border-base-content/50 w-full h-min"></div>
            </div>
            <div className="flex items-center gap-2 bg-base-200 hover:shadow-md px-8 py-4 border-def border-base-300 rounded-field transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
                <div className="flex flex-col min-w-[25%]">
                    <h3 className="font-semibold">Expense Transaction</h3>
                    <span className="text-xs text-base-content/50">Sunday, 20 Jan 2025</span>
                </div>
                <div className="flex flex-col min-w-[30%]">
                    <div className="flex items-center">Total: <div className="ml-1 badge badge-neutral">Rp200.000</div></div>
                    <span className="text-xs text-base-content/50">Source: Wallet (Balance after: Rp400.000)</span>
                </div>
                <span className="max-w-[30%] text-xs text-base-content/50 text-ellipsis line-clamp-3">Note: Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus animi adipisci recusandae incidunt optio voluptas magnam error quisquam ipsa voluptatum dolore architecto, saepe, praesentium maiores officiis tempore repellat facere reiciendis!</span>
                <div className="ml-auto badge badge-soft badge-warning">Expense</div>
            </div>
            <div className="flex items-center gap-2 bg-base-200 hover:shadow-md px-8 py-4 border-def border-base-300 rounded-field transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
                <div className="flex flex-col min-w-[25%]">
                    <h3 className="font-semibold">Transfer Transaction</h3>
                    <span className="text-xs text-base-content/50">Sunday, 20 Jan 2025</span>
                </div>
                <div className="flex flex-col min-w-[30%]">
                    <div className="flex items-center">Total: <div className="ml-1 badge badge-neutral">Rp600.000</div></div>
                    <span className="text-xs text-base-content/50">From: BCA Account (Balance after: Rp1.100.000), <br /> To: Wallet (Balance after: Rp600.000)</span>
                </div>
                <span className="max-w-[30%] text-xs text-base-content/50 text-ellipsis line-clamp-3">Note: Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus animi adipisci recusandae incidunt optio voluptas magnam error quisquam ipsa voluptatum dolore architecto, saepe, praesentium maiores officiis tempore repellat facere reiciendis!</span>
                <div className="ml-auto badge badge-soft badge-info">Transfer</div>
            </div>
            <div className="flex items-center gap-2 bg-base-200 hover:shadow-md px-8 py-4 border-def border-base-300 rounded-field transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
                <div className="flex flex-col min-w-[25%]">
                    <h3 className="font-semibold">Income Transaction</h3>
                    <span className="text-xs text-base-content/50">Sunday, 20 Jan 2025</span>
                </div>
                <div className="flex flex-col min-w-[30%]">
                    <div className="flex items-center">Total: <div className="ml-1 badge badge-neutral">Rp1.600.000</div></div>
                    <span className="text-xs text-base-content/50">To: BCA Account (Balance after: Rp1.700.000)</span>
                </div>
                <span className="max-w-[30%] text-xs text-base-content/50 text-ellipsis line-clamp-3">Note: Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus animi adipisci recusandae incidunt optio voluptas magnam error quisquam ipsa voluptatum dolore architecto, saepe, praesentium maiores officiis tempore repellat facere reiciendis!</span>
                <div className="ml-auto badge badge-soft badge-success">Income</div>
            </div>
            <dialog id="make_transaction_modal" className="group modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Hello!</h3>
                    <p className="py-4">Press ESC key or click outside to close</p>
                </div>
                <form method="dialog" className="opacity-0 group-open:opacity-100 group-open:backdrop-blur-sm transition-all modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
}

export default Transaction;