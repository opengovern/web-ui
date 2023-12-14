import { useParams } from 'react-router-dom'
import {
    Badge,
    BarList,
    Button,
    Card,
    CategoryBar,
    Col,
    Flex,
    Grid,
    Tab,
    TabGroup,
    TabList,
    Text,
    Title,
} from '@tremor/react'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline'
import Layout from '../../../../components/Layout'
import { filterAtom, timeAtom } from '../../../../store'
import {
    useComplianceApiV1BenchmarksSummaryDetail,
    useComplianceApiV1BenchmarksTrendDetail,
    useComplianceApiV1FindingsTopDetail,
} from '../../../../api/compliance.gen'
import { dateDisplay, dateTimeDisplay } from '../../../../utilities/dateDisplay'
import Header from '../../../../components/Header'
import { useScheduleApiV1ComplianceTriggerUpdate } from '../../../../api/schedule.gen'
import ListCard from '../../../../components/Cards/ListCard'
import {
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkTrendDatapoint,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse,
} from '../../../../api/api'
import Spinner from '../../../../components/Spinner'
import { benchmarkChecks } from '../../../../components/Cards/ComplianceCard'
import Policies from './Policies'

const generateLineData = (
    input:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkTrendDatapoint[]
        | undefined
) => {
    const data = []
    const label = []
    if (input) {
        for (let i = 0; i < input.length; i += 1) {
            label.push(dateDisplay((input[i].timestamp || 0) * 1000))
            data.push((input[i].securityScore || 0).toFixed(2))
        }
    }
    return { data, label }
}

const topList = (
    input:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse
        | undefined
) => {
    const data = []
    if (input && input.records) {
        for (let i = 0; i < (input.records?.length || 0); i += 1) {
            data.push({
                name:
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    input.records[i].ResourceType.resource_name.length
                        ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          input.records[i].ResourceType.resource_name
                        : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          input.records[i].ResourceType.resource_type,
                value: input.records[i].count || 0,
            })
        }
    }
    return data
}

const topConnections = (
    input:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse
        | undefined
) => {
    const top = []
    if (input && input.records) {
        for (let i = 0; i < input.records.length; i += 1) {
            top.push({
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                name: input.records[i].Connection?.providerConnectionName,
                value: input.records[i].count || 0,
            })
        }
    }
    return top
}

