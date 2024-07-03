import { useContext } from 'react'
import { currencyContext } from '../util/currency-ctx'
import TableRow from './TableRow'
import TableCol from './TableCol'
import { numberFormat, numberFormatWithNotation, percentFormat } from '../util/numberFormatter'

const first_col_class = 'text-left w-[40%] max-md:w-[25%] flex items-center '

const Table = ({ data }) => {
    const { currency } = useContext(currencyContext)

    return (
        <div className='flex flex-col w-full min-w-[700px] text-[14px]'>
            <TableRow classes={'border-b-[2px] text-gray-400 text-[12px] font-semibold'}>
                <TableCol classes={first_col_class}>currency</TableCol>
                <TableCol>prices</TableCol>
                <TableCol>change(24h)</TableCol>
                <TableCol>market cap</TableCol>
                <TableCol>Volume(24h)</TableCol>
            </TableRow>

            {
                data.length < 1 &&
                <TableRow classes={'py-4'}>
                    <TableCol classes={'mx-auto text-xl text-center font-semibold'}>
                        no data found
                    </TableCol>
                </TableRow>
            }

            {data.map(coinData => {
                const formattedPrice = numberFormat(currency, coinData.price)
                const formattedMarketCap = numberFormatWithNotation(currency, coinData.marketCap)
                const formattedVolume = numberFormatWithNotation(currency, coinData.volume_24h)
                const formattedChange = percentFormat(currency, coinData.change_24h)
                return (
                    <TableRow classes={' font-medium'} key={coinData.id}>
                        <TableCol classes={first_col_class}>
                            <div className=' inline-block p-2 rounded-[50%] mr-2 bg-stone-100'>
                                <img className='w-6 h-6 inline-block rounded-[50%]' src={coinData.icon} alt={coinData.cryptoCurrency} />
                            </div>
                            <div className='flex lg:flex-col justify-start max-lg:items-center gap-x-1'>
                                <span>{coinData.cryptoCurrency}</span>
                                <span className='text-xs text-stone-400 font-light'>{coinData.symbol}</span>
                            </div>

                        </TableCol>
                        <TableCol classes={'font-bold'}>{formattedPrice}</TableCol>
                        <TableCol classes={coinData.change_24h < 0 ? 'text-red-700' : 'text-green-700'}>
                            <span className='flex justify-end'>
                                {coinData.change_24h > 0 &&
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z"></path></svg>
                                }
                                {coinData.change_24h < 0 &&
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M9 13.589L17.6066 4.98242L19.0208 6.39664L10.4142 15.0032H18V17.0032H7V6.00324H9V13.589Z"></path></svg>
                                }
                                {formattedChange}
                            </span>
                        </TableCol>
                        <TableCol>{formattedMarketCap}</TableCol>
                        <TableCol>{formattedVolume}</TableCol>
                    </TableRow>
                )
            }
            )}
            {/* <thead>
                <tr className='px-8'>
                    <td className='px-8 '>currency</td>
                    <td>prices</td>
                    <td>change(24h)</td>
                    <td>market cap</td>
                    <td>Volume(24h)</td>
                </tr>
            </thead> */}
        </div>
    )
}

export default Table
