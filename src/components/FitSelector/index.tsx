import {
    CheckIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from '@heroicons/react/24/outline'
import { Card, Flex, Text } from '@tremor/react'
import { useState } from 'react'
import { capitalizeFirstLetter } from '../../utilities/labelMaker'

interface IFitSelector {
    values: string[]
    value: string
    title: string
    onValueChange: (value: string) => void
}

export default function FitSelector({
    values,
    value,
    title,
    onValueChange,
}: IFitSelector) {
    const [open, setOpen] = useState(false)

    return (
        <Flex
            flexDirection="col"
            alignItems="start"
            className="w-fit cursor-pointer hover:bg-slate-50 p-2 px-4 rounded-lg gap-1"
            onClick={() => setOpen(!open)}
        >
            <div
                className="relative"
                style={{
                    transition: 'all 1s;',
                }}
            >
                {open && (
                    <Card className="absolute top-4 left-0 w-fit p-0 h-fit">
                        {values.map((item) => {
                            return (
                                <Flex
                                    className="p-2 px-2 border-b"
                                    onClick={() => onValueChange(item)}
                                >
                                    <text className="text-sm">
                                        {capitalizeFirstLetter(item)}
                                    </text>
                                    {value === item && (
                                        <CheckIcon
                                            className="ml-4 w-4"
                                            color="Gray"
                                        />
                                    )}
                                </Flex>
                            )
                        })}
                    </Card>
                )}
            </div>

            <text className="text-xs text-slate-500">{title}</text>
            <Flex flexDirection="row" alignItems="center">
                <text className="text-md">{capitalizeFirstLetter(value)}</text>
                {open ? (
                    <ChevronUpIcon className="w-4 ml-1 mt-1" color="Gray" />
                ) : (
                    <ChevronDownIcon className="w-4 ml-1 mt-1" color="Gray" />
                )}
            </Flex>
        </Flex>
    )
}
