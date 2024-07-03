
const Button = ({ children, classes,onClick, disabled }) => {
    
    return (
        <button disabled={disabled} className={`py-2 px-4 rounded-lg ${classes}`} onClick={onClick}>
            {children}
        </button>
    )
}

export default Button
