
const TableRow = ({children,classes}) => {
  return (
    <div className={`flex justify-between items-center text-right border-b-[1px] py-1 ${classes}`}>
      {children}
    </div>
  )
}


export default TableRow
