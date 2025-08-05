import useTitle from '../hooks/useTitle';
function Accounts() {
    const setTitle = useTitle();
    setTitle('Accounts / Sources Of Funds');
    return (
        <>Source Of Fund Page</>
    );
}

export default Accounts;