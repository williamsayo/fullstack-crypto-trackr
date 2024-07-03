import Button from './Button'
import { useSearchParams } from 'react-router-dom'

const classes = 'text-xl capitalize font-medium hover:text-gray-500 disabled:text-gray-500'

const PaginationControls = ({ pages }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const pageNumbers = []
    const currentPage = +searchParams.get('page') || 1
    const showPages = Math.min(currentPage + 3, pages)

    const setPageParam = (page) => {
        setSearchParams(prev => {
            prev.set('page',page)
            return prev
        },{replace:true})
    }

    for (let index = Math.max(currentPage - 2, 1); index <= showPages; index++) {
        pageNumbers.push(index)
    }

    const moreButton = <li>
        <Button disabled={true} classes='font-bold rounded-md bg-slate-100'>
            <span className='text-xl align-bottom leading-1'>...</span>
        </Button>
    </li>

    return (
        <ul className='flex gap-1 overflow-hidden mt-12 justify-center'>
            <li>
                <Button disabled={currentPage===1} classes={classes} onClick={() => setPageParam(currentPage - 1)}>prev</Button>
            </li>
            {currentPage > 3 &&
                moreButton
            }
            {pageNumbers.map(pageNumber => (
                <li key={pageNumber} className='bg-'>
                    <Button classes={`rounded-md p-2 bg-slate-200 ${currentPage == pageNumber ? 'bg-stone-950 text-white' : ''}`} onClick={() => setPageParam(pageNumber)}>{pageNumber}</Button>
                </li>
            ))}
            {showPages < pages &&
                moreButton
            }

            <li>
                <Button disabled={currentPage===pages} classes={classes} onClick={() => setPageParam(currentPage + 1)}>next</Button>
            </li>
        </ul>
    )
}

export default PaginationControls
