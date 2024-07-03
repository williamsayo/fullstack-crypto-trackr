

const TableCol = ({ children,classes }) => {
    return (
        <div className={` inline-block w-[20%] py-[12px] uppercase ${classes}`}>
            {children}
        </div>
    )
}

export default TableCol
