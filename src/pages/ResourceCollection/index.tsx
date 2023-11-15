import { Button, Flex, TextInput } from '@tremor/react'
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import Table, { IColumn } from '../../components/Table'
import { useInventoryApiV2MetadataResourceCollectionList } from '../../api/inventory.gen'

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
        field: 'created_at',
        headerName: 'Creation date',
        type: 'date',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: '',
        headerName: 'Tags',
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
        flex: 1,
    },
]

export default function ResourceCollection() {
    const navigate = useNavigate()

    const { response, isLoading } =
        useInventoryApiV2MetadataResourceCollectionList()

    return (
        <Layout currentPage="resource-collection">
            <Header />
            <Table
                id="resource_collection"
                columns={resourceCollectionColumns}
                rowData={response}
                loading={isLoading}
                onRowClicked={(e) => navigate(e.data.id)}
                fullWidth
            >
                <Flex className="w-fit gap-3">
                    <TextInput
                        icon={MagnifyingGlassIcon}
                        placeholder="Search resources..."
                    />
                    <Button icon={PlusIcon}>
                        Create new resource collection
                    </Button>
                </Flex>
            </Table>
        </Layout>
    )
}
