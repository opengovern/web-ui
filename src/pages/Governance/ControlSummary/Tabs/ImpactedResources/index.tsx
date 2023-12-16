import { IServerSideGetRowsParams } from 'ag-grid-community/dist/lib/interfaces/iServerSideDatasource'
import { useMemo, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai/index'
import { RowClickedEvent } from 'ag-grid-community'
import Table from '../../../../../components/Table'
import FindingDetail from '../../../Findings/Detail'
import { columns } from '../../../Findings'
import { isDemoAtom, notificationAtom } from '../../../../../store'
import {
    Api,
    GithubComKaytuIoKaytuEnginePkgComplianceApiFinding,
} from '../../../../../api/api'
import AxiosAPI from '../../../../../api/ApiConfig'

let sortKey = ''

interface IImpactedResources {
    controlId: string | undefined
}
export default function ImpactedResources({ controlId }: IImpactedResources) {
    const isDemo = useAtomValue(isDemoAtom)
    const setNotification = useSetAtom(notificationAtom)

    const [open, setOpen] = useState(false)
    const [finding, setFinding] = useState<
        GithubComKaytuIoKaytuEnginePkgComplianceApiFinding | undefined
    >(undefined)

    const ssr = () => {
        return {
            getRows: (params: IServerSideGetRowsParams) => {
                if (params.request.sortModel.length) {
                    sortKey = ''
                }
                const api = new Api()
                api.instance = AxiosAPI
                api.compliance
                    .apiV1FindingsCreate({
                        filters: {
                            controlID: [controlId || ''],
                        },
                        sort: params.request.sortModel.length
                            ? {
                                  [params.request.sortModel[0].colId]:
                                      params.request.sortModel[0].sort,
                              }
                            : {},
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
                            rowData: resp.data.findings || [],
                            rowCount: resp.data.totalCount || 0,
                        })
                        // eslint-disable-next-line prefer-destructuring
                        sortKey =
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            // eslint-disable-next-line no-unsafe-optional-chaining
                            resp.data.findings[resp.data.findings?.length - 1]
                                .sortKey[0]
                    })
                    .catch((err) => {
                        params.fail()
                    })
            },
        }
    }

    const serverSideRows = useMemo(() => ssr(), [])

    return (
        <>
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
        </>
    )
}
