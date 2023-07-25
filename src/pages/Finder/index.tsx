import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    Button,
    Card,
    Col,
    Flex,
    Grid,
    Icon,
    Metric,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    Text,
    TextInput,
} from '@tremor/react'
import {
    CommandLineIcon,
    MagnifyingGlassIcon,
    PlayCircleIcon,
    TableCellsIcon,
} from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react' // eslint-disable-next-line import/no-extraneous-dependencies
import { highlight, languages } from 'prismjs' // eslint-disable-next-line import/no-extraneous-dependencies
import 'prismjs/components/prism-sql' // eslint-disable-next-line import/no-extraneous-dependencies
import 'prismjs/themes/prism.css'
import Editor from 'react-simple-code-editor'
import { GridOptions } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/solid'
import LoggedInLayout from '../../components/LoggedInLayout'
import QueryCard from '../../components/Cards/QueryCard'
import {
    useInventoryApiV1QueryList,
    useInventoryApiV1QueryRunCreate,
    useInventoryApiV2MetadataTagsResourcetypeDetail,
} from '../../api/inventory.gen'
import Spinner from '../../components/Spinner'
import { snakeCaseToLabel } from '../../utilities/labelMaker'
import { getErrorMessage } from '../../types/apierror'

const getTable = (headers: any, details: any) => {
    const columns = []
    const rows = []
    if (headers && headers.length) {
        for (let i = 0; i < headers.length; i += 1) {
            columns.push({
                field: headers[i],
                headerName: snakeCaseToLabel(headers[i]),
                sortable: true,
                resizable: true,
                filter: true,
                flex: 1,
            })
        }
    }
    if (details && details.length) {
        for (let i = 0; i < details.length; i += 1) {
            const row: any = {}
            for (let j = 0; j < columns.length; j += 1) {
                row[headers[j]] = details[i][j]
            }
            rows.push(row)
        }
    }
    return {
        columns,
        rows,
    }
}

