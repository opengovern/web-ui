import { Fragment, useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import {
    ArrowRightIcon,
    ClipboardDocumentListIcon,
    CommandLineIcon,
    DocumentDuplicateIcon,
} from '@heroicons/react/24/outline'
import {
    BadgeDelta,
    Button,
    Card,
    Flex,
    Legend,
    Text,
    Title,
} from '@tremor/react'
import { GridOptions, ValueFormatterParams } from 'ag-grid-community'
import DrawerPanel from '../../DrawerPanel'
import Table, { IColumn } from '../../Table'

const jobs = [
    {
        jobID: 123,
        type: 'Discovery',
        accountName: 'account-1234',
        title: 'AWS::EC2::Instances',
    },
    {
        jobID: 123,
        type: 'Insight',
        accountName: 'all',
        title: 'Snapshots older than a year',
    },
    {
        jobID: 123,
        type: 'Compliance',
        accountName: 'all',
        title: 'AWS CIS v2.0.0',
    },
]

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
            field: 'account_id',
            headerName: 'Account ID',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
            hide: true,
        },
        {
            field: 'account_name',
            headerName: 'Account Name',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
            hide: true,
        },
        {
            field: 'title',
            headerName: 'Title',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
            hide: true,
        },
        {
            field: 'status',
            headerName: 'Status',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
            valueFormatter: (param: ValueFormatterParams) => {
                return `${param.value ? Number(param.value).toFixed(2) : '0'}%`
            },
        },
    ]
    return temp
}

export default function JobsMenu() {
    const [open, setOpen] = useState<boolean>(false)

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
        <>
            <Popover className="relative isolate z-50 border-0">
                <Popover.Button
                    className="-mx-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                    id="Jobs"
                >
                    <span className="sr-only">Jobs</span>
                    <Legend
                        categories={['Jobs in progress']}
                        colors={['red']}
                        className="mt-3"
                    />
                    {/* <ClipboardDocumentListIcon className="h-6 w-6" /> */}
                </Popover.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                >
                    <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                        <Card>
                            <Title>Running Jobs</Title>
                            {/* <Table className="mt-6">
                                <TableHead>
                                    <TableRow>
                                        <TableHeaderCell>
                                            Job Type
                                        </TableHeaderCell>
                                        <TableHeaderCell>
                                            Account Name
                                        </TableHeaderCell>
                                        <TableHeaderCell>Title</TableHeaderCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {jobs.map((item) => (
                                        <TableRow key={item.jobID}>
                                            <TableCell>{item.type}</TableCell>
                                            <TableCell>
                                                {item.accountName}
                                            </TableCell>
                                            <TableCell>{item.title}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table> */}
                            <Flex className="mt-6 pt-4 border-t">
                                <Button
                                    size="xs"
                                    variant="light"
                                    icon={ArrowRightIcon}
                                    iconPosition="right"
                                >
                                    View more
                                </Button>
                            </Flex>
                        </Card>
                    </Popover.Panel>
                </Transition>
            </Popover>
            <DrawerPanel
                title="Jobs"
                open={open}
                onClose={() => setOpen(false)}
            >
                <Table
                    title="Jobs"
                    downloadable
                    id="jobs"
                    columns={columns()}
                    // rowData={rowGenerator(findings) || []}
                    options={options}
                    // onGridReady={(e) => {
                    //     if (isLoading) {
                    //         e.api.showLoadingOverlay()
                    //     }
                    // }}
                    // loading={isLoading}
                />
            </DrawerPanel>
        </>
    )
}
