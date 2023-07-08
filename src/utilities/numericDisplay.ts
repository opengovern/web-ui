const defaultOptions: Intl.NumberFormatOptions = {
    notation: 'compact',
    maximumSignificantDigits: 3,
}

export const numericDisplay = (
    value: string | number | undefined,
    options?: Intl.NumberFormatOptions
) => {
    if (!value) {
        return '0'
    }
    const num = parseInt(value.toString(), 10)
    const formatter = Intl.NumberFormat('en', { ...defaultOptions, ...options })
    return num ? formatter.format(num) : '0'
}

export const floatDisplay = (
    value: string | number | undefined,
    options?: Intl.NumberFormatOptions
) => {
    if (!value) {
        return 0
    }
    const num = parseFloat(value.toString())
    const formatter = Intl.NumberFormat('en', { ...defaultOptions, ...options })
    return num ? formatter.format(num) : '-'
}

export const numberGroupedDisplay = (value: string | number | undefined) => {
    return `${Math.ceil(parseFloat(value ? value.toString() : '0'))
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

export const priceDisplay = (value: string | number | undefined) => {
    return `$${Math.ceil(parseFloat(value ? value.toString() : '0'))
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

export const exactPriceDisplay = (
    value: string | number | undefined,
    decimals = 0
) => {
    return `$ ${parseFloat(value ? value.toString() : '0')
        .toFixed(decimals)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

export const numberDisplay = (
    value: string | number | undefined,
    decPoint = 2
) => {
    return `${parseFloat(value ? value.toString() : '0')
        .toFixed(decPoint)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}
