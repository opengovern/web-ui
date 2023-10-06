import {
    Badge,
    Card,
    CategoryBar,
    Flex,
    Icon,
    Subtitle,
    Text,
    Title,
} from '@tremor/react'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { useNavigate } from 'react-router-dom'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary } from '../../../api/api'
import { CisIcon, HipaaIcon } from '../../../icons/icons'
import { getConnectorIcon } from '../ConnectorCard'

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

    const connector = () => {
        if (benchmark?.tags?.plugin) {
            if (benchmark?.tags?.plugin[0] === 'azure') {
                return 'Azure'
            }
            return 'AWS'
        }
        return undefined
    }

    return (
        <Card
            key={benchmark?.id}
            className="cursor-pointer"
            onClick={() =>
                navigate(`${benchmark?.id}${total ? '' : '#assignments'}`)
            }
        >
            <Title className="w-full truncate mb-1 font-semibold">
                {benchmark?.title}
            </Title>
            <Flex className={total ? '' : 'hidden'}>
                <Text>Score:</Text>
                <Badge
                    color={
                        (passed / total || 0) * 100 > 50 ? 'emerald' : 'rose'
                    }
                    className="cursor-pointer"
                >
                    {((passed / total || 0) * 100).toFixed(2)}%
                </Badge>
            </Flex>
            <Subtitle className="line-clamp-2 h-12 mb-6 mt-2 text-gray-600">
                {benchmark?.description}
            </Subtitle>
            <CategoryBar
                className={`w-full mb-2 ${total ? '' : 'hidden'}`}
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
            <Flex className={`mb-6 ${total ? '' : 'hidden'}`}>
                <Text className="text-xs">{`${failed} of ${total} checks failed`}</Text>
                {!!(failed / total) && (
                    <Text className="text-xs font-semibold">{`${Math.round(
                        (failed / total) * 100
                    )}% failed`}</Text>
                )}
            </Flex>
            <Flex>
                <Flex justifyContent="start" className="h-fit gap-x-1">
                    {getConnectorIcon(connector())}
                    {!!benchmark?.tags?.cis && (
                        <CisIcon className="w-10 h-10" />
                    )}
                    {!!benchmark?.tags?.hipaa && <HipaaIcon />}
                </Flex>
                <Flex justifyContent="end">
                    <Text color="blue" className={`${total ? 'hidden' : ''}`}>
                        Assign connection
                    </Text>
                    <Icon
                        icon={ChevronRightIcon}
                        color="blue"
                        size="md"
                        className="p-0"
                    />
                </Flex>
            </Flex>
        </Card>
    )
}
