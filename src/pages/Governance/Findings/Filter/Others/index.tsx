import { useEffect, useState } from 'react'
import { Button, Flex, Text, TextInput } from '@tremor/react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Checkbox, useCheckboxState } from 'pretty-checkbox-react'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiFindingFiltersWithMetadata } from '../../../../../api/api'
import Spinner from '../../../../../components/Spinner'
import { compareArrays } from '../../../../../components/Layout/Header/Filter'

interface IOthers {
    value: string[] | undefined
    defaultValue: string[]
    data:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiFindingFiltersWithMetadata
        | undefined
    type: 'benchmarkID' | 'connectionID' | 'controlID' | 'resourceTypeID'
    onChange: (o: string[]) => void
}

export default function Others({
    value,
    defaultValue,
    data,
    type,
    onChange,
}: IOthers) {
    const [search, setSearch] = useState('')
    const checkbox = useCheckboxState({ state: value })

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!compareArrays(value?.sort() || [], checkbox.state.sort()))
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            onChange([...checkbox.state])
    }, [checkbox.state])

    return (
        <Flex flexDirection="col" justifyContent="start" alignItems="start">
            <TextInput
                icon={MagnifyingGlassIcon}
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-4"
            />
            <Flex
                flexDirection="col"
                justifyContent="start"
                alignItems="start"
                className="gap-1.5 max-h-[200px] overflow-y-scroll no-scroll max-w-full"
            >
                {data ? (
                    data[type]
                        ?.filter(
                            (d) =>
                                d.displayName
                                    ?.toLowerCase()
                                    .includes(search.toLowerCase()) ||
                                d.key
                                    ?.toLowerCase()
                                    .includes(search.toLowerCase())
                        )
                        .map(
                            (d, i) =>
                                i < 100 && (
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    <Checkbox
                                        shape="curve"
                                        className="!items-start"
                                        value={d.key}
                                        {...checkbox}
                                    >
                                        <Flex
                                            flexDirection="col"
                                            alignItems="start"
                                        >
                                            <Text className="text-gray-800 line-clamp-1 max-w-[75%]">
                                                {d.displayName}
                                            </Text>
                                            <Text className="text-xs truncate max-w-[200px]">
                                                {d.key}
                                            </Text>
                                        </Flex>
                                    </Checkbox>
                                )
                        )
                ) : (
                    <Spinner />
                )}
            </Flex>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            {!compareArrays(value?.sort(), defaultValue?.sort()) && (
                <Flex className="pt-3 mt-3 border-t border-t-gray-200">
                    <Button
                        variant="light"
                        onClick={() => {
                            onChange(defaultValue)
                            checkbox.setState(defaultValue)
                        }}
                    >
                        Reset
                    </Button>
                </Flex>
            )}
        </Flex>
    )
}
