import { Button, Flex, Text } from '@tremor/react'
import { useState } from 'react'
import { useAtomValue } from 'jotai'
import {
    GridOptions,
    ICellRendererParams,
    RowClickedEvent,
} from 'ag-grid-community'
import { useNavigate } from 'react-router-dom'
import Menu from '../../../components/Menu'
import { useComplianceApiV1InsightList } from '../../../api/compliance.gen'
import { timeAtom } from '../../../store'
import Spinner from '../../../components/Spinner'
import Header from '../../../components/Header'
import Table, { IColumn } from '../../../components/Table'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiInsight } from '../../../api/api'
import { badgeDelta } from '../../../utilities/deltaType'
import Notification from '../../../components/Notification'
import { dateDisplay } from '../../../utilities/dateDisplay'
import { rowGenerator } from '../../Assets/Details/ResourceMetricsDetails'

const columns: IColumn<any, any>[] = [
    {
        headerName: 'Connector',
        field: 'connector',
        type: 'string',
        width: 120,
        enableRowGroup: true,
    },
    {
        headerName: 'Insight',
        type: 'string',
        sortable: false,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiInsight>
        ) =>
            params.data?.connector && (
                <Flex flexDirection="col" alignItems="start">
                    <Text className="text-gray-800 mb-0.5">
                        {params.data?.shortTitle}
                    </Text>
                    <Text>{params.data?.longTitle}</Text>
                </Flex>
            ),
    },
    {
        field: 'category',
        rowGroup: true,
        enableRowGroup: true,
        headerName: 'Category',
        type: 'string',
        hide: true,
        width: 190,
    },
    {
        field: 'totalResultValue',
        headerName: 'Count',
        type: 'number',
        width: 100,
    },
    {
        field: 'oldTotalResultValue',
        headerName: 'Previous Count',
        type: 'number',
        width: 140,
    },
    {
        headerName: 'Growth',
        type: 'string',
        width: 100,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiInsight>
        ) =>
            params.data?.connector && (
                <Flex justifyContent="center" className="h-full">
                    {params.data?.oldTotalResultValue
                        ? badgeDelta(
                              params.data?.oldTotalResultValue,
                              params.data?.totalResultValue
                          )
                        : badgeDelta(1, 2)}
                </Flex>
            ),
    },
]

export default function InsightList() {
    const [selectedProvider, setSelectedProvider] = useState<string[]>([])
    const [selectedPersona, setSelectedPersona] = useState<string[]>([])
    const [notification, setNotification] = useState('')

    const navigate = useNavigate()
    const navigateToAssetsInsightsDetails = (id: number | undefined) => {
        navigate(`${id}`)
    }
    const activeTimeRange = useAtomValue(timeAtom)

    const query = {
        ...(activeTimeRange.start && {
            startTime: activeTimeRange.start.unix(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix(),
        }),
    }

    const options: GridOptions = {
        enableGroupEdit: true,
        columnTypes: {
            dimension: {
                enableRowGroup: true,
                enablePivot: true,
            },
        },
        // groupDefaultExpanded: -1,
        rowGroupPanelShow: 'always',
        groupAllowUnbalanced: true,
        onRowClicked: (event: RowClickedEvent) => {
            if (
                event.data?.totalResultValue ||
                event.data?.oldTotalResultValue
            ) {
                navigateToAssetsInsightsDetails(event.data?.id)
                return ''
            }
            if (
                !event.data?.totalResultValue &&
                !event.data?.oldTotalResultValue
            ) {
                setNotification('Time period is not covered by insight')
            } else if (!event.data?.totalResultValue) {
                setNotification('End value is not available')
            } else if (!event.data?.oldTotalResultValue) {
                setNotification(
                    `Data is available after ${dateDisplay(
                        event.data.firstOldResultDate
                    )}`
                )
            }
            alert(notification)
            return notification
        },
        isRowSelectable: (param) =>
            param.data?.totalResultValue || param.data?.oldTotalResultValue,
    }

    const {
        response: insightList,
        isLoading: listLoading,
        sendNow: insightSendNow,
        error: insightError,
    } = useComplianceApiV1InsightList(query)

    return (
        <Menu currentPage="insight">
            <Header title="Insight List" datePicker filter />
            <Notification text={notification} />
            <Flex className="gap-6" alignItems="start">
                {/* <Filters
                    onProviderChange={(p) => setSelectedProvider(p)}
                    onPersonaChange={(p) => setSelectedPersona(p)}
                /> */}
                {/* eslint-disable-next-line no-nested-ternary */}
                {listLoading ? (
                    <Flex justifyContent="center" className="mt-56">
                        <Spinner />
                    </Flex>
                ) : insightError === undefined ? (
                    <Table
                        id="insight_list"
                        columns={columns}
                        rowData={rowGenerator(insightList)}
                        options={options}
                    />
                ) : (
                    /* <Grid numItems={3} className="w-full gap-4">
{insightList
?.sort(
(a, b) =>
(b.totalResultValue || 0) -
(a.totalResultValue || 0)
)
.filter((insight) => {
if (selectedProvider.length) {
    for (
      let i = 0;
      i < selectedProvider.length;
      i += 1
    ) {
        if (
          insight.connector?.includes(
            selectedProvider[i]
          )
        ) {
            return insight
        }
    }
    return null
}
return insight
})
.map((insight) => (
<InsightCard metric={insight} />
))}
</Grid> */
                    <Button onClick={() => insightSendNow()}>Retry</Button>
                )}
            </Flex>
        </Menu>
    )
}
