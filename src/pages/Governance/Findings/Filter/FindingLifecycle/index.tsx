import { Flex, Text } from '@tremor/react'
import { Radio } from 'pretty-checkbox-react'
import { compareArrays } from '../../../../../components/Layout/Header/Filter'

interface ILifecycle {
    value: boolean[]
    onChange: (l: boolean[]) => void
}

export default function FindingLifecycle({ value, onChange }: ILifecycle) {
    const options = [
        { name: 'All', value: [true, false] },
        {
            name: 'Active',
            value: [true],
        },
        {
            name: 'Archived',
            value: [false],
        },
    ]

    return (
        <Flex flexDirection="col" alignItems="start" className="gap-1.5">
            {options.map((o) => (
                <Radio
                    name="lifecycle"
                    key={`lifecycle-${o.name}`}
                    checked={compareArrays(value.sort(), o.value.sort())}
                    onClick={() => onChange(o.value)}
                >
                    <Text>{o.name}</Text>
                </Radio>
            ))}
        </Flex>
    )
}