export default function BenchmarkSummary() {
    const { id, resourceId } = useParams()
    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)
    const [stateIndex, setStateIndex] = useState(0)

    const topQuery = {
        ...(selectedConnections.provider && {
            connector: [selectedConnections.provider],
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(selectedConnections.connectionGroup && {
            connectionGroup: selectedConnections.connectionGroup,
        }),
    }

    const {
        response: benchmarkDetail,
        isLoading,
        sendNow: updateDetail,
    } = useComplianceApiV1BenchmarksSummaryDetail(String(id))
    const { sendNow: triggerEvaluate, isExecuted } =
        useScheduleApiV1ComplianceTriggerUpdate(String(id), {}, false)
    const { response: connections } = useComplianceApiV1FindingsTopDetail(
        String(id),
        'connectionID',
        3,
        topQuery
    )
    const { response: resources } = useComplianceApiV1FindingsTopDetail(
        String(id),
        'resourceType',
        3,
        topQuery
    )

    const renderBars = () => {
        switch (stateIndex) {
            case 0:
                return <BarList data={topConnections(connections)} />
            case 2:
                return <BarList data={topList(resources)} />
            default:
                return <BarList data={topConnections(connections)} />
        }
    }

    useEffect(() => {
        if (isExecuted) {
            updateDetail()
        }
    }, [isExecuted])

    return (
        <Layout currentPage="compliance">
            <Header
                breadCrumb={[
                    benchmarkDetail?.title
                        ? benchmarkDetail?.title
                        : 'Benchmark summary',
                ]}
                filter
                datePicker
            />
            {isLoading ? (
                <Spinner className="mb-12" />
            ) : (
                <Flex alignItems="end" className="mb-6">
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        justifyContent="start"
                    >
                        <Title className="font-semibold mb-1">
                            {benchmarkDetail?.title}
                        </Title>
                        <Text className="w-2/3">
                            {benchmarkDetail?.description}
                        </Text>
                    </Flex>
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        className="w-fit"
                    >
                        <Button
                            variant="light"
                            icon={ArrowPathRoundedSquareIcon}
                            className="mb-1"
                            onClick={() => triggerEvaluate()}
                            loading={
                                !(
                                    benchmarkDetail?.lastJobStatus ===
                                        'FAILED' ||
                                    benchmarkDetail?.lastJobStatus ===
                                        'SUCCEEDED'
                                )
                            }
                        >
                            {benchmarkDetail?.lastJobStatus === 'FAILED' ||
                            benchmarkDetail?.lastJobStatus === 'SUCCEEDED'
                                ? 'Evaluate now'
                                : 'Evaluating'}
                        </Button>
                        <Text className="whitespace-nowrap">{`Last evaluation: ${dateTimeDisplay(
                            benchmarkDetail?.evaluatedAt
                        )}`}</Text>
                    </Flex>
                </Flex>
            )}
            <Grid numItems={2} className="gap-4 mb-4">
                <Card>
                    <Flex alignItems="end" className="mb-10">
                        <Flex
                            flexDirection="col"
                            alignItems="start"
                            className="gap-1"
                        >
                            <Text className="font-semibold">
                                Security score
                            </Text>
                            <Title className="font-semibold">
                                {`${(
                                    (benchmarkChecks(benchmarkDetail).passed /
                                        benchmarkChecks(benchmarkDetail)
                                            .total) *
                                    100
                                ).toFixed(2)}%`}
                            </Title>
                        </Flex>
                        <Flex justifyContent="end" className="gap-3">
                            <Flex
                                justifyContent="start"
                                className="w-fit gap-2"
                            >
                                <Text>Passed</Text>
                                <Badge color="emerald">
                                    {benchmarkChecks(benchmarkDetail).passed}
                                </Badge>
                            </Flex>
                            <Flex
                                justifyContent="start"
                                className="w-fit gap-2"
                            >
                                <Text>Failed</Text>
                                <Badge color="rose">
                                    {benchmarkChecks(benchmarkDetail).total -
                                        benchmarkChecks(benchmarkDetail).passed}
                                </Badge>
                            </Flex>
                        </Flex>
                    </Flex>
                    <CategoryBar
                        className="w-full mb-2"
                        values={[
                            (benchmarkChecks(benchmarkDetail).critical /
                                benchmarkChecks(benchmarkDetail).total) *
                                100 || 0,
                            (benchmarkChecks(benchmarkDetail).high /
                                benchmarkChecks(benchmarkDetail).total) *
                                100 || 0,
                            (benchmarkChecks(benchmarkDetail).medium /
                                benchmarkChecks(benchmarkDetail).total) *
                                100 || 0,
                            (benchmarkChecks(benchmarkDetail).low /
                                benchmarkChecks(benchmarkDetail).total) *
                                100 || 0,
                            (benchmarkChecks(benchmarkDetail).passed /
                                benchmarkChecks(benchmarkDetail).total) *
                                100 || 0,
                            benchmarkChecks(benchmarkDetail).critical +
                                benchmarkChecks(benchmarkDetail).high +
                                benchmarkChecks(benchmarkDetail).medium +
                                benchmarkChecks(benchmarkDetail).low +
                                benchmarkChecks(benchmarkDetail).passed >
                            0
                                ? (benchmarkChecks(benchmarkDetail).unknown /
                                      benchmarkChecks(benchmarkDetail).total) *
                                      100 || 0
                                : 100,
                        ]}
                        markerValue={
                            ((benchmarkChecks(benchmarkDetail).critical +
                                benchmarkChecks(benchmarkDetail).high +
                                benchmarkChecks(benchmarkDetail).medium +
                                benchmarkChecks(benchmarkDetail).low) /
                                benchmarkChecks(benchmarkDetail).total) *
                                100 || 1
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
                    <Flex className="mt-6 flex-wrap">
                        <Flex className="w-fit gap-1">
                            <Text className="text-gray-800">Critical</Text>
                            <Text>{`(${(
                                (benchmarkChecks(benchmarkDetail).critical /
                                    benchmarkChecks(benchmarkDetail).total) *
                                100
                            ).toFixed(2)}%)`}</Text>
                        </Flex>
                        <Flex className="w-fit gap-1">
                            <Text className="text-gray-800">High</Text>
                            <Text>{`(${(
                                (benchmarkChecks(benchmarkDetail).high /
                                    benchmarkChecks(benchmarkDetail).total) *
                                100
                            ).toFixed(2)}%)`}</Text>
                        </Flex>
                        <Flex className="w-fit gap-1">
                            <Text className="text-gray-800">Medium</Text>
                            <Text>{`(${(
                                (benchmarkChecks(benchmarkDetail).medium /
                                    benchmarkChecks(benchmarkDetail).total) *
                                100
                            ).toFixed(2)}%)`}</Text>
                        </Flex>
                        <Flex className="w-fit gap-1">
                            <Text className="text-gray-800">Low</Text>
                            <Text>{`(${(
                                (benchmarkChecks(benchmarkDetail).low /
                                    benchmarkChecks(benchmarkDetail).total) *
                                100
                            ).toFixed(2)}%)`}</Text>
                        </Flex>
                        <Flex className="w-fit gap-1">
                            <Text className="text-gray-800">Passed</Text>
                            <Text>{`(${(
                                (benchmarkChecks(benchmarkDetail).passed /
                                    benchmarkChecks(benchmarkDetail).total) *
                                100
                            ).toFixed(2)}%)`}</Text>
                        </Flex>
                        <Flex className="w-fit gap-1">
                            <Text className="text-gray-800">Unknown</Text>
                            <Text>{`(${(
                                (benchmarkChecks(benchmarkDetail).unknown /
                                    benchmarkChecks(benchmarkDetail).total) *
                                100
                            ).toFixed(2)}%)`}</Text>
                        </Flex>
                    </Flex>
                </Card>
                <Card>
                    <Flex justifyContent="between" className="mb-3">
                        <Title className="font-semibold">Top</Title>
                        <TabGroup
                            className="w-fit"
                            index={stateIndex}
                            onIndexChange={setStateIndex}
                        >
                            <TabList variant="solid">
                                <Tab>Cloud accounts</Tab>
                                <Tab>Controls</Tab>
                                <Tab>Services</Tab>
                            </TabList>
                        </TabGroup>
                    </Flex>
                    {renderBars()}
                </Card>
            </Grid>
            <Policies id={String(id)} />
        </Layout>
    )
}
