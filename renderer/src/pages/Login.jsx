import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useTitle from "../hooks/useTitle";
import Alert, { closeAlert, showAlert } from "../components/Alert";
import useMeta from "../hooks/useMeta";

const Login = () => {
    const setTitle = useTitle();
    setTitle('Login');

    const [dbPath, setDbPath] = useState('');
    const [password, setPassword] = useState('');

    const handleBrowse = async () => {
        const selectedPath = await window.electronAPI.selectPath({
            properties: ['openFile'],
            filters: [
                { name: 'Database Files', extensions: ['db', 'fdb', 'sqlite', 'sqlite3'] },
            ],
        });
        if (selectedPath) {
            setDbPath(selectedPath);
        }
    };

    const setMeta = useMeta((s) => s.setMeta);
    const navigate = useNavigate();
    const handleLogin = async () => {
        if (!dbPath || !password) {
            showAlert("alert", "error", "Error: All fields are required." + password);
            return;
        }

        const result = await window.electronAPI.auth.loginWithDBFile(dbPath, password);
        if (result.success) {
            const sharedData = await window.electronAPI.sharedData();
            setMeta(sharedData.metaData);
            navigate('/pages/dashboard');
        } else {
            showAlert("alert", "error", "Error: " + result.error);
        }
    };
    return (
        <form onSubmit={(e) => { e.preventDefault(); handleLogin() }} className="bg-base-100/50 backdrop-blur-xs bg-stripe-cross mx-6 px-8 pt-4 pb-8 border-2 border-base-content/20 rounded-box w-lg fieldset stripe-color-base-content/10">
            <legend className="text-4xl -translate-y-1 fieldset-legend">Login</legend>
            <Alert id="alert" />

            <label className="label">Select Database</label>
            <label className="pr-0 w-full overflow-hidden input">
                Path
                <input type="text" className="grow" placeholder="e.g. C:\\users\...\my_finance.db" required onChange={(e) => setDbPath(e.target.value)} value={dbPath} />
                <button type="button" className="rounded-none btn" onClick={handleBrowse}>Browse</button>
            </label>

            <label className="label">Database Password</label>
            <input type="password" className="w-full input" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} value={password} />
            <button type="submit" className="mt-4 btn btn-neutral">Login</button>
            <span>Don't have database yet? you can just <Link to="/auth/create-new-db" className="link link-secondary">create new database</Link></span>
        </form>
    );
}

export default Login;