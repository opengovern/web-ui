import { Radio } from 'pretty-checkbox-react'
import { Flex, Text } from '@tremor/react'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus } from '../../../../../api/api'
import { compareArrays } from '../../../../../components/Layout/Header/Filter'

interface IConformanceStatus {
    value:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus[]
        | undefined
    onChange: (
        c:
            | GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus[]
            | undefined
    ) => void
}

export default function ConformanceStatus({
    value,
    onChange,
}: IConformanceStatus) {
    const options = [
        {
            name: 'All',
            value: [
                GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus.ConformanceStatusFailed,
                GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus.ConformanceStatusPassed,
            ],
            icon: undefined,
        },
        {
            name: 'Failed',
            value: [
                GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus.ConformanceStatusFailed,
            ],
            icon: undefined,
        },
        {
            name: 'Passed',
            value: [
                GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus.ConformanceStatusPassed,
            ],
            icon: undefined,
        },
    ]

    return (
        <Flex flexDirection="col" alignItems="start" className="gap-1.5">
            {options.map((o) => (
                <Radio
                    name="conformance_status"
                    key={`conformance_status-${o.name}`}
                    checked={compareArrays(o.value.sort(), value?.sort() || [])}
                    onClick={() => onChange(o.value)}
                >
                    <Text>{o.name}</Text>
                </Radio>
            ))}
        </Flex>
    )
}
