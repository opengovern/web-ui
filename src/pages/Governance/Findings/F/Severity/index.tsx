import { Checkbox, useCheckboxState } from 'pretty-checkbox-react'
import { Flex, Text } from '@tremor/react'
import { useEffect } from 'react'
import {
    GithubComKaytuIoKaytuEnginePkgComplianceApiFindingFiltersWithMetadata,
    TypesFindingSeverity,
} from '../../../../../api/api'

interface ISeverity {
    data:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiFindingFiltersWithMetadata
        | undefined
    onChange: (s: TypesFindingSeverity[]) => void
}

export default function Severity({ data, onChange }: ISeverity) {
    const severityCheckbox = useCheckboxState({
        state: [
            TypesFindingSeverity.FindingSeverityCritical,
            TypesFindingSeverity.FindingSeverityHigh,
            TypesFindingSeverity.FindingSeverityMedium,
            TypesFindingSeverity.FindingSeverityLow,
            TypesFindingSeverity.FindingSeverityNone,
        ],
    })
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onChange(severityCheckbox.state)
    }, [severityCheckbox])

    const options = [
        {
            name: 'Critical',
            value: TypesFindingSeverity.FindingSeverityCritical,
            color: '#6E120B',
        },
        {
            name: 'High',
            value: TypesFindingSeverity.FindingSeverityHigh,
            color: '#CA2B1D',
        },
        {
            name: 'Medium',
            value: TypesFindingSeverity.FindingSeverityMedium,
            color: '#EE9235',
        },
        {
            name: 'Low',
            value: TypesFindingSeverity.FindingSeverityLow,
            color: '#F4C744',
        },
        {
            name: 'None',
            value: TypesFindingSeverity.FindingSeverityNone,
            color: '#9BA2AE',
        },
    ]

    return (
        <Flex flexDirection="col" alignItems="start" className="gap-1.5">
            {options.map((o) => (
                <Flex>
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {/* @ts-ignore */}
                    <Checkbox
                        shape="curve"
                        className="!items-start w-full"
                        value={o.value}
                        {...severityCheckbox}
                    >
                        <Flex className="gap-1.5">
                            <div
                                className="h-4 w-1.5 rounded-sm"
                                style={{
                                    backgroundColor: o.color,
                                }}
                            />
                            <Text>{o.name}</Text>
                        </Flex>
                    </Checkbox>
                    <Text>
                        {data
                            ? `(${
                                  data.severity?.find(
                                      (d) => d.key === o.name.toLowerCase()
                                  )?.count
                              })`
                            : ''}
                    </Text>
                </Flex>
            ))}
        </Flex>
    )
}
