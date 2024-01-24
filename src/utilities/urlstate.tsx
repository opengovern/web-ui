import dayjs from 'dayjs'
import { useSearchParams } from 'react-router-dom'

export interface DateRange {
    start: dayjs.Dayjs
    end: dayjs.Dayjs
}

export const defaultTime: DateRange = {
    start: dayjs.utc().add(-7, 'days'),
    end: dayjs.utc(),
}

export const defaultSpendTime: DateRange = {
    start: dayjs.utc().add(-9, 'days'),
    end: dayjs.utc().add(-2, 'days'),
}

export interface IFilter {
    provider: '' | 'AWS' | 'Azure'
    connections: string[]
    connectionGroup: string[]
}

export function useUrlArrayState(urlParam: string, defaultValue: string[]) {
    const [searchParams, setSearchParams] = useSearchParams()
    const value =
        (searchParams.get(urlParam)?.length || 0) > 0
            ? searchParams.getAll(urlParam) || []
            : defaultValue

    const setValue = (v: string[]) => {
        let current = window.location.search
        if (current.charAt(0) === '?') {
            current = current.slice(1)
        }
        const arr = current.split('&').map((v2) => v2.split('='))
        const newParams = new URLSearchParams()
        arr.forEach((i) => {
            if (i[0] !== '') {
                newParams.append(i[0], i[1])
            }
        })

        newParams.delete(urlParam)
        v.forEach((v2, idx) => {
            if (idx === 0) {
                newParams.set(urlParam, v2)
            } else {
                newParams.append(urlParam, v2)
            }
        })
        setSearchParams(newParams)
    }

    return { value, setValue }
}

export function useUrlState(urlParam: string, defaultValue: string) {
    const { value: arrayValue, setValue: setArrayValue } = useUrlArrayState(
        urlParam,
        defaultValue === '' ? [] : [defaultValue]
    )
    const value = arrayValue.at(0) || ''
    const setValue = (v: string) => {
        setArrayValue(v === '' ? [] : [v])
    }

    return { value, setValue }
}

export function useFilterState() {
    const { value: provider, setValue: setProvider } = useUrlState(
        'provider',
        ''
    )
    const { value: connections, setValue: setConnections } = useUrlArrayState(
        'connection',
        []
    )
    const { value: connectionGroup, setValue: setConnectionGroup } =
        useUrlArrayState('connectionGroup', [])

    const value: IFilter = {
        provider: provider === 'AWS' || provider === 'Azure' ? provider : '',
        connections,
        connectionGroup,
    }
    const setValue = (v: IFilter) => {
        if (provider !== v.provider) {
            setProvider(v.provider)
        }
        if (connections !== v.connections) {
            setConnections(v.connections)
        }
        if (connectionGroup !== v.connectionGroup) {
            setConnectionGroup(v.connectionGroup)
        }
    }

    return { value, setValue }
}

export function useUrlDateRangeState(defaultValue: DateRange) {
    const parseValue = (v: string) => {
        return dayjs.utc(v)
    }
    const toString = (v: dayjs.Dayjs) => {
        return v.format('YYYY-MM-DD')
    }

    const { value: startValue, setValue: setStartValue } = useUrlState(
        'startDate',
        toString(defaultValue.start)
    )
    const { value: endValue, setValue: setEndValue } = useUrlState(
        'endDate',
        toString(defaultValue.end)
    )

    const value: DateRange = {
        start: parseValue(startValue),
        end: parseValue(endValue),
    }

    const setValue = (v: DateRange) => {
        if (!v.start.isSame(value.start)) {
            setStartValue(toString(v.start))
        }
        if (!v.end.isSame(value.end)) {
            setEndValue(toString(v.end))
        }
    }

    return { value, setValue }
}
