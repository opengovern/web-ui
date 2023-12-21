import {
    Button,
    Card,
    CategoryBar,
    Col,
    Flex,
    Grid,
    List,
    ListItem,
    Text,
    Title,
} from '@tremor/react'
import { useNavigate } from 'react-router-dom'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary } from '../../../api/api'
import { benchmarkChecks } from '../ComplianceCard'
import SummaryCard from '../SummaryCard'
import { getConnectorIcon } from '../ConnectorCard'

interface IComplianceCard {
    benchmark:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
        | undefined
}

export default function ComplianceListCard({ benchmark }: IComplianceCard) {
    const navigate = useNavigate()

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
                    `${benchmark?.id}${
                        benchmarkChecks(benchmark).total
                            ? ''
                            : '/details#assignments'
                    }`
                )
            }
        >
            <Flex className="mb-3">
                <Flex justifyContent="start" className="w-3/4 gap-3">
                    {getConnectorIcon(connector())}
                    <Title className="truncate">{benchmark?.title}</Title>
                </Flex>
                <Button
                    variant="light"
                    icon={ChevronRightIcon}
                    iconPosition="right"
                >
                    See detail
                </Button>
            </Flex>
            <Grid numItems={5}>
                <SummaryCard
                    title="Security score"
                    metric={
                        (benchmarkChecks(benchmark).passed /
                            benchmarkChecks(benchmark).total || 0) * 100
                    }
                    isPercent
                    border={false}
                />
                <Col numColSpan={2} className="px-6 border-x border-x-gray-200">
                    <Text className="font-semibold mb-4">Severity</Text>
                    <CategoryBar
                        className="w-full mb-4"
                        values={[
                            (benchmarkChecks(benchmark).critical /
                                benchmarkChecks(benchmark).total) *
                                100 || 0,
                            (benchmarkChecks(benchmark).high /
                                benchmarkChecks(benchmark).total) *
                                100 || 0,
                            (benchmarkChecks(benchmark).medium /
                                benchmarkChecks(benchmark).total) *
                                100 || 0,
                            (benchmarkChecks(benchmark).low /
                                benchmarkChecks(benchmark).total) *
                                100 || 0,
                            (benchmarkChecks(benchmark).passed /
                                benchmarkChecks(benchmark).total) *
                                100 || 0,
                            benchmarkChecks(benchmark).critical +
                                benchmarkChecks(benchmark).high +
                                benchmarkChecks(benchmark).medium +
                                benchmarkChecks(benchmark).low +
                                benchmarkChecks(benchmark).passed >
                            0
                                ? (benchmarkChecks(benchmark).unknown /
                                      benchmarkChecks(benchmark).total) *
                                      100 || 0
                                : 100,
                        ]}
                        markerValue={
                            ((benchmarkChecks(benchmark).critical +
                                benchmarkChecks(benchmark).high +
                                benchmarkChecks(benchmark).medium +
                                benchmarkChecks(benchmark).low) /
                                benchmarkChecks(benchmark).total) *
                                100 || 1
                        }
                        showLabels={false}
                        colors={[
                            '#6E120B',
                            '#CA2B1D',
                            '#EE9235',
                            '#F4C744',
                            '#54B584',
                            '#9BA2AE',
                        ]}
                    />
                    <Flex justifyContent="start" className="flex-wrap gap-2">
                        <Flex className="w-fit gap-1">
                            <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: '#6E120B' }}
                            />
                            <Text className="text-gray-800 text-xs">
                                Critical
                            </Text>
                            <Text className="text-xs">{`(${(
                                (benchmarkChecks(benchmark).critical /
                                    benchmarkChecks(benchmark).total) *
                                    100 || 0
                            ).toFixed(2)}%)`}</Text>
                        </Flex>
                        <Flex className="w-fit gap-1">
                            <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: '#CA2B1D' }}
                            />
                            <Text className="text-gray-800 text-xs">High</Text>
                            <Text className="text-xs">{`(${(
                                (benchmarkChecks(benchmark).high /
                                    benchmarkChecks(benchmark).total) *
                                    100 || 0
                            ).toFixed(2)}%)`}</Text>
                        </Flex>
                        <Flex className="w-fit gap-1">
                            <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: '#EE9235' }}
                            />
                            <Text className="text-gray-800 text-xs">
                                Medium
                            </Text>
                            <Text className="text-xs">{`(${(
                                (benchmarkChecks(benchmark).medium /
                                    benchmarkChecks(benchmark).total) *
                                    100 || 0
                            ).toFixed(2)}%)`}</Text>
                        </Flex>
                        <Flex className="w-fit gap-1">
                            <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: '#F4C744' }}
                            />
                            <Text className="text-gray-800 text-xs">Low</Text>
                            <Text className="text-xs">{`(${(
                                (benchmarkChecks(benchmark).low /
                                    benchmarkChecks(benchmark).total) *
                                    100 || 0
                            ).toFixed(2)}%)`}</Text>
                        </Flex>
                        <Flex className="w-fit gap-1">
                            <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: '#54B584' }}
                            />
                            <Text className="text-gray-800 text-xs">
                                Passed
                            </Text>
                            <Text className="text-xs">{`(${(
                                (benchmarkChecks(benchmark).passed /
                                    benchmarkChecks(benchmark).total) *
                                    100 || 0
                            ).toFixed(2)}%)`}</Text>
                        </Flex>
                        <Flex className="w-fit gap-1">
                            <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: '#9BA2AE' }}
                            />
                            <Text className="text-gray-800 text-xs">
                                Unknown
                            </Text>
                            <Text className="text-xs">{`(${(
                                (benchmarkChecks(benchmark).unknown /
                                    benchmarkChecks(benchmark).total) *
                                    100 || 0
                            ).toFixed(2)}%)`}</Text>
                        </Flex>
                    </Flex>
                </Col>
                <Col numColSpan={2} className="pl-6">
                    <Text className="font-semibold">Top accounts</Text>
                    <List>
                        {benchmark?.topConnections?.map((c) => (
                            <ListItem>
                                <Text>
                                    {
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-ignore
                                        c.Connection?.providerConnectionName
                                    }
                                </Text>
                                <Text>{c.count}</Text>
                            </ListItem>
                        ))}
                    </List>
                </Col>
            </Grid>
        </Card>
    )
}
