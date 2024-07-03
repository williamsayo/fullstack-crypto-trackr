import reactLogo from '../assets/react.svg'

const Row = ({ provider, price, cryptoCurrency }) => {
    return (
        <li className='flex justify-between items-center rounded-lg bg-slate-300 w-full h-14 uppercase my-3 px-4 text-xl'>
            <div className='flex flex-row justify-between items-center gap-2'>
                <img src={reactLogo} alt="ReactLogo"/>
                <span className=' text-2xl font-black text-rose-400'>{provider}</span>
            </div>
            
            <div className='flex flex-row justify-between items-center gap-2'>
                <span>{price}</span>
                <span className='text-stone-500'>{cryptoCurrency}</span>
            </div>
            
        </li>
    )
}

export default Row
