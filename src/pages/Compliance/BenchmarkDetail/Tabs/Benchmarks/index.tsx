import { AgGridReact } from 'ag-grid-react'
import { useRef } from 'react'
import { GridOptions } from 'ag-grid-community'
import { useComplianceApiV1BenchmarksTreeDetail } from '../../../../../api/compliance.gen'
import 'ag-grid-enterprise'

interface IBenchmarks {
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
        // for (let i = 0; i < arr.length; i += 1) {
        //     if (arr[i].path.includes('.') && arr[i].path[arr[i].path.indexOf('.') + 2])
        // }
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

export default function Benchmarks({ id }: IBenchmarks) {
    const gridRef = useRef<AgGridReact>(null)

    const { response: policies } = useComplianceApiV1BenchmarksTreeDetail(
        String(id),
        { status: ['passed'] }
    )
    const gridOptions: GridOptions = {
        columnDefs: [
            // we're using the auto group column by default!
            { field: 'severity' },
            { field: 'status' },
            { field: 'lastChecked' },
        ],
        defaultColDef: {
            flex: 1,
        },
        autoGroupColumnDef: {
            headerName: 'Title',
            minWidth: 300,
            cellRendererParams: {
                suppressCount: true,
            },
        },
        treeData: true, // enable Tree Data mode
        animateRows: true,
        getDataPath: (data: any) => {
            return data.path.split('/')
        },
    }
    console.log(gridOptions.rowData)
    return (
        <div className="ag-theme-alpine w-full">
            <AgGridReact
                ref={gridRef}
                domLayout="autoHeight"
                rowData={rows(policies)}
                gridOptions={gridOptions}
            />
        </div>
    )
}
