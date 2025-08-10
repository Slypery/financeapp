import { useEffect, useRef, useState } from "react";
import useRefreshKey from "../hooks/useRefreshKey";

const AccountSelect = ({ children, getVal, where = '', balanceCalc = 0, selectedID, className, ...props }) => {
    const selectRef = useRef(null);
    const [selectedAccID, setSelectedAccID] = useState(selectedID);
    const [accounts, setAccounts] = useState();
    const { refreshKey } = useRefreshKey();

    useEffect(() => {
        if (!accounts) return;
        setSelectedAccID(selectedID);
        if (getVal) getVal(accounts?.find(o => o.id === selectedID) ?? null);
    }, [selectedID]);

    const handleChange = () => {
        const id = parseInt(selectRef.current.value);
        setSelectedAccID(id);
        if (getVal) getVal(accounts?.find(o => o.id === id) ?? null);
    };

    async function fillUpAccounts() {
        const data = await window.electronAPI.accounts.all(where);
        if (getVal) getVal(data?.find(o => o.id === selectedID) ?? null);
        setSelectedAccID(selectedID);
        setAccounts(data);
    }

    useEffect(() => {
        fillUpAccounts();
    }, [refreshKey])


    return (
        <>
            <select ref={selectRef} className={`select w-full ${className}`} value={`${selectedAccID}`} onChange={handleChange} {...props}>
                {children}
                {!children && <option>Select Account</option>}
                {accounts?.map((data, index) => (
                    <option key={index} value={data.id}>{data.name} ({data.type})</option>
                ))}
            </select>
        </>
    );
};


export default AccountSelect;