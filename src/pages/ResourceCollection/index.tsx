import { Button, Flex, TextInput } from '@tremor/react'
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ICellRendererParams } from 'ag-grid-community'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import Table, { IColumn } from '../../components/Table'
import {
    useInventoryApiV2MetadataResourceCollectionList,
    useInventoryApiV2ResourceCollectionList,
} from '../../api/inventory.gen'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiPolicySummary } from '../../api/api'
import Tag from '../../components/Tag'

const resourceCollectionColumns: IColumn<any, any>[] = [
    {
        field: 'name',
        headerName: 'Resource name',
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'status',
        headerName: 'Status',
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 0.5,
    },
    {
        field: 'resource_count',
        headerName: 'Resource count',
        type: 'number',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 0.5,
    },
    {
        field: 'tags',
        headerName: 'Tags',
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1.5,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiPolicySummary>
        ) => (
            <Flex
                className="h-full pl-2 gap-1 flex-wrap"
                justifyContent="center"
                alignItems="center"
            >
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                {Object.entries(params.value).map(([name, value]) => (
                    <Tag text={`${name}: ${value}`} />
                ))}
            </Flex>
        ),
    },
    {
        field: 'created_at',
        headerName: 'Creation date',
        type: 'datetime',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
]

export default function ResourceCollection() {
    const navigate = useNavigate()
    const [search, setSearch] = useState('')

    const { response, isLoading } = useInventoryApiV2ResourceCollectionList()

    return (
        <Layout currentPage="resource-collection">
            <Header />
            <Table
                id="resource_collection"
                columns={resourceCollectionColumns}
                rowData={
                    search.length
                        ? response?.filter((r) =>
                              r.name
                                  ?.toLowerCase()
                                  .includes(search.toLowerCase())
                          )
                        : response
                }
                loading={isLoading}
                onRowClicked={(e) => navigate(e.data.id)}
                fullWidth
            >
                <Flex className="w-fit gap-3">
                    <TextInput
                        value={search}
                        className="w-56"
                        onChange={(e) => setSearch(e.target.value)}
                        icon={MagnifyingGlassIcon}
                        placeholder="Search resources..."
                    />
                    {/* <Button icon={PlusIcon}>
                        Create new resource collection
                    </Button> */}
                </Flex>
            </Table>
        </Layout>
    )
}
