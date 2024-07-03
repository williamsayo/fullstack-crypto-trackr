import { useContext, useEffect, useState } from "react";
import { currencyContext } from "../util/currency-ctx";

export const useHttp = (url, page, searchParam) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fetchedData, setFetchedData] = useState([]);
    const { currency } = useContext(currencyContext);

    useEffect(() => {
        setIsLoading(true);
        let defaultUrl = `http://127.0.0.1:8000/api/${url}?currency=${currency}`;

        if (page) {
            defaultUrl += `&page=${page}`;
        }
        if (searchParam) {
            defaultUrl += `&q=${searchParam}`;
        }

        const sendHttp = async () => {
            try {
                const response = await fetch(defaultUrl);
                
                if (!response.ok) {
                    setIsLoading(false);
                    throw new Error("An error occured");
                }

                const data = await response.json();

                setFetchedData(data);
                setIsLoading(false);
            } catch (error) {
                setError(error);
                setIsLoading(false);
            }
        };

        sendHttp();
    }, [url, currency, searchParam, page]);

    return {
        fetchedData,
        isLoading,
        error,
    };
};
