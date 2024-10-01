import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { Button, Text, Flex } from '@tremor/react'
import { Checkbox } from 'pretty-checkbox-react'
import { useState, ReactNode } from 'react'

interface IRequirement {
    checked: boolean
    setChecked: (value: boolean) => void
    title: ReactNode
    expanded?: ReactNode
}

export function Requirement({
    checked,
    setChecked,
    title,
    expanded,
}: IRequirement) {
    const [id, setId] = useState(String(Math.random()))
    const [open, setOpen] = useState(false)

    return (
        <Flex
            flexDirection="row"
            justifyContent="between"
            className="py-2"
            alignItems="start"
        >
            <Flex flexDirection="row" justifyContent="start" alignItems="start">
                <Checkbox
                    shape="curve"
                    id={id}
                    name={id}
                    checked={checked}
                    onChange={(e) => {
                        setChecked(e.target.checked)
                    }}
                    className="pt-1"
                />
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    onClick={() => setOpen(!open)}
                >
                    {title}
                    {open && expanded}
                </Flex>
            </Flex>

            {expanded !== undefined &&
                (open ? (
                    <ChevronUpIcon
                        onClick={() => setOpen(false)}
                        height={20}
                        color="text-blue-500"
                    />
                ) : (
                    <ChevronDownIcon
                        onClick={() => setOpen(true)}
                        height={20}
                        color="text-blue-500"
                    />
                ))}
        </Flex>
    )
}

interface Item {
    title: ReactNode
    expanded?: ReactNode
}
interface IPreRequisite {
    items: Item[]
    onPrev: () => void
    onNext: () => void
}

export function PreRequisite({ items, onPrev, onNext }: IPreRequisite) {
    const [checks, setChecks] = useState<boolean[]>(items.map((v) => false))
    const renderItems = () => {
        return items.map((item, idx) => {
            return (
                <Requirement
                    checked={checks[idx]}
                    setChecked={(v) => {
                        const arr = [...checks]
                        arr[idx] = v
                        setChecks(arr)
                    }}
                    title={item.title}
                    expanded={item.expanded}
                />
            )
        })
    }

    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" alignItems="start">
                <Text className="text-gray-900 mb-4">
                    All boxes are required
                </Text>
                <Flex
                    flexDirection="col"
                    justifyContent="start"
                    alignItems="start"
                >
                    {renderItems()}
                </Flex>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={() => onPrev()}>
                    Back
                </Button>
                <Button
                    disabled={checks.filter((i) => !i).length > 0}
                    onClick={() => onNext()}
                    className="ml-3"
                >
                    Next
                </Button>
            </Flex>
        </Flex>
    )
}
