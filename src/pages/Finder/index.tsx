import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    Button,
    Card,
    Flex,
    Icon,
    Select,
    SelectItem,
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
    ChevronDownIcon,
    ChevronUpIcon,
    CommandLineIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    PlayCircleIcon,
} from '@heroicons/react/24/outline'
import { Fragment, useEffect, useMemo, useState } from 'react' // eslint-disable-next-line import/no-extraneous-dependencies
import { highlight, languages } from 'prismjs' // eslint-disable-next-line import/no-extraneous-dependencies
import 'prismjs/components/prism-sql' // eslint-disable-next-line import/no-extraneous-dependencies
import 'prismjs/themes/prism.css'
import Editor from 'react-simple-code-editor'
import { RowClickedEvent, ValueFormatterParams } from 'ag-grid-community'
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/solid'
import { Transition } from '@headlessui/react'
import { useAtom, useAtomValue } from 'jotai'
import Layout from '../../components/Layout'
import {
    useInventoryApiV1QueryList,
    useInventoryApiV1QueryRunCreate,
    useInventoryApiV2AnalyticsCategoriesList,
} from '../../api/inventory.gen'
import Spinner from '../../components/Spinner'
import { getErrorMessage } from '../../types/apierror'
import DrawerPanel from '../../components/DrawerPanel'
import { RenderObject } from '../../components/RenderObject'
import Table, { IColumn } from '../../components/Table'
import Header from '../../components/Header'
import { GithubComKaytuIoKaytuEnginePkgInventoryApiSmartQueryItem } from '../../api/api'
import { isDemoAtom, queryAtom } from '../../store'
import { snakeCaseToLabel } from '../../utilities/labelMaker'
import { numberDisplay } from '../../utilities/numericDisplay'

export const getTable = (headers: any, details: any, isDemo: boolean) => {
    const columns: IColumn<any, any>[] = []
    const rows: any[] = []
    if (headers && headers.length) {
        for (let i = 0; i < headers.length; i += 1) {
            const isHide = headers[i][0] === '_'
            columns.push({
                field: headers[i],
                headerName: snakeCaseToLabel(headers[i]),
                type: 'string',
                sortable: true,
                hide: isHide,
                resizable: true,
                filter: true,
                width: 170,
                cellRenderer: (param: ValueFormatterParams) => (
                    <span className={isDemo ? 'blur-md' : ''}>
                        {param.value}
                    </span>
                ),
            })
        }
    }
    if (details && details.length) {
        for (let i = 0; i < details.length; i += 1) {
            const row: any = {}
            for (let j = 0; j < columns.length; j += 1) {
                row[headers[j]] =
                    typeof details[i][j] === 'string'
                        ? details[i][j]
                        : JSON.stringify(details[i][j])
            }
            rows.push(row)
        }
    }
    const count = rows.length

    return {
        columns,
        rows,
        count,
    }
}

const columns: IColumn<
    GithubComKaytuIoKaytuEnginePkgInventoryApiSmartQueryItem,
    any
>[] = [
    {
        field: 'title',
        headerName: 'Smart queries',
        type: 'string',
        sortable: true,
        resizable: false,
    },
    {
        type: 'string',
        width: 130,
        resizable: false,
        sortable: false,
        cellRenderer: (params: any) => (
            <Flex
                justifyContent="center"
                alignItems="center"
                className="h-full"
            >
                <PlayCircleIcon className="h-5 text-kaytu-500 mr-1" />
                <Text className="text-kaytu-500">Run query</Text>
            </Flex>
        ),
    },
]

