import { Link, useParams } from 'react-router-dom'
import { useAtomValue, useSetAtom } from 'jotai'
import { GridOptions, ValueFormatterParams } from 'ag-grid-community'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import {
    Button,
    Callout,
    Card,
    Col,
    Flex,
    Grid,
    Select,
    SelectItem,
    Tab,
    TabGroup,
    TabList,
    Text,
    Title,
    Badge,
    Metric,
    Icon,
    Subtitle,
} from '@tremor/react'
import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs'
import {
    DocumentDuplicateIcon,
    DocumentTextIcon,
    CommandLineIcon,
    Square2StackIcon,
    ClockIcon,
    CodeBracketIcon,
    Cog8ToothIcon,
    BookOpenIcon,
} from '@heroicons/react/24/outline'
import clipboardCopy from 'clipboard-copy'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { isDemoAtom, notificationAtom, queryAtom } from '../../../store'
import { dateDisplay } from '../../../utilities/dateDisplay'
import Table, { IColumn } from '../../../components/Table'
import { snakeCaseToLabel } from '../../../utilities/labelMaker'
import InsightTablePanel from './InsightTablePanel'
import {
    useComplianceApiV1InsightDetail,
    useComplianceApiV1InsightTrendDetail,
} from '../../../api/compliance.gen'
import Spinner from '../../../components/Spinner'
import Modal from '../../../components/Modal'
import TopHeader from '../../../components/Layout/Header'
import {
    defaultTime,
    useFilterState,
    useUrlDateRangeState,
} from '../../../utilities/urlstate'
import MetricCard from '../../../components/Cards/MetricCard'
import SummaryCard from '../../../components/Cards/SummaryCard'
import EaseOfSolutionChart from '../../../components/EaseOfSolutionChart'

export const chartData = (inputData: any) => {
    const label = []
    const data = []
    if (inputData && inputData.length) {
        for (let i = 0; i < inputData?.length; i += 1) {
            label.push(dateDisplay((inputData[i]?.timestamp || 0) * 1000))
            data.push(inputData[i]?.value)
        }
    }
    return {
        label,
        data,
    }
}

const getTable = (header: any, details: any, isDemo: boolean) => {
    const columns: IColumn<any, any>[] = []
    const row: any[] = []
    if (header && header.length) {
        for (let i = 0; i < header.length; i += 1) {
            columns.push({
                field: header[i],
                headerName: snakeCaseToLabel(header[i]),
                type: 'string',
                sortable: true,
                resizable: true,
                filter: true,
                flex: 1,
                cellRenderer: (param: ValueFormatterParams) => (
                    <span className={isDemo ? 'blur-sm' : ''}>
                        {param.value}
                    </span>
                ),
            })
        }
    }
    if (details) {
        const { rows, headers } = details
        if (rows && rows.length) {
            for (let i = 0; i < rows.length; i += 1) {
                const object = Object.fromEntries(
                    headers.map((key: any, index: any) => [
                        key,
                        typeof rows[i][index] === 'string'
                            ? rows[i][index]
                            : JSON.stringify(rows[i][index]),
                    ])
                )
                row.push({ id: i, ...object })
            }
        }
    }
    return {
        columns,
        row,
    }
}

const gridOptions: GridOptions = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sideBar: {
        toolPanels: [
            {
                id: 'columns',
                labelDefault: 'Columns',
                labelKey: 'columns',
                iconKey: 'columns',
                toolPanel: 'agColumnsToolPanel',
            },
            {
                id: 'uniqueCount',
                labelDefault: 'Unique Counts',
                labelKey: 'uniqueCount',
                toolPanel: InsightTablePanel,
            },
        ],
        defaultToolPanel: '',
    },
}

