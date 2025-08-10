import { useRef, useState } from "react";
import useTitle from "../hooks/useTitle";
import { Link, useRoutes } from "react-router-dom";
import Alert, { showAlert, closeAlert } from "../components/Alert";

const CreateNewDB = () => {
    const setTitle = useTitle();
    setTitle('Create New DB');

    const [folderPath, setFolderPath] = useState("");
    const [fileName, setFileName] = useState("");
    const [password, setPassword] = useState("");

    const selectFolder = async () => {
        const selectedPath = await window.electronAPI.selectPath({
            properties: ['openDirectory']
        });
        if (selectedPath) {
            setFolderPath(selectedPath);
        }
    };

    const createDatabase = async () => {
        if (!folderPath || !fileName || !password) {
            showAlert("alert", "error", "Error: All fields are required.");
            return;
        }

        const extName = await window.electronAPI.extName(fileName);
        const dbPath = await window.electronAPI.pathJoin(folderPath, extName ? fileName : `${fileName}.db`);
        const result = await window.electronAPI.auth.createDBFile(dbPath, password);
        if (result.success) {
            showAlert("alert", "success", "Success: Database has been created. You can login with your database now.");
        } else {
            showAlert("alert", "error", "Error: " + result.error);
        }
    };
    return (
        <form onSubmit={(e) => { e.preventDefault(); createDatabase() }} className="bg-base-100/50 backdrop-blur-xs bg-stripe-cross mx-6 px-8 pt-4 pb-8 border-2 border-base-content/20 rounded-box w-lg fieldset stripe-color-base-content/10">
            <legend className="text-4xl -translate-y-1 fieldset-legend">Create New Database</legend>
            <Alert id="alert" />
            <label className="label">Save Folder</label>
            <label className="pr-0 w-full overflow-hidden input">
                Folder
                <input type="text" className="grow" placeholder="e.g. C:\\users\public\document" required onChange={(e) => setFolderPath(e.target.value)} value={folderPath} />
                <button type="button" onClick={selectFolder} className="rounded-none btn">Browse</button>
            </label>
            <label className="label">Database Name</label>
            <label className="pr-0 w-full overflow-hidden input">
                <input type="text" className="grow" placeholder="e.g. my-finance.db" required onChange={(e) => setFileName(e.target.value)} />
            </label>

            <label className="label">Database Password</label>
            <input onChange={(e) => setPassword(e.target.value)} type="password" className="w-full input" placeholder="Password" required />

            <button type="submit" className="mt-4 btn btn-neutral">Create</button>
            <span>Already have a database? <Link to="/auth/login" className="link link-secondary">Back to Login</Link></span>
        </form>
    );
}

export default CreateNewDB;