export default function Finder() {
    const [loaded, setLoaded] = useState(false)
    const [savedQuery, setSavedQuery] = useAtom(queryAtom)
    const [code, setCode] = useState(savedQuery || '')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [searchCategory, setSearchCategory] = useState('')
    const [selectedRow, setSelectedRow] = useState({})
    const [openDrawer, setOpenDrawer] = useState(false)
    const [openSearch, setOpenSearch] = useState(true)
    const [showEditor, setShowEditor] = useState(false)
    const isDemo = useAtomValue(isDemoAtom)
    const [pageSize, setPageSize] = useState(1000)

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
            page: { no: 1, size: pageSize },
            query: code,
        },
        {},
        false
    )

    useEffect(() => {
        if (queryResponse?.query?.length) {
            setSelectedIndex(2)
        } else setSelectedIndex(0)
    }, [queryResponse])

    useEffect(() => {
        if (!loaded && code.length > 0) {
            sendNow()
            setLoaded(true)
        }
    }, [])

    useEffect(() => {
        if (code.length) setShowEditor(true)
    }, [code])

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

    const memoRows = useMemo(
        () =>
            getTable(queryResponse?.headers, queryResponse?.result, isDemo)
                .rows,
        [queryResponse, isDemo]
    )
    const memoColumns = useMemo(
        () =>
            getTable(queryResponse?.headers, queryResponse?.result, isDemo)
                .columns,
        [queryResponse, isDemo]
    )
    const memoCount = useMemo(
        () =>
            getTable(queryResponse?.headers, queryResponse?.result, isDemo)
                .count,
        [queryResponse, isDemo]
    )

    return (
        <Layout currentPage="query">
            <Header />
            {categoryLoading || queryLoading ? (
                <Spinner className="mt-56" />
            ) : (
                <Flex alignItems="start">
                    <DrawerPanel
                        open={openDrawer}
                        onClose={() => setOpenDrawer(false)}
                    >
                        <RenderObject
                            obj={selectedRow}
                            changeKeysToLabel={false}
                        />
                    </DrawerPanel>
                    {openSearch ? (
                        <Card className="sticky w-fit">
                            <TextInput
                                className="w-56 mb-6"
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
                                        <Accordion className="w-56 border-0 rounded-none bg-transparent mb-1">
                                            <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                                                <Text className="text-gray-800">
                                                    {cat.value}
                                                </Text>
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
                                                                justifyContent="start"
                                                                onClick={() =>
                                                                    setCode(
                                                                        `select * from kaytu_resources where resource_type = '${subCat}'`
                                                                    )
                                                                }
                                                            >
                                                                <Text className="ml-4 w-full truncate text-start py-2 cursor-pointer hover:text-kaytu-600">
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
                        </Card>
                    ) : (
                        <Flex
                            flexDirection="col"
                            justifyContent="center"
                            className="min-h-full w-fit"
                        >
                            <Button
                                variant="light"
                                onClick={() => setOpenSearch(true)}
                            >
                                <Flex flexDirection="col" className="gap-4 w-4">
                                    <FunnelIcon />
                                    <Text className="rotate-90">Options</Text>
                                </Flex>
                            </Button>
                        </Flex>
                    )}
                    <Flex flexDirection="col" className="w-full pl-6">
                        <Transition.Root show={showEditor} as={Fragment}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-in-out duration-500"
                                enterFrom="h-0 opacity-0"
                                enterTo="h-fit opacity-100"
                                leave="ease-in-out duration-500"
                                leaveFrom="h-fit opacity-100"
                                leaveTo="h-0 opacity-0"
                            >
                                <Flex flexDirection="col" className="mb-4">
                                    <Card className="relative overflow-hidden">
                                        <Editor
                                            onValueChange={(text) => {
                                                setSavedQuery('')
                                                setCode(text)
                                            }}
                                            highlight={(text) =>
                                                highlight(
                                                    text,
                                                    languages.sql,
                                                    'sql'
                                                )
                                            }
                                            value={code}
                                            className="w-full bg-white dark:bg-gray-900 dark:text-gray-50 font-mono text-sm"
                                            style={{
                                                minHeight: '200px',
                                                // maxHeight: '500px',
                                                overflowY: 'scroll',
                                            }}
                                            placeholder="-- write your SQL query here"
                                        />
                                        {isLoading && isExecuted && (
                                            <Spinner className="bg-white/30 backdrop-blur-sm top-0 left-0 absolute flex justify-center items-center w-full h-full" />
                                        )}
                                    </Card>
                                    <Flex className="w-full mt-4">
                                        <Flex justifyContent="start">
                                            <Text className="mr-2">
                                                Maximum rows:
                                            </Text>
                                            <Select
                                                className="w-56"
                                                value="1000"
                                            >
                                                <SelectItem
                                                    value="1000"
                                                    onClick={() =>
                                                        setPageSize(1000)
                                                    }
                                                >
                                                    1,000
                                                </SelectItem>
                                                <SelectItem
                                                    value="3000"
                                                    onClick={() =>
                                                        setPageSize(3000)
                                                    }
                                                >
                                                    3,000
                                                </SelectItem>
                                                <SelectItem
                                                    value="5000"
                                                    onClick={() =>
                                                        setPageSize(5000)
                                                    }
                                                >
                                                    5,000
                                                </SelectItem>
                                                <SelectItem
                                                    value="10000"
                                                    onClick={() =>
                                                        setPageSize(10000)
                                                    }
                                                >
                                                    10,000
                                                </SelectItem>
                                            </Select>
                                        </Flex>
                                        <Flex className="w-fit gap-x-3">
                                            {!!code.length && (
                                                <Button
                                                    variant="light"
                                                    color="gray"
                                                    icon={CommandLineIcon}
                                                    onClick={() => setCode('')}
                                                >
                                                    Clear editor
                                                </Button>
                                            )}
                                            <Button
                                                icon={PlayCircleIcon}
                                                onClick={() => sendNow()}
                                                disabled={!code.length}
                                                loading={
                                                    isLoading && isExecuted
                                                }
                                                loadingText="Running"
                                            >
                                                Run query
                                            </Button>
                                        </Flex>
                                    </Flex>
                                    <Flex className="w-full">
                                        {!isLoading && isExecuted && error && (
                                            <Flex
                                                justifyContent="start"
                                                className="w-fit"
                                            >
                                                <Icon
                                                    icon={ExclamationCircleIcon}
                                                    color="rose"
                                                />
                                                <Text color="rose">
                                                    {getErrorMessage(error)}
                                                </Text>
                                            </Flex>
                                        )}
                                        {!isLoading &&
                                            isExecuted &&
                                            queryResponse && (
                                                <Flex
                                                    justifyContent="start"
                                                    className="w-fit"
                                                >
                                                    {memoCount === pageSize ? (
                                                        <>
                                                            <Icon
                                                                icon={
                                                                    ExclamationCircleIcon
                                                                }
                                                                color="amber"
                                                                className="ml-0 pl-0"
                                                            />
                                                            <Text color="amber">
                                                                {`Row limit of ${numberDisplay(
                                                                    pageSize,
                                                                    0
                                                                )} reached, results are truncated`}
                                                            </Text>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Icon
                                                                icon={
                                                                    CheckCircleIcon
                                                                }
                                                                color="emerald"
                                                            />
                                                            <Text color="emerald">
                                                                Success
                                                            </Text>
                                                        </>
                                                    )}
                                                </Flex>
                                            )}
                                    </Flex>
                                </Flex>
                            </Transition.Child>
                        </Transition.Root>
                        <TabGroup
                            id="tabs"
                            index={selectedIndex}
                            onIndexChange={setSelectedIndex}
                        >
                            <TabList className="mb-3">
                                <Flex>
                                    <Flex className="w-fit">
                                        <Tab
                                            onClick={() => {
                                                setSavedQuery('')
                                            }}
                                        >
                                            Popular queries
                                        </Tab>
                                        <Tab
                                            onClick={() => {
                                                setSavedQuery('')
                                            }}
                                        >
                                            All queries
                                        </Tab>
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
                                    </Flex>
                                    <Button
                                        variant="light"
                                        onClick={() => {
                                            if (showEditor) {
                                                setShowEditor(false)
                                                setSavedQuery('')
                                                setCode('')
                                            } else setShowEditor(true)
                                        }}
                                        icon={
                                            showEditor
                                                ? ChevronUpIcon
                                                : ChevronDownIcon
                                        }
                                    >
                                        {showEditor
                                            ? 'Close query editor'
                                            : 'Open query editor'}
                                    </Button>
                                </Flex>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <Table
                                        id="popular_query_table"
                                        columns={columns}
                                        rowData={queries?.filter(
                                            (q) => q.tags?.popular
                                        )}
                                        loading={queryLoading}
                                        onRowClicked={(e) => {
                                            setCode(
                                                `-- ${e.data?.title}\n\n${e.data?.query}` ||
                                                    ''
                                            )
                                            document
                                                .getElementById(
                                                    'kaytu-container'
                                                )
                                                ?.scrollTo({
                                                    top: 0,
                                                    behavior: 'smooth',
                                                })
                                        }}
                                    />
                                </TabPanel>
                                <TabPanel>
                                    <Table
                                        id="query_table"
                                        columns={columns}
                                        rowData={queries}
                                        loading={queryLoading}
                                        onRowClicked={(e) => {
                                            setCode(
                                                `-- ${e.data?.title}\n\n${e.data?.query}` ||
                                                    ''
                                            )
                                            document
                                                .getElementById(
                                                    'kaytu-container'
                                                )
                                                ?.scrollTo({
                                                    top: 0,
                                                    behavior: 'smooth',
                                                })
                                        }}
                                    />
                                </TabPanel>
                                <TabPanel>
                                    {isLoading ? (
                                        <Spinner className="mt-56" />
                                    ) : (
                                        <Table
                                            title="Query results"
                                            id="finder_table"
                                            columns={memoColumns}
                                            rowData={memoRows}
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
        </Layout>
    )
}
