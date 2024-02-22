import {
    Button,
    Flex,
    Text,
    Title,
    Subtitle,
    Metric,
    Badge,
    BadgeDelta,
    ProgressCircle,
} from '@tremor/react'
import {
    CubeIcon,
    CurrencyDollarIcon,
    ShieldCheckIcon,
    CpuChipIcon,
} from '@heroicons/react/24/outline'
import ScoreCategoryCard from '../../../components/Cards/ScoreCategoryCard'
import { Speed } from '../../../icons/icons'
import TopHeader from '../../../components/Layout/Header'
import BadgeDeltaSimple from '../../../components/ChangeDeltaSimple'

const data = [
    {
        title: 'Security',
        value: 31,
        category: 'security',
        change: 23,
        icon: ShieldCheckIcon,
    },
    {
        title: 'Cost Optimization',
        value: 65,
        category: 'costoptimization',
        change: -23,
        icon: CurrencyDollarIcon,
    },
    {
        title: 'Operational Excellence',
        value: 17,
        category: 'operationalexcellence',
        change: 23,
        icon: CpuChipIcon,
    },
    {
        title: 'Reliability',
        value: 81,
        category: 'reliability',
        change: -23,

        icon: CubeIcon,
    },

    {
        title: 'Efficiency',
        value: 91,
        category: 'efficiency',
        change: 23,
        icon: Speed,
    },
]

const checkDetails = [
    {
        level: 'Critical Risk',
        count: 89,
        color: 'rose',
    },
    {
        level: 'High Risk',
        count: 45,
        color: 'orange',
    },
    {
        level: 'Medium Risk',
        count: 23,
        color: 'amber',
    },
    {
        level: 'Low Risk',
        count: 19,
        color: 'yellow',
    },
    {
        level: 'None',
        count: 4,
        color: 'gray',
    },
    {
        level: 'Passed',
        count: 45,
        color: 'emerald',
    },
]

export default function ScoreOverview() {
    return (
        <>
            <TopHeader datePicker filter />

            <Flex alignItems="start" className="gap-20">
                <Flex flexDirection="col" className="h-full">
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        className="p-10 border border-gray-300 rounded-xl gap-8"
                    >
                        <Flex
                            flexDirection="col"
                            alignItems="start"
                            className="gap-3"
                        >
                            <Metric>What is SCORE ?</Metric>
                            <Subtitle className="text-gray-500">
                                SCORE is a comprehensive evaluation suite that
                                assesses your infrastructure against leading
                                cloud vendor recommendations, ensuring optimal
                                alignment with industry standards and best
                                practices.
                            </Subtitle>
                        </Flex>
                        <hr className="w-full border border-gray-200" />
                        <Flex
                            flexDirection="col"
                            alignItems="center"
                            className="gap-2"
                        >
                            <ProgressCircle
                                value={81}
                                size="xl"
                                className="relative"
                            >
                                <Flex flexDirection="col">
                                    <Title>{81}%</Title>
                                    <Text>Compliant</Text>
                                </Flex>
                            </ProgressCircle>
                            <BadgeDeltaSimple change={20}>
                                from previous month
                            </BadgeDeltaSimple>
                        </Flex>
                        <hr className="w-full border border-gray-200" />
                        <Flex
                            flexDirection="col"
                            alignItems="start"
                            className="gap-8"
                        >
                            <Flex justifyContent="start">
                                <Title className="mr-1.5 font-bold">104</Title>
                                insight evaluations performed across{' '}
                                <Title className="mx-1.5 font-bold">
                                    231
                                </Title>{' '}
                                cloud accounts
                            </Flex>
                            <Flex>
                                <Flex
                                    justifyContent="start"
                                    alignItems="start"
                                    flexDirection="col"
                                    className="gap-1"
                                >
                                    <Flex
                                        justifyContent="start"
                                        alignItems="baseline"
                                        className="gap-3"
                                    >
                                        <Metric color="rose">129</Metric>

                                        <Subtitle className="text-gray-500 mt-2">
                                            Failed Checks
                                        </Subtitle>
                                    </Flex>

                                    <BadgeDeltaSimple change={-7}>
                                        from previous time period
                                    </BadgeDeltaSimple>
                                </Flex>
                                <Flex
                                    justifyContent="start"
                                    alignItems="start"
                                    flexDirection="col"
                                    className="gap-1"
                                >
                                    <Flex
                                        justifyContent="start"
                                        alignItems="baseline"
                                        className="gap-3"
                                    >
                                        <Metric color="emerald">32</Metric>
                                        <Subtitle className="text-gray-500">
                                            Passed Checks
                                        </Subtitle>
                                    </Flex>

                                    <BadgeDeltaSimple change={6}>
                                        from previous time period
                                    </BadgeDeltaSimple>
                                </Flex>
                            </Flex>
                            <Flex justifyContent="start" className="gap-2">
                                {checkDetails.map((item) => (
                                    <Flex flexDirection="col" className="gap-2">
                                        <Badge
                                            color={item.color}
                                            className="w-full"
                                        >
                                            {item.count}
                                        </Badge>
                                        <Text>{item.level}</Text>
                                    </Flex>
                                ))}
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>

                <Flex flexDirection="col" className="gap-6">
                    {data.map((item) => (
                        <ScoreCategoryCard
                            title={item.title}
                            value={item.value}
                            change={item.change}
                            category={item.category}
                        />
                    ))}
                </Flex>
            </Flex>
        </>
    )
}
