import dayjs from 'dayjs'
import { atom, useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export interface DateRange {
    start: dayjs.Dayjs
    end: dayjs.Dayjs
}

export const defaultTime: DateRange = {
    start: dayjs.utc().add(-7, 'days'),
    end: dayjs.utc(),
}

export const defaultFindingsTime: DateRange = {
    start: dayjs.utc().startOf('day'),
    end: dayjs.utc().endOf('day'),
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

const getLocationSearch = () =>
    window.location.search.at(0) === '?'
        ? window.location.search.slice(1, 100000)
        : window.location.search

export const searchAtom = atom<string>(getLocationSearch())

export function useURLState<T>(
    defaultValue: T,
    serialize: (v: T) => Map<string, string[]>,
    deserialize: (v: Map<string, string[]>) => T
): [T, (v: T) => void] {
    const [searchParams] = useSearchParams()
    const [search, setSearch] = useAtom(searchAtom)

    const currentParams = () => {
        const params = new URLSearchParams()
        getLocationSearch()
            .split('&')
            .map((v2) => v2.split('=').map((v3) => decodeURIComponent(v3)))
            .forEach((i) => {
                if (i[0] !== '') {
                    params.append(i[0], i[1])
                }
            })
        return params
    }

    const currentValue = () => {
        const serialized = serialize(defaultValue)
        const params = currentParams()

        const v: [string, string[]][] = []
        serialized.forEach((defValue, key) => {
            const value = params.has(key) ? params.getAll(key) : defValue
            v.push([key, value])
        })

        return deserialize(new Map(v))
    }

    const [state, setState] = useState<T>(currentValue())

    const updateSearch = () => {
        // keeping search in sync with url
        const nSearch = getLocationSearch()
        if (search !== nSearch) {
            setSearch(nSearch)
        }
    }

    const setValue = (v: T) => {
        const serialized = serialize(v)
        const newParams = new URLSearchParams()
        currentParams().forEach((value, key) => newParams.append(key, value))

        serialized.forEach((value, key) => {
            newParams.delete(key)
            value.forEach((item) => {
                newParams.append(key, item)
            })
        })

        window.history.pushState({}, '', `?${newParams.toString()}`)
        updateSearch()
    }

    useEffect(() => {
        setState(currentValue())
    }, [search])

    useEffect(() => {
        updateSearch()
    }, [searchParams])

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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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
