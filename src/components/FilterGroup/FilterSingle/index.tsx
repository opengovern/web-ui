import { Popover, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Flex, Text, Icon } from '@tremor/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

interface IProbs {
    title: string
    icon: any
    itemsTitles: string[] | undefined
    children: any
    isValueChanged: boolean
    alignment?: 'left' | 'right'
}

const valueFormatter = (values: string[]) => {
    if (values.length >= 2) {
        return (
            <>
                <Text className=" text-gray-700 font-bold max-w-44 truncate">
                    {values.at(0)}
                </Text>
                <Text className="text-gray-500">{`+${values.length - 1}`}</Text>
            </>
        )
    }
    return (
        <Text className=" text-gray-700 font-bold max-w-48 truncate">
            {values}
        </Text>
    )
}

export default function FilterSingle({
    title,
    icon,
    itemsTitles,
    children,
    isValueChanged,
    alignment = 'left',
}: IProbs) {
    return (
        <Popover className="relative border-0">
            {({ open }) => (
                <>
                    <Popover.Button
                        className={`border ${
                            isValueChanged
                                ? 'border-gray-400'
                                : 'border-gray-300'
                        } ${
                            open ? 'shadow border-gray-400' : ''
                        } py-1.5 px-3 rounded-full`}
                    >
                        <Flex className="w-fit gap-2">
                            <Icon
                                icon={icon}
                                size="sm"
                                className="p-0 text-gray-500"
                            />
                            <Flex className="w-fit gap-1.5">
                                <Text>{title}</Text>
                                {isValueChanged && (
                                    <Text className="text-gray-300">
                                        {' | '}
                                    </Text>
                                )}
                                {isValueChanged &&
                                    itemsTitles &&
                                    valueFormatter(itemsTitles)}
                            </Flex>

                            <ChevronDownIcon className="ml-1 w-4 text-gray-400" />
                        </Flex>
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel
                            static
                            className={`absolute z-50 top-full ${alignment}-0`}
                        >
                            {children}
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    )
}
