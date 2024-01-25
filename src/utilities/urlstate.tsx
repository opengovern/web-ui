import dayjs from 'dayjs'
import { atom, useAtom } from 'jotai'
import { useEffect, useMemo, useState } from 'react'
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

const searchAtom = atom<string>(window.location.search)
export function useURLState<T>(
    defaultValue: T,
    serialize: (v: T) => Map<string, string[]>,
    deserialize: (v: Map<string, string[]>) => T
): [T, (v: T) => void] {
    const [searchParams] = useSearchParams()
    const [search, setSearch] = useAtom(searchAtom)
    useEffect(() => {
        // keeping search in sync with url
        if (search !== window.location.search) {
            setSearch(window.location.search)
        }
    }, [searchParams])

    const currentParams = useMemo(() => {
        let current = search
        if (current.charAt(0) === '?') {
            current = current.slice(1)
        }
        const arr = current
            .split('&')
            .map((v2) => v2.split('=').map((v3) => decodeURIComponent(v3)))
        const params = new URLSearchParams()
        arr.forEach((i) => {
            if (i[0] !== '') {
                params.append(i[0], i[1])
            }
        })
        return params
    }, [search])

    const [state, setState] = useState<T>(defaultValue)
    const setValue = (v: T) => {
        const serialized = serialize(v)
        const newParams = new URLSearchParams()
        currentParams.forEach((value, key) => newParams.append(key, value))

        serialized.forEach((value, key) => {
            newParams.delete(key)
            value.forEach((item) => {
                newParams.append(key, item)
            })
        })

        window.history.pushState({}, '', `?${newParams.toString()}`)
        setSearch(window.location.search)
    }

    useEffect(() => {
        const serialized = serialize(defaultValue)

        const v: [string, string[]][] = []
        serialized.forEach((defValue, key) => {
            const value = currentParams.has(key)
                ? currentParams.getAll(key)
                : defValue

            const res: [string, string[]] = [key, value]
            v.push(res)
        })

        const m = new Map(v)
        setState(deserialize(m))
    }, [search])

    return [state, setValue]
}

export function useURLParam<T>(
    urlParam: string,
    defaultValue: T,
    serialize?: (v: T) => string,
    deserialize?: (v: string) => T
) {
    const serializeFn =
        serialize !== undefined ? serialize : (v: T) => String(v)
    const deserializeFn =
        deserialize !== undefined ? deserialize : (v: string) => v as T
    return useURLState<T>(
        defaultValue,
        (v) => {
            const res = new Map<string, string[]>()
            res.set(urlParam, [serializeFn(v)])
            return res
        },
        (v) => {
            const m = v.get(urlParam) || []
            return deserializeFn(m[0])
        }
    )
}

export function useURLStringState(urlParam: string, defaultValue: string) {
    const [state, setState] = useURLState<string>(
        defaultValue,
        (v) => {
            const res = new Map<string, string[]>()
            res.set(urlParam, [v])
            return res
        },
        (v) => {
            const m = v.get(urlParam) || []
            return m[0]
        }
    )
    return {
        value: state,
        setValue: setState,
    }
}

export function useFilterState() {
    const [state, setState] = useURLState<IFilter>(
        {
            provider: '',
            connections: [],
            connectionGroup: [],
        },
        (v) => {
            const res = new Map<string, string[]>()
            res.set('provider', v.provider !== '' ? [v.provider] : [])
            res.set('connections', v.connections)
            return res
        },
        (v) => {
            return {
                provider:
                    (v.get('provider')?.at(0) as 'AWS' | 'Azure' | '') || '',
                connections: v.get('connections') || [],
                connectionGroup: [],
            }
        }
    )
    return {
        value: state,
        setValue: setState,
    }
}

export function useUrlDateRangeState(defaultValue: DateRange) {
    const parseValue = (v: string) => {
        return dayjs.utc(v)
    }
    const toString = (v: dayjs.Dayjs) => {
        return v.format('YYYY-MM-DD')
    }
    const [state, setState] = useURLState<DateRange>(
        defaultValue,
        (v) => {
            const res = new Map<string, string[]>()
            res.set('startDate', [toString(v.start)])
            res.set('endDate', [toString(v.end)])
            return res
        },
        (v) => {
            return {
                start: parseValue((v.get('startDate') || [])[0]),
                end: parseValue((v.get('endDate') || [])[0]),
            }
        }
    )
    return {
        value: state,
        setValue: setState,
    }
}
