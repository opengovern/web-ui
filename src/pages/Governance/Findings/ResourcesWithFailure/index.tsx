import { IServerSideGetRowsParams } from 'ag-grid-community/dist/lib/interfaces/iServerSideDatasource'
import { Flex } from '@tremor/react'
import { RowClickedEvent } from 'ag-grid-community'
import { useMemo, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai/index'
import {
    Api,
    GithubComKaytuIoKaytuEnginePkgComplianceApiFinding,
    SourceType,
} from '../../../../api/api'
import AxiosAPI from '../../../../api/ApiConfig'
import { isDemoAtom, notificationAtom } from '../../../../store'
import FindingFilters from '../FindingsWithFailure/Filters'
import Table from '../../../../components/Table'
import FindingDetail from '../FindingsWithFailure/Detail'
import { columns } from '../FindingsWithFailure'

let sortKey = ''

export default function ResourcesWithFailure() {
    const setNotification = useSetAtom(notificationAtom)

    const [open, setOpen] = useState(false)
    const [finding, setFinding] = useState<
        GithubComKaytuIoKaytuEnginePkgComplianceApiFinding | undefined
    >(undefined)

    const isDemo = useAtomValue(isDemoAtom)

    const [providerFilter, setProviderFilter] = useState<SourceType[]>([])
    const [connectionFilter, setConnectionFilter] = useState<string[]>([])
    const [benchmarkFilter, setBenchmarkFilter] = useState<string[]>([])
    const [resourceFilter, setResourceFilter] = useState<string[]>([])
    const [severityFilter, setSeverityFilter] = useState([
        'critical',
        'high',
        'medium',
        'low',
        'none',
    ])
    const [statusFilter, setStatusFilter] = useState([
        'alarm',
        'info',
        'skip',
        'error',
    ])
    const ssr = () => {
        return {
            getRows: (params: IServerSideGetRowsParams) => {
                if (params.request.sortModel.length) {
                    sortKey = ''
                }
                const api = new Api()
                api.instance = AxiosAPI
                api.compliance
                    .apiV1ResourceFindingsCreate({
                        filters: {
                            connector: providerFilter,
                            connectionID: connectionFilter,
                            benchmarkID: benchmarkFilter,
                            resourceTypeID: resourceFilter,
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            severity: severityFilter,
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            conformanceStatus: statusFilter,
                        },

                        sort: params.request.sortModel.length
                            ? [
                                  {
                                      [params.request.sortModel[0].colId]:
                                          params.request.sortModel[0].sort,
                                  },
                              ]
                            : [],
                        limit: 100,
                        afterSortKey:
                            params.request.startRow === 0 ||
                            sortKey.length < 1 ||
                            sortKey === 'none'
                                ? []
                                : [sortKey],
                    })
                    .then((resp) => {
                        params.success({
                            rowData: resp.data.resourceFindings || [],
                            rowCount: resp.data.totalCount || 0,
                        })
                        // eslint-disable-next-line prefer-destructuring
                        sortKey =
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            // eslint-disable-next-line no-unsafe-optional-chaining
                            resp.data.resourceFindings[
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                // eslint-disable-next-line no-unsafe-optional-chaining
                                resp.data.resourceFindings?.length - 1
                            ].sortKey[0]
                    })
                    .catch((err) => {
                        params.fail()
                    })
            },
        }
    }

    const serverSideRows = useMemo(
        () => ssr(),
        [
            providerFilter,
            statusFilter,
            connectionFilter,
            benchmarkFilter,
            resourceFilter,
            severityFilter,
        ]
    )

    return (
        <Flex alignItems="start">
            <FindingFilters
                providerFilter={providerFilter}
                statusFilter={statusFilter}
                connectionFilter={connectionFilter}
                benchmarkFilter={benchmarkFilter}
                resourceFilter={resourceFilter}
                severityFilter={severityFilter}
                onApply={(obj) => {
                    setProviderFilter(obj.provider)
                    setStatusFilter(obj.status)
                    setConnectionFilter(obj.connection)
                    setBenchmarkFilter(obj.connection)
                    setResourceFilter(obj.resource)
                    setSeverityFilter(obj.severity)
                }}
            />
            <Flex className="pl-4">
                <Table
                    fullWidth
                    id="compliance_findings"
                    columns={columns(isDemo)}
                    onCellClicked={(event: RowClickedEvent) => {
                        if (
                            event.data.kaytuResourceID &&
                            event.data.kaytuResourceID.length > 0
                        ) {
                            setFinding(event.data)
                            setOpen(true)
                        } else {
                            setNotification({
                                text: 'Detail for this finding is currently not available',
                                type: 'warning',
                            })
                        }
                    }}
                    serverSideDatasource={serverSideRows}
                    options={{
                        rowModelType: 'serverSide',
                        serverSideDatasource: serverSideRows,
                    }}
                />
                <FindingDetail
                    finding={finding}
                    open={open}
                    onClose={() => setOpen(false)}
                />
            </Flex>
        </Flex>
    )
}
