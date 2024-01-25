import { Flex, Text } from '@tremor/react'
import { Radio } from 'pretty-checkbox-react'
import { SourceType } from '../../../../../api/api'

interface IProvider {
    value: string
    onChange: (p: SourceType) => void
}
export default function Provider({ value, onChange }: IProvider) {
    const options = [
        { name: 'All', value: SourceType.Nil, icon: undefined },
        { name: 'AWS', value: SourceType.CloudAWS, icon: undefined },
        { name: 'Azure', value: SourceType.CloudAzure, icon: undefined },
    ]

    return (
        <Flex flexDirection="col" alignItems="start" className="gap-1.5">
            {options.map((o) => (
                <Radio
                    name="provider"
                    key={`provider-${o.name}`}
                    checked={value === o.value}
                    onClick={() => onChange(o.value)}
                >
                    <Text>{o.name}</Text>
                </Radio>
            ))}
        </Flex>
    )
}
