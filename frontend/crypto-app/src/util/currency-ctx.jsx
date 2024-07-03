import { createContext, useState } from "react";

export const currencyContext = createContext({
    currency: 'USD',
    handleActiveCurrency: () => { },
})

const CurrencyContext = ({ children }) => {

    const [currency, setCurrency] = useState('USD');

    const handleActiveCurrency = (identifier) => {
        setCurrency(identifier)
        localStorage.setItem('currency',identifier)
    }

    const currencyCtx = {
        currency,
        handleActiveCurrency,
    }

    return (
        <currencyContext.Provider value={currencyCtx}>
            {children}
        </currencyContext.Provider>
    )
}

export default CurrencyContext