export default function ScoreDetails() {
    const { id, ws } = useParams()

    const { value: activeTimeRange } = useUrlDateRangeState(defaultTime)
    const { value: selectedConnections } = useFilterState()
    const [detailsDate, setDetailsDate] = useState<string>('')
    const [selectedChart, setSelectedChart] = useState<'line' | 'bar'>('line')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const isDemo = useAtomValue(isDemoAtom)

    useEffect(() => {
        if (selectedIndex === 0) setSelectedChart('line')
        if (selectedIndex === 1) setSelectedChart('bar')
    }, [selectedIndex])

    const [modalData, setModalData] = useState('')
    const setNotification = useSetAtom(notificationAtom)
    const setQuery = useSetAtom(queryAtom)

    const start = () => {
        if (detailsDate === '') {
            return activeTimeRange.start
        }
        const d = new Date(0)
        d.setUTCSeconds(parseInt(detailsDate, 10) - 1)
        return dayjs.utc(d)
    }
    const end = () => {
        if (detailsDate === '') {
            return activeTimeRange.end || activeTimeRange.start
        }
        const d = new Date(0)
        d.setUTCSeconds(parseInt(detailsDate, 10) + 1)
        return dayjs.utc(d)
    }

    const query = {
        ...(selectedConnections.provider && {
            connector: [selectedConnections.provider],
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(selectedConnections.connectionGroup && {
            connectionGroup: selectedConnections.connectionGroup,
        }),
        ...(activeTimeRange.start && {
            startTime: activeTimeRange.start.unix(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix(),
        }),
    }

    const detailsQuery = {
        ...(selectedConnections.provider && {
            connector: [selectedConnections.provider],
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(selectedConnections.connectionGroup && {
            connectionGroup: selectedConnections.connectionGroup,
        }),
        ...(activeTimeRange.start && {
            startTime: start().unix(),
            endTime: end().unix(),
        }),
    }

    const { response: insightTrend, isLoading: trendLoading } =
        useComplianceApiV1InsightTrendDetail(String(id), query)
    const { response: insightDetail, isLoading: detailLoading } =
        useComplianceApiV1InsightDetail(String(id), detailsQuery)

    const columns =
        insightDetail?.result && insightDetail?.result[0]?.details
            ? insightDetail?.result[0].details.headers
            : []
    const rows = insightDetail?.result
        ? insightDetail?.result[0].details
        : undefined

    const trendDates = () => {
        return (
            insightTrend?.map((item) => {
                const dt = item.timestamp || 0
                const d = new Date(0)
                d.setUTCSeconds(dt)
                return (
                    <SelectItem value={dt.toString()}>
                        {d.toLocaleString()}
                    </SelectItem>
                )
            }) || []
        )
    }

    const severityBadge = (severity: any) => {
        const style = {
            color: '#fff',
            borderRadius: '8px',
            width: '64px',
        }
        if (severity) {
            if (severity === 'critical') {
                return (
                    <Badge style={{ backgroundColor: '#6E120B', ...style }}>
                        Critical
                    </Badge>
                )
            }
            if (severity === 'high') {
                return (
                    <Badge style={{ backgroundColor: '#CA2B1D', ...style }}>
                        High
                    </Badge>
                )
            }
            if (severity === 'medium') {
                return (
                    <Badge style={{ backgroundColor: '#EE9235', ...style }}>
                        Medium
                    </Badge>
                )
            }
            if (severity === 'low') {
                return (
                    <Badge style={{ backgroundColor: '#F4C744', ...style }}>
                        Low
                    </Badge>
                )
            }
            if (severity === 'none') {
                return (
                    <Badge style={{ backgroundColor: '#9BA2AE', ...style }}>
                        None
                    </Badge>
                )
            }
            return (
                <Badge style={{ backgroundColor: '#54B584', ...style }}>
                    Passed
                </Badge>
            )
        }
        return (
            <Badge style={{ backgroundColor: '#9BA2AE', ...style }}>None</Badge>
        )
    }

    return (
        <>
            <TopHeader
                breadCrumb={[
                    insightDetail ? insightDetail?.shortTitle : 'Score detail',
                ]}
            />
            {trendLoading || detailLoading ? (
                <Flex justifyContent="center" className="mt-56">
                    <Spinner />
                </Flex>
            ) : (
                <>
                    <Flex flexDirection="col" className="mb-8 mt-4 gap-4">
                        <Flex justifyContent="start" className="gap-4">
                            <Metric className="font-semibold whitespace-nowrap">
                                VPC flow logs should be enabled
                            </Metric>
                            {severityBadge('medium')}
                        </Flex>
                        <Flex
                            justifyContent="start"
                            alignItems="start"
                            className="gap-10"
                        >
                            <Flex
                                flexDirection="col"
                                alignItems="start"
                                className="gap-6 w-full "
                            >
                                <Subtitle className="text-gray-500">
                                    The VPC flow logs provide detailed records
                                    for information about the IP traffic going
                                    to and from network interfaces in your
                                    Amazon Virtual Private Cloud
                                </Subtitle>

                                <Flex justifyContent="start" className="gap-4">
                                    <Button
                                        icon={DocumentTextIcon}
                                        variant="light"
                                    >
                                        Show Explanation
                                    </Button>
                                    <div className="border-l h-4 border-gray-300" />
                                    <Button
                                        icon={CommandLineIcon}
                                        variant="light"
                                        onClick={() =>
                                            setModalData(
                                                insightDetail?.query?.queryToExecute?.replace(
                                                    '$IS_ALL_CONNECTIONS_QUERY',
                                                    'true'
                                                ) || ''
                                            )
                                        }
                                    >
                                        Show Query
                                    </Button>
                                </Flex>
                            </Flex>

                            <Flex
                                flexDirection="col"
                                alignItems="end"
                                justifyContent="start"
                                className="w-fit gap-2"
                            >
                                <Badge
                                    icon={Square2StackIcon}
                                    color="gray"
                                    className="hover:cursor-pointer"
                                >
                                    Control ID : aws_vpc_flow_logs_enabled
                                </Badge>
                                <Badge icon={ClockIcon} color="gray">
                                    Last updated : Feb 25, 2024 10:49 UTC
                                </Badge>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Modal
                        open={!!modalData.length}
                        onClose={() => setModalData('')}
                    >
                        <Title className="font-semibold">Insight query</Title>
                        <Card className="my-4">
                            <Editor
                                onValueChange={() => console.log('')}
                                highlight={(text) =>
                                    highlight(text, languages.sql, 'sql')
                                }
                                value={modalData}
                                className="w-full bg-white dark:bg-gray-900 dark:text-gray-50 font-mono text-sm"
                                style={{
                                    minHeight: '200px',
                                }}
                                placeholder="-- write your SQL query here"
                            />
                        </Card>
                        <Flex>
                            <Button
                                variant="light"
                                icon={DocumentDuplicateIcon}
                                iconPosition="left"
                                onClick={() =>
                                    clipboardCopy(modalData).then(() =>
                                        setNotification({
                                            text: 'Query copied to clipboard',
                                            type: 'info',
                                        })
                                    )
                                }
                            >
                                Copy
                            </Button>
                            <Flex className="w-fit gap-4">
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setQuery(modalData)
                                    }}
                                >
                                    <Link to={`/${ws}/query`}>
                                        Open in Query
                                    </Link>
                                </Button>
                                <Button onClick={() => setModalData('')}>
                                    Close
                                </Button>
                            </Flex>
                        </Flex>
                    </Modal>
                    <Flex justifyContent="start" className="w-full mb-8 gap-6">
                        <SummaryCard
                            title="Estimated Saving Opportunities "
                            metric={1200}
                            isPrice
                        />
                        <SummaryCard
                            title="Virtual Networks (VPC’s)"
                            metric={96}
                        />
                        <SummaryCard title="AWS Accounts" metric={7} />
                    </Flex>

                    <Card className="mb-8 p-8">
                        <Flex
                            justifyContent="start"
                            alignItems="start"
                            className="gap-12"
                        >
                            <Flex
                                className="w-1/3 h-full"
                                justifyContent="start"
                            >
                                <EaseOfSolutionChart
                                    scalability="medium"
                                    complexity="hard"
                                    disruptivity="easy"
                                />
                            </Flex>

                            <Flex
                                flexDirection="col"
                                alignItems="start"
                                justifyContent="start"
                                className="h-full w-2/3"
                            >
                                {/*  <DrawerPanel
                                    title={docTitle}
                                    open={doc.length > 0}
                                    onClose={() => setDoc('')}
                                >
                                    <MarkdownPreview
                                        source={doc}
                                        className="!bg-transparent"
                                        wrapperElement={{
                                            'data-color-mode': 'light',
                                        }}
                                        rehypeRewrite={(
                                            node,
                                            index,
                                            parent
                                        ) => {
                                            if (
                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                // @ts-ignore
                                                node.tagName === 'a' &&
                                                parent &&
                                                /^h(1|2|3|4|5|6)/.test(
                                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                    // @ts-ignore
                                                    parent.tagName
                                                )
                                            ) {
                                                // eslint-disable-next-line no-param-reassign
                                                parent.children =
                                                    parent.children.slice(1)
                                            }
                                        }}
                                    />
                                </DrawerPanel> */}
                                <Text className="font-bold mb-4 text-gray-400">
                                    Remediation
                                </Text>
                                <Flex className="rounded-lg border border-gray-100 relative">
                                    <Grid
                                        numItems={2}
                                        className="w-full h-full"
                                    >
                                        <Flex
                                            className="cursor-pointer px-6 py-4 h-full gap-3 "
                                            flexDirection="col"
                                            justifyContent="start"
                                            alignItems="start"

                                            /* onClick={() => {
                                            if (
                                                controlDetail?.control
                                                    ?.manualRemediation &&
                                                controlDetail?.control
                                                    ?.manualRemediation.length
                                            ) {
                                                setDoc(
                                                    controlDetail?.control
                                                        ?.manualRemediation
                                                )
                                                setDocTitle(
                                                    'Manual remediation'
                                                )
                                            }
                                        }} */
                                        >
                                            <Flex>
                                                <Flex
                                                    justifyContent="start"
                                                    className="w-fit gap-3"
                                                >
                                                    <Icon
                                                        icon={BookOpenIcon}
                                                        className="p-0 text-gray-900"
                                                    />
                                                    <Title className="font-semibold">
                                                        Manual
                                                    </Title>
                                                </Flex>
                                                <ChevronRightIcon className="w-5 text-kaytu-500" />
                                            </Flex>
                                            <Text>
                                                Step by Step Guided solution to
                                                resolve instances of
                                                non-compliance
                                            </Text>
                                        </Flex>
                                        <Flex
                                            className="cursor-pointer px-6 py-4 h-full gap-3 "
                                            flexDirection="col"
                                            justifyContent="start"
                                            alignItems="start"

                                            /* onClick={() => {
                                            if (
                                                controlDetail?.control
                                                    ?.cliRemediation &&
                                                controlDetail?.control
                                                    ?.cliRemediation.length
                                            ) {
                                                setDoc(
                                                    controlDetail?.control
                                                        ?.cliRemediation
                                                )
                                                setDocTitle(
                                                    'Command line (CLI) remediation'
                                                )
                                            }
                                        }} */
                                        >
                                            <Flex>
                                                <Flex
                                                    justifyContent="start"
                                                    className="w-fit gap-3"
                                                >
                                                    <Icon
                                                        icon={CommandLineIcon}
                                                        className="p-0 text-gray-900"
                                                    />
                                                    <Title className="font-semibold">
                                                        Command line (CLI)
                                                    </Title>
                                                </Flex>
                                                <ChevronRightIcon className="w-5 text-kaytu-500" />
                                            </Flex>
                                            <Text>
                                                Guided steps to resolve the
                                                issue utilizing CLI
                                            </Text>
                                        </Flex>
                                        <Flex
                                            className="cursor-pointer px-6 py-4 h-full gap-3 "
                                            flexDirection="col"
                                            justifyContent="start"
                                            alignItems="start"

                                            /* onClick={() => {
                                            if (
                                                controlDetail?.control
                                                    ?.guardrailRemediation &&
                                                controlDetail?.control
                                                    ?.guardrailRemediation
                                                    .length
                                            ) {
                                                setDoc(
                                                    controlDetail?.control
                                                        ?.guardrailRemediation
                                                )
                                                setDocTitle(
                                                    'Guard rails remediation'
                                                )
                                            }
                                        }} */
                                        >
                                            <Flex>
                                                <Flex
                                                    justifyContent="start"
                                                    className="w-fit gap-3"
                                                >
                                                    <Icon
                                                        icon={Cog8ToothIcon}
                                                        className="p-0 text-gray-900"
                                                    />
                                                    <Title className="font-semibold">
                                                        Guard rails
                                                    </Title>
                                                </Flex>
                                                <ChevronRightIcon className="w-5 text-kaytu-500" />
                                            </Flex>
                                            <Text>
                                                Resolve and ensure compliance,
                                                at scale utilizing solutions
                                                where possible
                                            </Text>
                                        </Flex>
                                        <Flex
                                            className={
                                                /* controlDetail?.control
                                                ?.programmaticRemediation &&
                                            controlDetail?.control
                                                ?.programmaticRemediation.length
                                                ? 'cursor-pointer'
                                                : */ 'grayscale opacity-70 px-6 py-4 h-full gap-3'
                                            }
                                            flexDirection="col"
                                            justifyContent="start"
                                            alignItems="start"
                                        >
                                            <Flex>
                                                <Flex
                                                    justifyContent="start"
                                                    className="w-fit gap-3"
                                                >
                                                    <Icon
                                                        icon={CodeBracketIcon}
                                                        className="p-0 text-gray-900"
                                                    />
                                                    <Title className="font-semibold">
                                                        Programmatic
                                                    </Title>
                                                </Flex>
                                                <ChevronRightIcon className="w-5 text-kaytu-500" />
                                            </Flex>
                                            <Text>
                                                Scripts that help you resolve
                                                the issue, at scale
                                            </Text>
                                        </Flex>
                                    </Grid>
                                    <div className="border-t border-gray-100 w-full absolute top-1/2" />
                                    <div className="border-l border-gray-100 h-full absolute left-1/2" />
                                </Flex>
                            </Flex>
                        </Flex>
                    </Card>

                    <Card>
                        {detailsDate !== '' && (
                            <Flex
                                flexDirection="row"
                                className="bg-kaytu-50 my-2 rounded-md pr-6"
                            >
                                <Callout
                                    title={`The available data for the result is exclusively limited to ${end().format(
                                        'MMM DD, YYYY'
                                    )}.`}
                                    color="blue"
                                    icon={ExclamationCircleIcon}
                                    className="w-full text-xs leading-5 truncate max-w-full"
                                >
                                    <Flex flexDirection="row">
                                        <Text className="text-kaytu-800">
                                            The following results present you
                                            with a partial result based on the
                                            filter you have selected.
                                        </Text>
                                    </Flex>
                                </Callout>
                                <Button
                                    variant="secondary"
                                    onClick={() => setDetailsDate('')}
                                >
                                    Show all
                                </Button>
                            </Flex>
                        )}
                        <Table
                            title="Results"
                            id="insight_detail"
                            columns={getTable(columns, rows, isDemo).columns}
                            rowData={getTable(columns, rows, isDemo).row}
                            downloadable
                            options={gridOptions}
                            loading={detailLoading}
                        >
                            <Select
                                enableClear={false}
                                className="h-full"
                                onValueChange={setDetailsDate}
                                placeholder={
                                    detailsDate === ''
                                        ? 'Latest'
                                        : end().format('MMM DD, YYYY')
                                }
                            >
                                {trendDates()}
                            </Select>
                        </Table>
                    </Card>
                </>
            )}
        </>
    )
}
