import { AgGridReact } from 'ag-grid-react'
import { useRef } from 'react'
import { ColDef, GridOptions, ICellRendererParams } from 'ag-grid-community'
import { Badge, Button, Flex, Title } from '@tremor/react'
import { ArrowDownOnSquareIcon } from '@heroicons/react/20/solid'
import { useComplianceApiV1BenchmarksTreeDetail } from '../../../../../api/compliance.gen'
import 'ag-grid-enterprise'
import { dateDisplay } from '../../../../../utilities/dateDisplay'

interface IPolicies {
    id: string | undefined
}

const rows = (json: any) => {
    let arr: any = []
    let path = ''
    if (json) {
        path += `${json.title}/`
        if (json.policies !== null && json.policies !== undefined) {
            for (let i = 0; i < json.policies.length; i += 1) {
                let obj = {}
                obj = {
                    path: path + json.policies[i].title,
                    ...json.policies[i],
                }
                arr.push(obj)
            }
        }
        if (json.children !== null && json.children !== undefined) {
            for (let i = 0; i < json.children.length; i += 1) {
                const res = rows(json.children[i])
                arr = arr.concat(res)
            }
        }
    }
    if (arr.length) {
        return arr.sort((a: any, b: any) => {
            if (a.path < b.path) {
                return -1
            }
            if (a.path > b.path) {
                return 1
            }
            return 0
        })
    }

    return arr
}

const renderBadge = (severity: any) => {
    if (severity) {
        if (severity === 'low') {
            return <Badge color="lime">Low</Badge>
        }
        if (severity === 'medium') {
            return <Badge color="yellow">Medium</Badge>
        }
        if (severity === 'high') {
            return <Badge color="orange">High</Badge>
        }
        return <Badge color="rose">Critical</Badge>
    }
    return ''
}

const renderStatus = (status: any) => {
    if (status) {
        if (status === 'passed') {
            return <Badge color="emerald">Passed</Badge>
        }
        return <Badge color="rose">Failed</Badge>
    }
    return ''
}

const columns: ColDef[] = [
    {
        field: 'severity',
        width: 120,
        sortable: true,
        filter: true,
        resizable: true,
        cellRenderer: (params: ICellRendererParams) => (
            <Flex
                className="h-full w-full"
                justifyContent="center"
                alignItems="center"
            >
                {renderBadge(params.data?.severity)}
            </Flex>
        ),
    },
    {
        field: 'status',
        width: 100,
        sortable: true,
        filter: true,
        resizable: true,
        cellRenderer: (params: ICellRendererParams) => (
            <Flex
                className="h-full w-full"
                justifyContent="center"
                alignItems="center"
            >
                {renderStatus(params.data?.status)}
            </Flex>
        ),
    },
    {
        field: 'lastChecked',
        width: 120,
        valueFormatter: (param: any) => {
            if (param.value) {
                return dateDisplay(param.value * 1000)
            }
            return ''
        },
    },
]

export default function Policies({ id }: IPolicies) {
    const gridRef = useRef<AgGridReact>(null)

    const { response: policies } = useComplianceApiV1BenchmarksTreeDetail(
        String(id)
    )

    const gridOptions: GridOptions = {
        columnDefs: columns,
        autoGroupColumnDef: {
            headerName: 'Title',
            flex: 2,
            sortable: true,
            filter: true,
            resizable: true,
            cellRendererParams: {
                suppressCount: true,
            },
        },
        treeData: true,
        animateRows: true,
        getDataPath: (data: any) => {
            return data.path.split('/')
        },
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
                    id: 'filters',
                    labelDefault: 'Filters',
                    labelKey: 'filters',
                    iconKey: 'filter',
                    toolPanel: 'agFiltersToolPanel',
                },
            ],
            defaultToolPanel: '',
        },
    }

    return (
        <>
            <Flex className="mb-4">
                <Title>Policies</Title>
                <Button
                    variant="secondary"
                    onClick={() => gridRef?.current?.api.exportDataAsCsv()}
                    icon={ArrowDownOnSquareIcon}
                >
                    Download
                </Button>
            </Flex>
            <div className="ag-theme-alpine w-full">
                <AgGridReact
                    ref={gridRef}
                    domLayout="autoHeight"
                    rowData={rows(policies)}
                    gridOptions={gridOptions}
                />
            </div>
        </>
    )
}