export default function Finder() {
    const [code, setCode] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [searchedQuery, setSearchedQuery] = useState('')
    const [searchCategory, setSearchCategory] = useState('')

    const { response: categories, isLoading: categoryLoading } =
        useInventoryApiV2MetadataTagsResourcetypeDetail('category', {
            connector: [],
        })
    const { response: queries, isLoading: queryLoading } =
        useInventoryApiV1QueryList({})
    // const { response: history } = useInventoryApiV1QueryRunHistoryCreate()

    const {
        response: queryResponse,
        isLoading,
        isExecuted,
        sendNow,
        error,
    } = useInventoryApiV1QueryRunCreate(
        {
            page: { no: 1, size: 1000 },
            query: code,
        },
        {},
        false
    )
    const gridOptions: GridOptions = {
        pagination: true,
        animateRows: true,
        paginationPageSize: 25,
        getRowHeight: (params) => 50,
    }

    useEffect(() => {
        if (queryResponse?.query?.length) {
            setSelectedIndex(1)
        } else setSelectedIndex(0)
    }, [queryResponse])

    return (
        <LoggedInLayout currentPage="finder">
            {categoryLoading || queryLoading ? (
                <Spinner className="mt-56" />
            ) : (
                <Flex alignItems="start" className="gap-x-6">
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        className="w-64 border-r border-gray-300 pr-6"
                    >
                        <Metric>Finder</Metric>
                        <TextInput
                            className="w-56 mt-6 mb-2"
                            icon={MagnifyingGlassIcon}
                            placeholder="Search..."
                            value={searchCategory}
                            onChange={(e) => setSearchCategory(e.target.value)}
                        />
                        {categories?.values?.map(
                            (cat) =>
                                !!cat.resource_types?.filter((catt) =>
                                    catt
                                        .toLowerCase()
                                        .includes(searchCategory.toLowerCase())
                                ).length && (
                                    <Accordion className="w-56 border-0 rounded-none bg-transparent">
                                        <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                                            <Flex
                                                justifyContent="start"
                                                className="w-full"
                                            >
                                                <Icon icon={TableCellsIcon} />
                                                <Text className="w-3/4 truncate text-start font-semibold">
                                                    {cat.value}
                                                </Text>
                                            </Flex>
                                        </AccordionHeader>
                                        <AccordionBody className="p-0 w-full pr-0.5 cursor-default bg-transparent">
                                            <Flex
                                                flexDirection="col"
                                                justifyContent="start"
                                            >
                                                {cat.resource_types
                                                    ?.filter((catt) =>
                                                        catt
                                                            .toLowerCase()
                                                            .includes(
                                                                searchCategory.toLowerCase()
                                                            )
                                                    )
                                                    .map((subCat) => (
                                                        <Flex
                                                            onClick={() =>
                                                                setCode(
                                                                    `select * from kaytu_resources where resource_type = '${subCat}'`
                                                                )
                                                            }
                                                        >
                                                            <Icon
                                                                icon={
                                                                    TableCellsIcon
                                                                }
                                                                className="opacity-0"
                                                            />
                                                            <Text className="w-full truncate text-start py-2 cursor-pointer hover:text-blue-600">
                                                                {subCat}
                                                            </Text>
                                                        </Flex>
                                                    ))}
                                            </Flex>
                                        </AccordionBody>
                                    </Accordion>
                                )
                        )}
                    </Flex>
                    <Flex
                        flexDirection="col"
                        className="w-full h-full max-h-full overflow-hidden overflow-y-scroll px-1 pt-1"
                    >
                        <Card>
                            <Editor
                                onValueChange={(text) => setCode(text)}
                                highlight={(text) =>
                                    highlight(text, languages.sql, 'sql')
                                }
                                value={code}
                                className="w-full bg-white dark:bg-gray-900 dark:text-gray-50 font-mono text-sm"
                                style={{ minHeight: '200px' }}
                                placeholder="-- write your SQL query here"
                            />
                        </Card>
                        <Flex className="w-full mt-4">
                            <Flex>
                                {!isLoading && isExecuted && error && (
                                    <Flex justifyContent="start">
                                        <Icon
                                            icon={ExclamationCircleIcon}
                                            color="rose"
                                        />
                                        <Text color="rose">
                                            {getErrorMessage(error)}
                                        </Text>
                                    </Flex>
                                )}
                                {!isLoading && isExecuted && queryResponse && (
                                    <Flex justifyContent="start">
                                        <Icon
                                            icon={CheckCircleIcon}
                                            color="emerald"
                                        />
                                        <Text color="emerald">Success</Text>
                                    </Flex>
                                )}
                            </Flex>
                            <Flex className="w-fit gap-x-6">
                                {!!code.length && (
                                    <Button
                                        variant="light"
                                        color="gray"
                                        icon={CommandLineIcon}
                                        onClick={() => setCode('')}
                                    >
                                        Clear Console
                                    </Button>
                                )}
                                <Button
                                    icon={PlayCircleIcon}
                                    onClick={() => sendNow()}
                                    disabled={!code.length}
                                    loading={isLoading && isExecuted}
                                    loadingText="Running"
                                >
                                    Run Script
                                </Button>
                            </Flex>
                        </Flex>
                        <TabGroup
                            className="mt-6"
                            id="tabs"
                            index={selectedIndex}
                            onIndexChange={setSelectedIndex}
                        >
                            <TabList className="bg-gray-100 dark:bg-gray-900">
                                <Tab>Get Started</Tab>
                                <Tab
                                    className={
                                        queryResponse?.query?.length &&
                                        !isLoading
                                            ? 'flex'
                                            : 'hidden'
                                    }
                                >
                                    Result
                                </Tab>
                            </TabList>
                            <TabPanels className="mt-6">
                                <TabPanel>
                                    <Grid
                                        numItems={1}
                                        numItemsMd={2}
                                        numItemsLg={3}
                                        className="gap-4 mb-4"
                                    >
                                        <Col numColSpan={2}>
                                            <Flex className="h-full">
                                                <Text>Smart Queries</Text>
                                            </Flex>
                                        </Col>
                                        <TextInput
                                            icon={MagnifyingGlassIcon}
                                            placeholder="Search..."
                                            value={searchedQuery}
                                            onChange={(e) =>
                                                setSearchedQuery(e.target.value)
                                            }
                                        />
                                    </Grid>
                                    <Grid
                                        numItems={1}
                                        numItemsMd={2}
                                        numItemsLg={3}
                                        className="w-full gap-4"
                                    >
                                        {queries
                                            ?.filter((q) =>
                                                q.title
                                                    ?.toLowerCase()
                                                    .includes(
                                                        searchedQuery.toLowerCase()
                                                    )
                                            )
                                            .map((q) => (
                                                <QueryCard
                                                    title={q.title}
                                                    description={q.description}
                                                    onClick={() => {
                                                        setCode(q.query || '')
                                                        document
                                                            .getElementById(
                                                                'kaytu-container'
                                                            )
                                                            ?.scrollTo({
                                                                top: 0,
                                                                behavior:
                                                                    'smooth',
                                                            })
                                                    }}
                                                />
                                            ))}
                                    </Grid>
                                </TabPanel>
                                <TabPanel>
                                    <div className="ag-theme-alpine w-full">
                                        <AgGridReact
                                            domLayout="autoHeight"
                                            gridOptions={gridOptions}
                                            columnDefs={
                                                getTable(
                                                    queryResponse?.headers,
                                                    queryResponse?.result
                                                ).columns
                                            }
                                            rowData={
                                                getTable(
                                                    queryResponse?.headers,
                                                    queryResponse?.result
                                                ).rows
                                            }
                                        />
                                    </div>
                                </TabPanel>
                            </TabPanels>
                        </TabGroup>
                    </Flex>
                </Flex>
            )}
        </LoggedInLayout>
    )
}
