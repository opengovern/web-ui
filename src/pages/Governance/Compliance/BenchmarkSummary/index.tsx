import { useParams } from 'react-router-dom'
import {
    Badge,
    BarList,
    Button,
    Card,
    CategoryBar,
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
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import Layout from '../../../../components/Layout'
import { filterAtom } from '../../../../store'
import {
    useComplianceApiV1BenchmarksSummaryDetail,
    useComplianceApiV1FindingsTopDetail,
} from '../../../../api/compliance.gen'
import { dateTimeDisplay } from '../../../../utilities/dateDisplay'
import Header from '../../../../components/Header'
import { useScheduleApiV1ComplianceTriggerUpdate } from '../../../../api/schedule.gen'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse } from '../../../../api/api'
import Spinner from '../../../../components/Spinner'
import { benchmarkChecks } from '../../../../components/Cards/ComplianceCard'
import Controls from './Controls'
import Settings from './Settings'
import TopDetails from './TopDetails'

const topResources = (
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
        | undefined,
    id: string | undefined
) => {
    const top = []
    if (input && input.records) {
        for (let i = 0; i < input.records.length; i += 1) {
            top.push({
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                name: input.records[i].Connection?.providerConnectionName,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                href: `${id}/account_${input.records[i].Connection?.id}`,
                value: input.records[i].count || 0,
            })
        }
    }
    return top
}

const topControls = (
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
                name: input.records[i].Control?.title,
                value: input.records[i].count || 0,
            })
        }
    }
    return top
}

