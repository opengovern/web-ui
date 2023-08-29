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
    Subtitle,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    Text,
    TextInput,
} from '@tremor/react'
import {
    ChevronDoubleLeftIcon,
    CommandLineIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    PlayCircleIcon,
    TableCellsIcon,
} from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react' // eslint-disable-next-line import/no-extraneous-dependencies
import { highlight, languages } from 'prismjs' // eslint-disable-next-line import/no-extraneous-dependencies
import 'prismjs/components/prism-sql' // eslint-disable-next-line import/no-extraneous-dependencies
import 'prismjs/themes/prism.css'
import Editor from 'react-simple-code-editor'
import { RowClickedEvent } from 'ag-grid-community'
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/solid'
import { useLocation } from 'react-router-dom'
import { maskPassword } from 'maskdata'
import Menu from '../../components/Menu'
import QueryCard from '../../components/Cards/QueryCard'
import {
    useInventoryApiV1QueryList,
    useInventoryApiV1QueryRunCreate,
    useInventoryApiV2AnalyticsCategoriesList,
} from '../../api/inventory.gen'
import Spinner from '../../components/Spinner'
import { snakeCaseToLabel } from '../../utilities/labelMaker'
import { getErrorMessage } from '../../types/apierror'
import DrawerPanel from '../../components/DrawerPanel'
import { RenderObject } from '../../components/RenderObject'
import Table, { IColumn } from '../../components/Table'
import Header from '../../components/Header'
import { isDemo } from '../../utilities/demo'

const getTable = (headers: any, details: any) => {
    const columns: IColumn<any, any>[] = []
    const rows: any[] = []
    if (headers && headers.length) {
        for (let i = 0; i < headers.length; i += 1) {
            columns.push({
                field: headers[i],
                headerName: snakeCaseToLabel(headers[i]),
                type: 'string',
                sortable: true,
                resizable: true,
                filter: true,
            })
        }
    }
    if (details && details.length) {
        for (let i = 0; i < details.length; i += 1) {
            const row: any = {}
            if (isDemo()) {
                for (let j = 0; j < columns.length; j += 1) {
                    row[headers[j]] =
                        typeof details[i][j] === 'string'
                            ? maskPassword(details[i][j])
                            : maskPassword(JSON.stringify(details[i][j]))
                }
                rows.push(row)
            } else {
                for (let j = 0; j < columns.length; j += 1) {
                    row[headers[j]] =
                        typeof details[i][j] === 'string'
                            ? details[i][j]
                            : JSON.stringify(details[i][j])
                }
                rows.push(row)
            }
        }
    }
    return {
        columns,
        rows,
    }
}

