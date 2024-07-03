import Table from '../components/Table';
import Header from '../components/Header';
import PaginationControls from '../components/PaginationControls';
import { useSearchParams } from 'react-router-dom';
import { useHttp } from '../hooks/use-http';

const Prices = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    // const { results: data, pages, previous: prev, next } = useLoaderData()
    const url = `market-rates/`
    const { fetchedData, isLoading , error } = useHttp(url, searchParams.get('page'), searchParams.get('q'))
    const { results: data, pages, previous: prev, next } = fetchedData

    const handleSearchFilter = (e) => {
        if (!e.target.value) {
            searchParams.delete('q')
            searchParams.delete('page')
            return setSearchParams(searchParams)
        }
        setSearchParams({ q: e.target.value.toLowerCase() }, { replace: true })
    }

    const passError = () => {
        throw Error('Server not responding try again later')
    }

    return (
        <>
            <Header>
                Market Prices
            </Header>
            <div className='relative mb-[36px]'>
                <input onChange={handleSearchFilter} value={searchParams.get('q') || ''} className=' peer w-full rounded-md text-sm p-3 shadow-border focus:shadow-slate-300 outline-none pl-12' type="search" name="q" placeholder='Search currencies' />
                <svg className=' peer-focus:text-sky-500 border-r-2 pr-[8px] absolute top-[50%] translate-y-[-50%] left-2 w-7 h-7' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11 2C15.968 2 20 6.032 20 11C20 15.968 15.968 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2ZM11 18C14.8675 18 18 14.8675 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18ZM19.4853 18.0711L22.3137 20.8995L20.8995 22.3137L18.0711 19.4853L19.4853 18.0711Z"></path></svg>
            </div>
            {
                error &&
                passError()
            }
            {
                isLoading && !error &&
                <svg className="mx-auto animate-spin text-gray-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M3.05469 13H5.07065C5.55588 16.3923 8.47329 19 11.9998 19C15.5262 19 18.4436 16.3923 18.9289 13H20.9448C20.4474 17.5 16.6323 21 11.9998 21C7.36721 21 3.55213 17.5 3.05469 13ZM3.05469 11C3.55213 6.50005 7.36721 3 11.9998 3C16.6323 3 20.4474 6.50005 20.9448 11H18.9289C18.4436 7.60771 15.5262 5 11.9998 5C8.47329 5 5.55588 7.60771 5.07065 11H3.05469Z"></path></svg>
            }
            {
                !isLoading && !error &&
                <>
                    <Table data={data} />
                    <PaginationControls pages={pages} prev={prev} next={next} />
                </>
            }
        </>
    )
}

export default Prices

// export const priceLoader = async ({ request }) => {

//     const url = new URL(request.url)
//     const q = url.searchParams.get('q')
//     const page = url.searchParams.get('page') || 1

//     try {
//         const response = await fetch(`http://127.0.0.1:8000/api/market-rates/?currency=usd&page=${page}${q ? '&q=' + q : ''}`, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         });

//         if (!response.ok) {
//             throw new Error("An error occured");
//         }

//         const data = await response.json();
//         return data;
//     }
//     catch (error) {
//         console.log(error)
//     }
// }