export default function BenchmarkSummary() {
    const { benchmarkId, resourceId } = useParams()
    const selectedConnections = useAtomValue(filterAtom)
    const [stateIndex, setStateIndex] = useState(0)
    const [type, setType] = useState<'accounts' | 'services'>('accounts')
    const [openTop, setOpenTop] = useState(false)

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
    } = useComplianceApiV1BenchmarksSummaryDetail(String(benchmarkId))
    const { sendNow: triggerEvaluate, isExecuted } =
        useScheduleApiV1ComplianceTriggerUpdate(String(benchmarkId), {}, false)
    const { response: connections } = useComplianceApiV1FindingsTopDetail(
        String(benchmarkId),
        'connectionID',
        3,
        topQuery
    )
    const { response: resources } = useComplianceApiV1FindingsTopDetail(
        String(benchmarkId),
        'resourceType',
        3,
        topQuery
    )
    const { response: controls } = useComplianceApiV1FindingsTopDetail(
        String(benchmarkId),
        'controlID',
        3,
        topQuery
    )

    const renderBars = () => {
        switch (stateIndex) {
            case 0:
                // setType('accounts')
                return (
                    <BarList
                        data={topConnections(connections, benchmarkDetail?.id)}
                    />
                )
            case 1:
                return <BarList data={topControls(controls)} />
            case 2:
                return <BarList data={topResources(resources)} />
            default:
                return (
                    <BarList
                        data={topConnections(connections, benchmarkDetail?.id)}
                    />
                )
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
            >
                <Settings id={benchmarkDetail?.id} />
            </Header>
            {isLoading ? (
                <Spinner className="mb-12" />
            ) : (
                <>
                    <Flex alignItems="end" className="mb-6">
                        <Flex
                            flexDirection="col"
                            alignItems="start"
                            justifyContent="start"
                            className="gap-2"
                        >
                            <Title className="font-semibold">
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
                                            (benchmarkChecks(benchmarkDetail)
                                                .passed /
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
                                            {
                                                benchmarkChecks(benchmarkDetail)
                                                    .passed
                                            }
                                        </Badge>
                                    </Flex>
                                    <Flex
                                        justifyContent="start"
                                        className="w-fit gap-2"
                                    >
                                        <Text>Failed</Text>
                                        <Badge color="rose">
                                            {benchmarkChecks(benchmarkDetail)
                                                .total -
                                                benchmarkChecks(benchmarkDetail)
                                                    .passed}
                                        </Badge>
                                    </Flex>
                                </Flex>
                            </Flex>
                            <CategoryBar
                                className="w-full mb-2"
                                values={[
                                    (benchmarkChecks(benchmarkDetail).critical /
                                        benchmarkChecks(benchmarkDetail)
                                            .total) *
                                        100 || 0,
                                    (benchmarkChecks(benchmarkDetail).high /
                                        benchmarkChecks(benchmarkDetail)
                                            .total) *
                                        100 || 0,
                                    (benchmarkChecks(benchmarkDetail).medium /
                                        benchmarkChecks(benchmarkDetail)
                                            .total) *
                                        100 || 0,
                                    (benchmarkChecks(benchmarkDetail).low /
                                        benchmarkChecks(benchmarkDetail)
                                            .total) *
                                        100 || 0,
                                    (benchmarkChecks(benchmarkDetail).passed /
                                        benchmarkChecks(benchmarkDetail)
                                            .total) *
                                        100 || 0,
                                    benchmarkChecks(benchmarkDetail).critical +
                                        benchmarkChecks(benchmarkDetail).high +
                                        benchmarkChecks(benchmarkDetail)
                                            .medium +
                                        benchmarkChecks(benchmarkDetail).low +
                                        benchmarkChecks(benchmarkDetail)
                                            .passed >
                                    0
                                        ? (benchmarkChecks(benchmarkDetail)
                                              .unknown /
                                              benchmarkChecks(benchmarkDetail)
                                                  .total) *
                                              100 || 0
                                        : 100,
                                ]}
                                markerValue={
                                    ((benchmarkChecks(benchmarkDetail)
                                        .critical +
                                        benchmarkChecks(benchmarkDetail).high +
                                        benchmarkChecks(benchmarkDetail)
                                            .medium +
                                        benchmarkChecks(benchmarkDetail).low) /
                                        benchmarkChecks(benchmarkDetail)
                                            .total) *
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
                            <Flex
                                justifyContent="start"
                                className="mt-6 flex-wrap gap-2"
                            >
                                <Flex className="w-fit gap-1">
                                    <div
                                        className="h-2 w-2 rounded-full"
                                        style={{ backgroundColor: '#F43F5E' }}
                                    />
                                    <Text className="text-gray-800 text-xs">
                                        Critical
                                    </Text>
                                    <Text className="text-xs">{`(${(
                                        (benchmarkChecks(benchmarkDetail)
                                            .critical /
                                            benchmarkChecks(benchmarkDetail)
                                                .total) *
                                        100
                                    ).toFixed(2)}%)`}</Text>
                                </Flex>
                                <Flex className="w-fit gap-1">
                                    <div
                                        className="h-2 w-2 rounded-full"
                                        style={{ backgroundColor: '#F87315' }}
                                    />
                                    <Text className="text-gray-800 text-xs">
                                        High
                                    </Text>
                                    <Text className="text-xs">{`(${(
                                        (benchmarkChecks(benchmarkDetail).high /
                                            benchmarkChecks(benchmarkDetail)
                                                .total) *
                                        100
                                    ).toFixed(2)}%)`}</Text>
                                </Flex>
                                <Flex className="w-fit gap-1">
                                    <div
                                        className="h-2 w-2 rounded-full"
                                        style={{ backgroundColor: '#F59E0B' }}
                                    />
                                    <Text className="text-gray-800 text-xs">
                                        Medium
                                    </Text>
                                    <Text className="text-xs">{`(${(
                                        (benchmarkChecks(benchmarkDetail)
                                            .medium /
                                            benchmarkChecks(benchmarkDetail)
                                                .total) *
                                        100
                                    ).toFixed(2)}%)`}</Text>
                                </Flex>
                                <Flex className="w-fit gap-1">
                                    <div
                                        className="h-2 w-2 rounded-full"
                                        style={{ backgroundColor: '#EAB305' }}
                                    />
                                    <Text className="text-gray-800 text-xs">
                                        Low
                                    </Text>
                                    <Text className="text-xs">{`(${(
                                        (benchmarkChecks(benchmarkDetail).low /
                                            benchmarkChecks(benchmarkDetail)
                                                .total) *
                                        100
                                    ).toFixed(2)}%)`}</Text>
                                </Flex>
                                <Flex className="w-fit gap-1">
                                    <div
                                        className="h-2 w-2 rounded-full"
                                        style={{ backgroundColor: '#11B981' }}
                                    />
                                    <Text className="text-gray-800 text-xs">
                                        Passed
                                    </Text>
                                    <Text className="text-xs">{`(${(
                                        (benchmarkChecks(benchmarkDetail)
                                            .passed /
                                            benchmarkChecks(benchmarkDetail)
                                                .total) *
                                        100
                                    ).toFixed(2)}%)`}</Text>
                                </Flex>
                                <Flex className="w-fit gap-1">
                                    <div
                                        className="h-2 w-2 rounded-full"
                                        style={{ backgroundColor: '#64748B' }}
                                    />
                                    <Text className="text-gray-800 text-xs">
                                        Unknown
                                    </Text>
                                    <Text className="text-xs">{`(${(
                                        (benchmarkChecks(benchmarkDetail)
                                            .unknown /
                                            benchmarkChecks(benchmarkDetail)
                                                .total) *
                                        100
                                    ).toFixed(2)}%)`}</Text>
                                </Flex>
                            </Flex>
                        </Card>
                        <Card>
                            <Flex justifyContent="between" className="mb-3">
                                <button
                                    type="button"
                                    onClick={() => setOpenTop(true)}
                                >
                                    {stateIndex === 0 || stateIndex === 2 ? (
                                        <Flex className="gap-1.5">
                                            <Title className="font-semibold">
                                                Top
                                            </Title>
                                            <ChevronRightIcon className="h-4 text-kaytu-500" />
                                        </Flex>
                                    ) : (
                                        <Title className="font-semibold">
                                            Top
                                        </Title>
                                    )}
                                </button>
                                <TabGroup
                                    className="w-fit"
                                    index={stateIndex}
                                    onIndexChange={setStateIndex}
                                >
                                    <TabList variant="solid">
                                        <Tab
                                            onClick={() => setType('accounts')}
                                        >
                                            Cloud accounts
                                        </Tab>
                                        <Tab>Controls</Tab>
                                        <Tab
                                            onClick={() => setType('services')}
                                        >
                                            Services
                                        </Tab>
                                    </TabList>
                                </TabGroup>
                            </Flex>
                            {renderBars()}
                            <TopDetails
                                open={openTop}
                                onClose={() => setOpenTop(false)}
                                id={benchmarkDetail?.id}
                                type={type}
                                connections={selectedConnections}
                                resourceId={resourceId}
                            />
                        </Card>
                    </Grid>
                    <Controls id={String(benchmarkId)} />
                </>
            )}
        </Layout>
    )
}
