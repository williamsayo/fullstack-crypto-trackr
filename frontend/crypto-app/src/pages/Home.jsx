import { useContext, useRef, useState } from "react"
import Row from "../components/Row"
import { currencyContext } from "../util/currency-ctx"
import Header from "../components/Header";
import Table from "../components/Table";
import { useHttp } from "../hooks/use-http";
import Skeleton from "../components/Skeleton";

const trendingUrl = `market-rates/trending/`
const HomePage = () => {
    const { currency } = useContext(currencyContext);
    const amountRef = useRef(null)
    const [amountState, setAmountState] = useState('100')
    const providersUrl = `offers/?amount=${amountState || '100'}&fromCurrency=${currency}&toCurrency=btc&`
    const { fetchedData: data, isLoading: providersLoading, error: providersError } = useHttp(providersUrl)
    const { fetchedData, isLoading: trendingLoading } = useHttp(trendingUrl)
    const { results: trending } = fetchedData

    const handleSubmit = (e) => {
        e.preventDefault()
        setAmountState(amountRef.current.value)
    }

    const passError = () => {
        throw Error('Server not responding try again later')
    }

    return (
        <div>
            <Header>
                cheapest btc providers
            </Header>
            <div className="flex flex-col gap-12 items-center mb-12">
                <form onSubmit={handleSubmit} className="relative w-40 text-lg">
                    <input ref={amountRef} name="amount" placeholder="100" type="text" className=" shadow-sm rounded-lg border-2 border-slate-300 p-2 pr-[3.3rem] focus:outline-stone-500 w-full" />
                    <span className="flex absolute right-0 bottom-0 px-3 items-center h-full align-middle  text-slate-400">{currency}</span>
                </form>

                <ul className="w-full">
                    {
                        providersLoading && !providersError &&
                        <Skeleton />
                    }
                    {
                        !providersLoading && !providersError &&
                        data.map(provider => (
                            <Row key={provider.id} provider={provider.provider} price={provider.cryptoAmount} cryptoCurrency={provider.cryptoCurrency} />
                        ))
                    }
                    {
                        providersError &&
                        passError()
                    }
                </ul>
            </div>
            <Header>
                Trending coins
            </Header>
            {
                trendingLoading &&
                <svg className="mx-auto animate-spin text-gray-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M3.05469 13H5.07065C5.55588 16.3923 8.47329 19 11.9998 19C15.5262 19 18.4436 16.3923 18.9289 13H20.9448C20.4474 17.5 16.6323 21 11.9998 21C7.36721 21 3.55213 17.5 3.05469 13ZM3.05469 11C3.55213 6.50005 7.36721 3 11.9998 3C16.6323 3 20.4474 6.50005 20.9448 11H18.9289C18.4436 7.60771 15.5262 5 11.9998 5C8.47329 5 5.55588 7.60771 5.07065 11H3.05469Z"></path></svg>}
            {
                !trendingLoading && !providersError &&
                <Table data={trending} />
            }
        </div>
    )
}

export default HomePage

// export const homeLoader = async ({ request }) => {

//     const url = new URL(request.url)
//     const amount = url.searchParams.get('amount') ?? '100'
//     const currency = url.searchParams.get('currency') ?? 'usd'

//     try {
//         const response = await fetch(`http://127.0.0.1:8000/api/offers/?amount=${amount}&fromCurrency=${currency}&toCurrency=btc&page_size=4`, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         });

//         const response2 = await fetch(`http://127.0.0.1:8000/api/market-rates/trending/?currency=usd`, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         });

//         if (!response.ok | !response2.ok) {
//             throw new Error("An error occured");
//         }

//         const providers = await response.json();
//         const trending = await response2.json();
//         return json({ providers, trending });
//     }
//     catch (error) {
//         console.log(error)
//     }
// }