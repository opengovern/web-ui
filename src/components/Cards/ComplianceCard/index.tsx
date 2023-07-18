import {
    Badge,
    Card,
    CategoryBar,
    Flex,
    Icon,
    Text,
    Title,
} from '@tremor/react'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { useNavigate } from 'react-router-dom'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary } from '../../../api/api'
import { AzureIcon, CisIcon, RoundAzureIcon } from '../../../icons/icons'

interface IComplianceCard {
    benchmark:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
        | undefined
}

export default function ComplianceCard({ benchmark }: IComplianceCard) {
    const navigate = useNavigate()

    const critical = benchmark?.checks?.criticalCount || 0
    const high = benchmark?.checks?.highCount || 0
    const medium = benchmark?.checks?.mediumCount || 0
    const low = benchmark?.checks?.lowCount || 0
    const passed = benchmark?.checks?.passedCount || 0
    const unknown = benchmark?.checks?.unknownCount || 0

    const total = critical + high + medium + low + passed + unknown
    const failed = critical + high + medium + low

    const ok = benchmark?.result?.okCount || 0
    const info = benchmark?.result?.infoCount || 0
    const error = benchmark?.result?.errorCount || 0
    const alarm = benchmark?.result?.alarmCount || 0
    const skip = benchmark?.result?.skipCount || 0

    return (
        <Card
            key={benchmark?.id}
            className="cursor-pointer"
            onClick={() => navigate(`${benchmark?.id}`)}
        >
            <Title className="w-full truncate mb-1">{benchmark?.title}</Title>
            <Text className="line-clamp-2 mb-6">{benchmark?.description}</Text>
            <CategoryBar
                className="w-full mb-2"
                values={[
                    (critical / total) * 100 || 0,
                    (high / total) * 100 || 0,
                    (medium / total) * 100 || 0,
                    (low / total) * 100 || 0,
                    (passed / total) * 100 || 0,
                    critical + high + medium + low + passed > 0
                        ? (unknown / total) * 100 || 0
                        : 100,
                ]}
                markerValue={
                    ((critical + high + medium + low) / total) * 100 || 1
                }
                showLabels={false}
                colors={[
                    'rose',
                    'orange',
                    'amber',
                    'yellow',
                    'emerald',
                    'slate',
                ]}
            />
            <Flex className="mb-6">
                <Text className="text-xs">{`${failed} of ${total} checks failed`}</Text>
                {!!(failed / total) && (
                    <Text className="text-xs font-semibold">{`${Math.round(
                        (failed / total) * 100
                    )}% failed`}</Text>
                )}
            </Flex>
            <Flex
                className={
                    ok / (ok + info + error + skip + alarm)
                        ? 'opacity-100'
                        : 'opacity-0'
                }
            >
                <Text className="font-semibold">Coverage:</Text>
                <Badge color="emerald" className="cursor-pointer">
                    {((ok / (ok + info + error + skip + alarm)) * 100).toFixed(
                        2
                    )}
                    %
                </Badge>
            </Flex>
            <Flex className="mt-6">
                <Flex justifyContent="start" className="gap-x-1">
                    {!!(
                        benchmark?.tags?.plugin &&
                        benchmark?.tags?.plugin[0] === 'azure'
                    ) && <RoundAzureIcon />}
                    {!!benchmark?.tags?.cis && <CisIcon />}
                </Flex>
                <Icon
                    icon={ChevronRightIcon}
                    color="blue"
                    size="lg"
                    className="p-0"
                />
            </Flex>
        </Card>
    )
}
