import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    Badge,
    Card,
    Color,
    Flex,
    Text,
    Title,
} from '@tremor/react'
import { GridOptions, ValueFormatterParams } from 'ag-grid-community'
import { Radio } from 'pretty-checkbox-react'
import Table, { IColumn } from '../../../components/Table'
import { useScheduleApiV1JobsList } from '../../../api/schedule.gen'
import {
    GithubComKaytuIoKaytuEnginePkgDescribeApiJob,
    GithubComKaytuIoKaytuEnginePkgDescribeApiJobStatus,
} from '../../../api/api'

const columns = () => {
    const temp: IColumn<any, any>[] = [
        {
            field: 'id',
            headerName: 'Job ID',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
            hide: true,
        },
        {
            field: 'type',
            headerName: 'Job Type',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
        },
        {
            field: 'connectionID',
            headerName: 'Kaytu Connection ID',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
            hide: true,
        },
        {
            field: 'connectionProviderID',
            headerName: 'Account ID',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
            hide: true,
        },
        {
            field: 'connectionProviderName',
            headerName: 'Account Name',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
        },
        {
            field: 'title',
            headerName: 'Title',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
        },
        {
            field: 'status',
            headerName: 'Status',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
            cellRenderer: (
                param: ValueFormatterParams<GithubComKaytuIoKaytuEnginePkgDescribeApiJob>
            ) => {
                let jobStatus = ''
                let jobColor: Color = 'gray'
                switch (param.data?.status) {
                    case GithubComKaytuIoKaytuEnginePkgDescribeApiJobStatus.JobStatusCreated:
                        jobStatus = 'created'
                        break
                    case GithubComKaytuIoKaytuEnginePkgDescribeApiJobStatus.JobStatusQueued:
                        jobStatus = 'queued'
                        break
                    case GithubComKaytuIoKaytuEnginePkgDescribeApiJobStatus.JobStatusInProgress:
                        jobStatus = 'in progress'
                        jobColor = 'orange'
                        break
                    case GithubComKaytuIoKaytuEnginePkgDescribeApiJobStatus.JobStatusSuccessful:
                        jobStatus = 'succeeded'
                        jobColor = 'emerald'
                        break
                    case GithubComKaytuIoKaytuEnginePkgDescribeApiJobStatus.JobStatusFailure:
                        jobStatus = 'failed'
                        jobColor = 'red'
                        break
                    case GithubComKaytuIoKaytuEnginePkgDescribeApiJobStatus.JobStatusTimeout:
                        jobStatus = 'time out'
                        jobColor = 'red'
                        break
                    default:
                        jobStatus = String(param.data?.status)
                }

                return <Badge color={jobColor}>{jobStatus}</Badge>
            },
        },
        {
            field: 'failureReason',
            headerName: 'Failure Reason',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
            hide: true,
        },
    ]
    return temp
}

export default function SettingsJobs() {
    const {
        response: jobs,
        isLoading,
        error,
    } = useScheduleApiV1JobsList({ limit: 5000 })
    const options: GridOptions = {
        enableGroupEdit: true,
        columnTypes: {
            dimension: {
                enableRowGroup: true,
                enablePivot: true,
            },
        },
        rowGroupPanelShow: 'always',
        groupAllowUnbalanced: true,
    }

    return (
        <Card>
            <Title className="font-semibold">Jobs</Title>
            <Table
                id="jobs"
                columns={columns()}
                rowData={jobs?.jobs}
                options={options}
                onGridReady={(e) => {
                    if (isLoading) {
                        e.api.showLoadingOverlay()
                    }
                }}
                loading={isLoading}
            />
        </Card>
    )
}
