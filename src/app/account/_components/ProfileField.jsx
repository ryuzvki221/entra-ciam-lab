export function ProfileField({ id, label, value, onChange, editable, disabled, type = "text" }) {
    return (
        <div className="row mb-3 align-items-center">
            <label htmlFor={id} className="col-sm-3 col-form-label">
                {label}
            </label>

            <div className="col-sm-9">
                <input
                    id={id}
                    name={id}
                    type={type}
                    className="form-control"
                    value={value ?? ""}
                    onChange={onChange}
                    disabled={!editable || disabled}
                />
            </div>
        </div>
    );
}