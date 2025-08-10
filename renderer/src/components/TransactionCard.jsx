import useCurrencyFormatter from "../hooks/useCurrencyFormatter";
import useDateFormatter from "../hooks/useDateFormatter";

const TransactionCard = ({ data, ...props }) => {
    const dateFormat = useDateFormatter();
    const { currFormat } = useCurrencyFormatter();
    switch (data.type) {
        case 'income':
            return (
                <div {...props} className="flex @container/card items-center gap-4 bg-base-200 hover:shadow-md px-8 py-4 border-def border-base-300 rounded-field transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
                    <div className="flex flex-col w-[33%] @max-lg/card:w-[50%]">
                        <h3 className="font-semibold">{data.title}</h3>
                        <span className="text-xs text-base-content/50">{dateFormat(data.created_at)}</span>
                    </div>
                    <div className="flex flex-col w-[34%] @max-lg/card:w-[50%]">
                        <div className="flex items-center">Income: <div className="ml-1 badge badge-success font-semibold">{currFormat(data.amount)}</div></div>
                        <span className="text-xs text-base-content/50">To: {data.destination_name} (Balance after: {currFormat(data.destination_balance_after)})</span>
                    </div>
                    <span className="w-[33%] @max-lg/card:hidden text-xs text-base-content/50 text-ellipsis line-clamp-3">Note: {data.note ? data.note : '-'}</span>
                </div>
            )
        case 'expense':
            return (
                <div {...props} className="flex @container/card items-center gap-4 bg-base-200 hover:shadow-md px-8 py-4 border-def border-base-300 rounded-field transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
                    <div className="flex flex-col w-[33%] @max-lg/card:w-[50%]">
                        <h3 className="font-semibold">{data.title}</h3>
                        <span className="text-xs text-base-content/50">{dateFormat(data.created_at)}</span>
                    </div>
                    <div className="flex flex-col w-[34%] @max-lg/card:w-[50%]">
                        <div className="flex items-center">Expense: <div className="ml-1 badge badge-warning font-semibold">{currFormat(data.amount)}</div></div>
                        <span className="text-xs text-base-content/50">From: {data.source_name} (Balance after: {currFormat(data.source_balance_after)})</span>
                    </div>
                    <span className="w-[33%] @max-lg/card:hidden text-xs text-base-content/50 text-ellipsis line-clamp-3">Note: {data.note ? data.note : '-'}</span>
                </div>
            )

        default:
            break;
    }
}

export default TransactionCard;