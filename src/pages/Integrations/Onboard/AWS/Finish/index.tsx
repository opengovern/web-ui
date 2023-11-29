import { Button, Flex, Bold, Text, Badge } from '@tremor/react'
import {
    GridOptions,
    ICellRendererParams,
    ValueFormatterParams,
} from 'ag-grid-community'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../../api/onboard.gen'
import Table, { IColumn } from '../../../../../components/Table'

interface IFinish {
    onClose: () => void
}

const columns: IColumn<any, any>[] = [
    {
        field: 'providerConnectionName',
        headerName: 'Name',
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        cellRenderer: (param: ValueFormatterParams) => (
            <span>{param.value}</span>
        ),
    },
    {
        field: 'providerConnectionID',
        headerName: 'ID',
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        cellRenderer: (param: ValueFormatterParams) => (
            <span>{param.value}</span>
        ),
    },
    {
        headerName: 'Account Type',
        field: 'type',
        type: 'string',
        rowGroup: true,
        enableRowGroup: true,
        sortable: true,
        hide: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'id',
        type: 'string',
        headerName: 'Kaytu Connection ID',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
    },
    {
        field: 'onboardDate',
        type: 'date',
        headerName: 'Onboard Date',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
    },
]

export function Finish({ onClose }: IFinish) {
    const { response, isLoading, error } =
        useOnboardApiV1ConnectionsSummaryList({ connector: ['AWS'] })

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
        autoGroupColumnDef: {
            headerName: 'Account Type',
            flex: 2,
            sortable: true,
            filter: true,
            resizable: true,
            // cellRendererParams: {
            //     suppressCount: true,
            // },
        },
    }

    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" alignItems="start" className="h-full">
                <Bold className="my-6">Finished!</Bold>
                <Flex
                    flexDirection="col"
                    justifyContent="start"
                    alignItems="start"
                    className="h-full"
                >
                    <Text className="mb-2">
                        Here&apos;s all the AWS accounts which have been
                        onboarded to Kaytu
                    </Text>
                    <Table
                        id="aws_account_list"
                        options={options}
                        rowData={response?.connections}
                        columns={columns}
                        loading={isLoading}
                        fullHeight
                    />
                </Flex>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={() => onClose()}>
                    Close
                </Button>
            </Flex>
        </Flex>
    )
}
