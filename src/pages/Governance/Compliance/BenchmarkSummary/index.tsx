import { useParams } from 'react-router-dom'
import {
    BarList,
    Button,
    Card,
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
import {
    ArrowPathRoundedSquareIcon,
    CheckCircleIcon,
    InformationCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline'
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
import { numberDisplay } from '../../../../utilities/numericDisplay'
import SeverityBar from '../../../../components/SeverityBar'
import Modal from '../../../../components/Modal'

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
        | undefined,
    id: string | undefined
) => {
    const top = []
    if (input && input.records) {
        for (let i = 0; i < input.records.length; i += 1) {
            top.push({
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                name: input.records[i].Control?.title,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                href: `${id}/${input.records[i].Control?.id}`,
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
    const [type, setType] = useState<'accounts' | 'services' | 'controls'>(
        'accounts'
    )
    const [openTop, setOpenTop] = useState(false)
    const [openConfirm, setOpenConfirm] = useState(false)
    const [assignments, setAssignments] = useState(0)

    const topQuery = {
        ...(benchmarkId && { benchmarkId: [benchmarkId] }),
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
        'connectionID',
        3,
        topQuery
    )
    const { response: resources } = useComplianceApiV1FindingsTopDetail(
        'resourceType',
        3,
        topQuery
    )
    const { response: controls } = useComplianceApiV1FindingsTopDetail(
        'controlID',
        3,
        topQuery
    )
    console.log(benchmarkDetail)

    const renderBars = () => {
        switch (stateIndex) {
            case 0:
                return (
                    <BarList
                        data={topConnections(connections, benchmarkDetail?.id)}
                        valueFormatter={(param: any) =>
                            `${numberDisplay(param, 0)} issues`
                        }
                    />
                )
            case 1:
                return (
                    <BarList
                        data={topControls(controls, benchmarkDetail?.id)}
                        valueFormatter={(param: any) =>
                            `${numberDisplay(param, 0)} issues`
                        }
                    />
                )
            case 2:
                return (
                    <BarList
                        data={topResources(resources)}
                        valueFormatter={(param: any) =>
                            `${numberDisplay(param, 0)} issues`
                        }
                    />
                )
            default:
                return (
                    <BarList
                        data={topConnections(connections, benchmarkDetail?.id)}
                        valueFormatter={(param: any) =>
                            `${numberDisplay(param, 0)} issues`
                        }
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
                <Settings
                    id={benchmarkDetail?.id}
                    response={(e) =>
                        setAssignments(e?.connections?.length || 0)
                    }
                    autoAssign={benchmarkDetail?.autoAssign}
                />
            </Header>
            {isLoading ? (
                <Spinner className="mt-56" />
            ) : (
                <>
                    <Flex alignItems="end" className="mb-6">
                        <Flex
                            flexDirection="col"
                            alignItems="start"
                            justifyContent="start"
                            className="gap-2 w-3/4"
                        >
                            <Title className="font-semibold">
                                {benchmarkDetail?.title}
                            </Title>
                            <div className="group w-full relative flex justify-center">
                                <Text className="truncate">
                                    {benchmarkDetail?.description}
                                </Text>
                                <div className="absolute w-full z-40 top-0 scale-0 transition-all rounded p-2 shadow-md bg-white group-hover:scale-100">
                                    <Text>{benchmarkDetail?.description}</Text>
                                </div>
                            </div>
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
                                onClick={() => setOpenConfirm(true)}
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
                        <Modal
                            open={openConfirm}
                            onClose={() => setOpenConfirm(false)}
                        >
                            <Title>
                                {`Do you want to run evaluation on ${assignments} accounts?`}
                            </Title>
                            <Flex className="mt-8">
                                <Button
                                    variant="secondary"
                                    onClick={() => setOpenConfirm(false)}
                                >
                                    Close
                                </Button>
                                <Button
                                    onClick={() => {
                                        triggerEvaluate()
                                        setOpenConfirm(false)
                                    }}
                                >
                                    Evaluate
                                </Button>
                            </Flex>
                        </Modal>
                    </Flex>
                    <Grid numItems={2} className="gap-4 mb-4">
                        <Card>
                            <Flex alignItems="start" className="mb-10">
                                <Flex
                                    flexDirection="col"
                                    alignItems="start"
                                    className="gap-1"
                                >
                                    <Flex className="w-fit gap-1 group relative">
                                        <Text className="font-semibold">
                                            Security score
                                        </Text>
                                        <InformationCircleIcon className="w-4" />
                                        <div className="absolute w-full z-40 top-0 left-full scale-0 transition-all rounded p-2 shadow-md bg-white group-hover:scale-100">
                                            <Text>
                                                {benchmarkDetail?.description}
                                            </Text>
                                        </div>
                                    </Flex>
                                    <Title className="font-semibold">
                                        {`${(
                                            ((benchmarkDetail
                                                ?.controlsSeverityStatus?.total
                                                ?.passed || 0) /
                                                (benchmarkDetail
                                                    ?.controlsSeverityStatus
                                                    ?.total?.total || 1)) *
                                                100 || 0
                                        ).toFixed(2)}%`}
                                    </Title>
                                </Flex>
                                <Flex
                                    flexDirection="col"
                                    alignItems="start"
                                    className="w-80 gap-1"
                                >
                                    <Flex className="w-fit gap-1.5">
                                        <CheckCircleIcon className="h-4 text-emerald-500" />
                                        <Text>
                                            Passed resources:{' '}
                                            {numberDisplay(
                                                benchmarkDetail
                                                    ?.conformanceStatusSummary
                                                    ?.okCount || 0,
                                                0
                                            )}
                                        </Text>
                                    </Flex>
                                    <Flex className="w-fit gap-1.5">
                                        <XCircleIcon className="h-4 text-rose-600" />
                                        <Text>
                                            Failed resources:{' '}
                                            {numberDisplay(
                                                benchmarkChecks(benchmarkDetail)
                                                    .total -
                                                    (benchmarkDetail
                                                        ?.conformanceStatusSummary
                                                        ?.okCount || 0),
                                                0
                                            )}
                                        </Text>
                                    </Flex>
                                </Flex>
                            </Flex>
                            <SeverityBar benchmark={benchmarkDetail} />
                        </Card>
                        <Card>
                            <Flex justifyContent="between" className="mb-3">
                                <button
                                    type="button"
                                    onClick={() => setOpenTop(true)}
                                >
                                    <Flex className="gap-1.5">
                                        <Title className="font-semibold">
                                            Top
                                        </Title>
                                        <ChevronRightIcon className="h-4 text-kaytu-500" />
                                    </Flex>
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
                                        <Tab
                                            onClick={() => setType('controls')}
                                        >
                                            Controls
                                        </Tab>
                                        <Tab
                                            onClick={() => setType('services')}
                                        >
                                            Resource types
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