export default function Finder() {
    const queryParams = useLocation().search
    const query = new URLSearchParams(queryParams).get('q')
    const [loaded, setLoaded] = useState(false)
    const [code, setCode] = useState(query || '')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [searchedQuery, setSearchedQuery] = useState('')
    const [searchCategory, setSearchCategory] = useState('')
    const [selectedRow, setSelectedRow] = useState({})
    const [openDrawer, setOpenDrawer] = useState(false)
    const [openSearch, setOpenSearch] = useState(true)

    const { response: categories, isLoading: categoryLoading } =
        useInventoryApiV2AnalyticsCategoriesList()
    const { response: queries, isLoading: queryLoading } =
        useInventoryApiV1QueryList({})

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

    useEffect(() => {
        if (queryResponse?.query?.length) {
            setSelectedIndex(1)
        } else setSelectedIndex(0)
    }, [queryResponse])

    useEffect(() => {
        if (!loaded && code.length > 0) {
            sendNow()
            setLoaded(true)
        }
    }, [])

    const recordToArray = (record?: Record<string, string[]> | undefined) => {
        if (record === undefined) {
            return []
        }

        return Object.keys(record).map((key) => {
            return {
                value: key,
                resource_types: record[key],
            }
        })
    }

    return (
        <Menu currentPage="finder">
            <Header title="Finder" />
            {categoryLoading || queryLoading ? (
                <Spinner className="mt-56" />
            ) : (
                <Flex alignItems="start">
                    <DrawerPanel
                        open={openDrawer}
                        onClose={() => setOpenDrawer(false)}
                    >
                        <RenderObject obj={selectedRow} />
                    </DrawerPanel>
                    {openSearch ? (
                        <Flex
                            flexDirection="col"
                            alignItems="start"
                            className="w-64 pr-6"
                        >
                            <TextInput
                                className="w-56 mb-2"
                                icon={MagnifyingGlassIcon}
                                placeholder="Search..."
                                value={searchCategory}
                                onChange={(e) =>
                                    setSearchCategory(e.target.value)
                                }
                            />
                            {recordToArray(
                                categories?.categoryResourceType
                            ).map(
                                (cat) =>
                                    !!cat.resource_types?.filter((catt) =>
                                        catt
                                            .toLowerCase()
                                            .includes(
                                                searchCategory.toLowerCase()
                                            )
                                    ).length && (
                                        <Accordion className="w-56 border-0 rounded-none bg-transparent">
                                            <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                                                <Flex
                                                    justifyContent="start"
                                                    className="w-full"
                                                >
                                                    <Icon
                                                        icon={TableCellsIcon}
                                                    />
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
                                                                <Text className="w-full truncate text-start py-2 cursor-pointer hover:text-kaytu-600">
                                                                    {subCat}
                                                                </Text>
                                                            </Flex>
                                                        ))}
                                                </Flex>
                                            </AccordionBody>
                                        </Accordion>
                                    )
                            )}
                            <Flex justifyContent="end" className="mt-12">
                                <Button
                                    variant="light"
                                    onClick={() => setOpenSearch(false)}
                                >
                                    <ChevronDoubleLeftIcon className="h-4" />
                                </Button>
                            </Flex>
                        </Flex>
                    ) : (
                        <Flex
                            flexDirection="col"
                            justifyContent="center"
                            className="min-h-full w-fit pr-6"
                        >
                            <Button
                                variant="light"
                                onClick={() => setOpenSearch(true)}
                            >
                                <Flex flexDirection="col" className="gap-4 w-4">
                                    <FunnelIcon />
                                    <Text className="rotate-90">Filters</Text>
                                </Flex>
                            </Button>
                        </Flex>
                    )}
                    <Flex
                        flexDirection="col"
                        className="w-full border-l border-l-gray-300 pl-6"
                    >
                        <Card className="relative overflow-hidden">
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
                            {isLoading && isExecuted && (
                                <Spinner className="bg-white/30 backdrop-blur-sm top-0 left-0 absolute flex justify-center items-center w-full h-full" />
                            )}
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
                                <Tab>
                                    <Subtitle className="text-gray-600 text-base">
                                        Get Started
                                    </Subtitle>
                                </Tab>
                                <Tab
                                    className={
                                        queryResponse?.query?.length &&
                                        !isLoading
                                            ? 'flex'
                                            : 'hidden'
                                    }
                                >
                                    <Subtitle className="text-gray-600 text-base">
                                        Result
                                    </Subtitle>
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
                                                        setCode(
                                                            `-- ${q.title}\n-- ${q.description}\n\n${q.query}` ||
                                                                ''
                                                        )
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
                                    {isLoading ? (
                                        <Spinner className="mt-56" />
                                    ) : (
                                        <Table
                                            title="Query results"
                                            id="finder_table"
                                            columns={
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
                                            downloadable
                                            onRowClicked={(
                                                event: RowClickedEvent
                                            ) => {
                                                setSelectedRow(event.data)
                                                setOpenDrawer(true)
                                            }}
                                        />
                                    )}
                                </TabPanel>
                            </TabPanels>
                        </TabGroup>
                    </Flex>
                </Flex>
            )}
        </Menu>
    )
}
