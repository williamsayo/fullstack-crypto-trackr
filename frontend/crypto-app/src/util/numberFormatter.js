
export const numberFormatWithNotation = (currency,number) => {
    const options = {
        style: "currency",
        currency: currency,
        notation: "compact",
    };

    const formatter = new Intl.NumberFormat("en-US", options);
    const formattedNumber = formatter.format(number)

    return formattedNumber
};

export const numberFormat = (currency, number) => {
    const options = {
        style: "currency",
        currency: currency,
        minimumSignificantDigits: 3,
        maximumSignificantDigits: 4,
    };

    const formatter = new Intl.NumberFormat("en-US", options);
    const formattedNumber = formatter.format(number);

    return formattedNumber;
};

export const percentFormat = (currency, number) => {
    const options = {
        style: "percent",
        minimumSignificantDigits: 2,
        maximumSignificantDigits: 2,
    };

    const formatter = new Intl.NumberFormat("en-US", options);
    let formattedNumber = formatter.format(number/100);

    if (number > 0 ) {
        formattedNumber = `+${formattedNumber}`
    }

    return formattedNumber;
};