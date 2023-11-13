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
import { numberDisplay } from '../../../utilities/numericDisplay'

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
                navigate(
                    `${benchmark?.id}${total ? '' : '/details#assignments'}`
                )
            }
        >
            <Flex flexDirection="col" className="h-full">
                <Flex flexDirection="col">
                    <Flex className="mb-3">
                        {getConnectorIcon(connector())}
                    </Flex>
                    <Title className="w-full truncate mb-3">
                        {benchmark?.title}
                    </Title>
                    <Flex className={`mb-3 ${total ? '' : 'hidden'}`}>
                        <Text>Security score:</Text>
                        <Text className="font-semibold">
                            {((passed / total || 0) * 100).toFixed(2)}%
                        </Text>
                    </Flex>
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
                            ((critical + high + medium + low) / total) * 100 ||
                            1
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
                    <Flex className={total ? '' : 'hidden'}>
                        <Text className="text-xs">{`${numberDisplay(
                            failed,
                            0
                        )} of ${numberDisplay(total, 0)} checks failed`}</Text>
                        {!!(failed / total) && (
                            <Text className="text-xs font-semibold">{`${Math.round(
                                (failed / total) * 100
                            )}% failed`}</Text>
                        )}
                    </Flex>
                    <Flex justifyContent="start" className="mt-6 gap-2">
                        {benchmark?.tags?.category?.map((cat) => (
                            <Badge color="slate">{cat}</Badge>
                        ))}
                        {!!benchmark?.tags?.cis && (
                            <Badge color="sky">CIS</Badge>
                        )}
                        {!!benchmark?.tags?.hipaa && (
                            <Badge color="blue">Hipaa</Badge>
                        )}
                    </Flex>
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
