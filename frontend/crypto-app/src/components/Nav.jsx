import { useContext,useState } from "react"
import Button from "./Button"
import { Link } from "react-router-dom"
import { currencyContext } from "../util/currency-ctx"

const Nav = () => {
    const [toggleMenu, setToggleMenu] = useState(false)
    const { currency, handleActiveCurrency } = useContext(currencyContext)

    const handleShowMenu = () => {
        setToggleMenu(prevState => !prevState);
    }

    return (
        <nav className=" flex items-center justify-around mb-16 overflow-hidden">
            <div id="logo" className="flex items-center gap-x-1 text-2xl text-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="60" height="60" fill="currentColor"><path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748ZM12.1779 7.17624C11.4834 7.48982 11 8.18846 11 9C11 10.1046 11.8954 11 13 11C13.8115 11 14.5102 10.5166 14.8238 9.82212C14.9383 10.1945 15 10.59 15 11C15 13.2091 13.2091 15 11 15C8.79086 15 7 13.2091 7 11C7 8.79086 8.79086 7 11 7C11.41 7 11.8055 7.06167 12.1779 7.17624Z"></path></svg>
                <Link to={'/'}>CryptoTrackr</Link>
            </div>
            <div className="lg:hidden ">
                <svg onClick={handleShowMenu} className="cursor-pointer w-[30px] h-[30px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path></svg>
            </div>
            <ul className="peer-hover:flex hidden flex-col lg:flex lg:flex-row items-center gap-3">
                <li><Button classes="bg-transparent hover:text-rose-500 "><Link to={'/price'}>Crypto Prices</Link></Button></li>
                <li className="w-28 text-center">
                    <Button classes=" flex items-center justify-center bg-transparent hover:text-rose-500 capitalize peer">
                        <span className=" font-extrabold text-slate-00">{currency}</span>
                        <svg className="h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 16L6 10H18L12 16Z"></path></svg>
                    </Button>
                    <div className=" rounded-lg border-2 border-slate-500 bg-white p-1.5 absolute z-[999] w-[120px] hidden hover:block peer-hover:block">
                        <Button classes=' hover:bg-slate-200 rounded-none w-full'><span onClick={() => handleActiveCurrency('USD')}>USD</span></Button>
                        <Button classes=' hover:bg-slate-200 rounded-none w-full'><span onClick={() => handleActiveCurrency('NGN')}>NGN</span></Button>
                        <Button classes=' hover:bg-slate-200 rounded-none w-full'><span onClick={() => handleActiveCurrency('AUD')}>AUD</span></Button>
                        <Button classes=' hover:bg-slate-200 rounded-none w-full'><span onClick={() => handleActiveCurrency('GBP')}>GBP</span></Button>
                    </div>
                </li>
                <li><Button classes="border-solid border-2 border-black bg-transparent hover:border-rose-500"><Link to={'/'}>Log in</Link></Button></li>
                <li><Button classes="bg-black hover:bg-rose-600 text-white"><Link to={'/'}>Sign up</Link></Button></li>
            </ul >
            <ul className={`${toggleMenu ? 'flex' : 'hidden'} absolute flex-col px-6 mt-8 z-50 h-full w-full top-16 bg-white`}>
                <div className="flex flex-col items-start gap-6 w-full">
                    <li className=" cursor-pointer text-left w-full hover:text-rose-500 hover:bg-slate-400">
                        <Button classes="bg-transparent">
                            <Link to={'/price'} className="flex flex-col items-start">
                                <span>Crypto Prices</span>
                                <span className="text-sm text-gray-300">Real-time Market Rates</span>
                            </Link>
                        </Button>
                    </li>
                    <li className="relative w-28 ">
                        <Button classes=" flex items-center justify-center bg-transparent hover:text-rose-500 capitalize peer">
                            <span className=" font-extrabold text-slate-00">{currency}</span>
                            <svg className="h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 16L6 10H18L12 16Z"></path></svg>
                        </Button>
                        <div className="flex flex-col rounded-lg border-2 border-slate-500 bg-white p-1.5 absolute none z-50 w-full hidden hover:block peer-hover:block">
                            <Button classes=' hover:bg-slate-200 rounded-none w-full'><span onClick={() => handleActiveCurrency('USD')}>USD</span></Button>
                            <Button classes=' hover:bg-slate-200 rounded-none w-full'><span onClick={() => handleActiveCurrency('NGN')}>NGN</span></Button>
                            <Button classes=' hover:bg-slate-200 rounded-none w-full'><span onClick={() => handleActiveCurrency('AUD')}>AUD</span></Button>
                            <Button classes=' hover:bg-slate-200 rounded-none w-full'><span onClick={() => handleActiveCurrency('GBP')}>GBP</span></Button>
                        </div>
                    </li>
                    <li className="px-4">
                        <Button classes=" mr-4 border-solid border-2 border-black bg-transparent hover:border-rose-500"><Link to={'/'}>Log in</Link></Button>
                        <Button classes="bg-black hover:bg-rose-600 text-white"><Link to={'/'}>Sign up</Link></Button>
                    </li>
                </div>
                <div className="border-t-2 mt-8 font-medium capitalize">
                    <li className='cursor-pointer text-left w-full py-4 px-4 hover:text-rose-500 hover:bg-slate-400'>
                        <span>about us</span>
                    </li>
                    <li className='cursor-pointer text-left w-full py-4 px-4 hover:text-rose-500 hover:bg-slate-400'>
                        Blog
                    </li>
                </div>
            </ul >
        </nav >
    )
}

export default Nav
