import { useEffect, useState } from 'react'
import { Button, Card, List, ListItem } from '@tremor/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { camelCaseToLabel } from '../../../../../utilities/labelMaker'

interface IConditionDropdown {
    conditions: string[]
    onChange: (c: string) => void
}

const options = [
    'is',
    'isNot',
    'contains',
    'doesNotContain',
    'isEmpty',
    'isNotEmpty',
]

export default function ConditionDropdown({
    conditions,
    onChange,
}: IConditionDropdown) {
    const [open, setOpen] = useState(false)
    const [selectedCondition, setSelectedCondition] = useState<string>(
        conditions[0]
    )
    useEffect(() => {
        onChange(selectedCondition)
    }, [selectedCondition])
    return (
        <div className="relative z-10">
            <Button
                variant="light"
                icon={ChevronDownIcon}
                iconPosition="right"
                size="sm"
                onClick={() => setOpen(!open)}
            >
                {camelCaseToLabel(selectedCondition)}
            </Button>
            {open && (
                <Card className="mt-2 px-2 py-1 absolute w-36">
                    <List>
                        {options.map((o) => (
                            <ListItem key={o}>
                                <Button
                                    variant="light"
                                    color={
                                        o === selectedCondition
                                            ? 'blue'
                                            : 'slate'
                                    }
                                    onClick={() => {
                                        setSelectedCondition(o)
                                        setOpen(false)
                                    }}
                                    disabled={!conditions.includes(o)}
                                    className="w-full flex justify-start"
                                >
                                    {camelCaseToLabel(o)}
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                </Card>
            )}
        </div>
    )
}
