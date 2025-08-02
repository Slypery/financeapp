function Alert({ id }) {
    return (
        <div id={id} role="alert" datatype="" className="alert alert-soft hidden"></div>
    );
}

function showAlert(id, type, msg) {
    const alertDiv = document.getElementById(id);
    if (alertDiv) {
        alertDiv.innerHTML = msg;
        alertDiv.className = 'alert alert-soft hidden';
        alertDiv.classList.add('alert-' + type);
        alertDiv.classList.remove('hidden');
    }
}

function closeAlert(id) {
    const alertDiv = document.getElementById(id);
    if (alertDiv) {
        alertDiv.className = 'alert alert-soft hidden';
    }
}

export { showAlert, closeAlert };
export default Alert;