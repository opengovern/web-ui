import {
    Button,
    Card,
    Col,
    Flex,
    Grid,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    Text,
    Title,
} from '@tremor/react'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
    BookOpenIcon,
    CheckCircleIcon,
    CodeBracketIcon,
    Cog8ToothIcon,
    CommandLineIcon,
    XCircleIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import MarkdownPreview from '@uiw/react-markdown-preview'
import Pagination from '@cloudscape-design/components/pagination'

import { useAtomValue } from 'jotai'
import { useComplianceApiV1BenchmarksControlsDetail } from '../../../../../api/compliance.gen'
import Spinner from '../../../../../components/Spinner'
import { numberDisplay } from '../../../../../utilities/numericDisplay'
import DrawerPanel from '../../../../../components/DrawerPanel'
import AnimatedAccordion from '../../../../../components/AnimatedAccordion'
import { searchAtom } from '../../../../../utilities/urlstate'
import {
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkControlSummary,
    GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus,
    GithubComKaytuIoKaytuEnginePkgControlApiListV2ResponseItem,
} from '../../../../../api/api'
import SideNavigation from '@cloudscape-design/components/side-navigation'
import { Api } from '../../../../../api/api'
import AxiosAPI from '../../../../../api/ApiConfig'
import Table from '@cloudscape-design/components/table'
import Box from '@cloudscape-design/components/box'
import SpaceBetween from '@cloudscape-design/components/space-between'
import TextFilter from '@cloudscape-design/components/text-filter'
import Header from '@cloudscape-design/components/header'
import Badge from '@cloudscape-design/components/badge'
import KButton from '@cloudscape-design/components/button'
interface IPolicies {
    id: string | undefined
    assignments: number
    enable?: boolean
}

export const activeBadge = (status: boolean) => {
    if (status) {
        return (
            <Flex className="w-fit gap-1.5">
                <CheckCircleIcon className="h-4 text-emerald-500" />
                <Text>Active</Text>
            </Flex>
        )
    }
    return (
        <Flex className="w-fit gap-1.5">
            <XCircleIcon className="h-4 text-rose-600" />
            <Text>Inactive</Text>
        </Flex>
    )
}
  const navigateToInsightsDetails = (id: string) => {
    //   navigate(`${id}?${searchParams}`)
  }

export const statusBadge = (
    status:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus
        | undefined
) => {
    if (
        status ===
        GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus.ConformanceStatusPassed
    ) {
        return (
            <Flex className="w-fit gap-1.5">
                <CheckCircleIcon className="h-4 text-emerald-500" />
                <Text>Passed</Text>
            </Flex>
        )
    }
    return (
        <Flex className="w-fit gap-1.5">
            <XCircleIcon className="h-4 text-rose-600" />
            <Text>Failed</Text>
        </Flex>
    )
}

export const treeRows = (
    json:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkControlSummary
        | undefined
) => {
    let arr: any = []
    if (json) {
        if (json.control !== null && json.control !== undefined) {
            for (let i = 0; i < json.control.length; i += 1) {
                let obj = {}
                obj = {
                    parentName: json?.benchmark?.title,
                    ...json.control[i].control,
                    ...json.control[i],
                }
                arr.push(obj)
            }
        }
        if (json.children !== null && json.children !== undefined) {
            for (let i = 0; i < json.children.length; i += 1) {
                const res = treeRows(json.children[i])
                arr = arr.concat(res)
            }
        }
    }

    return arr
}

export const groupBy = (input: any[], key: string) => {
    return input.reduce((acc, currentValue) => {
        const groupKey = currentValue[key]
        if (!acc[groupKey]) {
            acc[groupKey] = []
        }
        acc[groupKey].push(currentValue)
        return acc
    }, {})
}

export const countControls = (
    v:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkControlSummary
        | undefined
) => {
    const countChildren = v?.children
        ?.map((i) => countControls(i))
        .reduce((prev, curr) => prev + curr, 0)
    const total: number = (countChildren || 0) + (v?.control?.length || 0)
    return total
}

export default function Controls({ id, assignments, enable }: IPolicies) {
    const { response: controls, isLoading } =
        useComplianceApiV1BenchmarksControlsDetail(String(id))
       const [page, setPage] = useState<number>(0)
       const [rows, setRows] = useState<
           GithubComKaytuIoKaytuEnginePkgControlApiListV2ResponseItem[]
       >([])
    const navigate = useNavigate()
    const searchParams = useAtomValue(searchAtom)
    const [loading, setLoading] = useState(true)

    const [doc, setDoc] = useState('')
    const [docTitle, setDocTitle] = useState('')
    const [openAllControls, setOpenAllControls] = useState(false)
    const [listofTables, setListOfTables] = useState([])
    const [totalPage, setTotalPage] = useState<number>(0)

    const toggleOpen = () => {
        setOpenAllControls(!openAllControls)
    }

    const countBenchmarks = (
        v:
            | GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkControlSummary
            | undefined
    ) => {
        const countChildren = v?.children
            ?.map((i) => countBenchmarks(i))
            .reduce((prev, curr) => prev + curr, 0)
        const total: number = (countChildren || 0) + (v?.children?.length || 0)
        return total
    }
      const GetControls = () => {
          // setLoading(true)
          const api = new Api()
          api.instance = AxiosAPI
        //   const benchmarks = category
        //   const temp = []
        //   temp.push(`aws_score_${benchmarks}`)
        //   temp.push(`azure_score_${benchmarks}`)

          let body = {
              list_of_tables: listofTables,
              root_benchmark: [id],
              cursor: page,
              per_page: 10,
          }
          if (listofTables.length == 0) {
              // @ts-ignore
              delete body['list_of_tables']
          }
          api.compliance
            // @ts-ignore
              .apiV2ControlList(body)
              .then((resp) => {
                  setTotalPage(Math.ceil(resp.data.total_count/10))
                  if (resp.data.items) {
                      setRows(resp.data.items)
                  }

                  setLoading(false)
              })
              .catch((err) => {
                  setLoading(false)
                  setRows([])
              })
      }
    const sections = Object.entries(groupBy(treeRows(controls), 'parentName'))
   useEffect(() => {
       GetControls()
   }, [ listofTables])

    return (
        <Grid numItems={8} className="gap-4">
            <Col numColSpan={2}>
                <Flex className="bg-white  w-full border-solid border-2    rounded-xl p-4">
                    <SideNavigation
                        className="w-fit"
                        activeHref={'#/page1'}
                        header={{ href: '#/', text: 'Structure' }}
                        onFollow={(event) => {
                            if (!event.detail.external) {
                                event.preventDefault()
                                // setActiveHref(event.detail.href)
                            }
                        }}
                        items={[
                            { type: 'link', text: 'Page 1', href: '#/page1' },
                            { type: 'link', text: 'Page 2', href: '#/page2' },
                            {
                                type: 'section',
                                text: 'Section 1',
                                items: [
                                    {
                                        type: 'link',
                                        text: 'Page 4',
                                        href: '#/page4',
                                    },
                                    {
                                        type: 'link',
                                        text: 'Page 5',
                                        href: '#/page5',
                                    },
                                    {
                                        type: 'link',
                                        text: 'Page 6',
                                        href: '#/page6',
                                    },
                                ],
                            },
                            {
                                type: 'section',
                                text: 'Section 2',
                                items: [
                                    {
                                        type: 'link',
                                        text: 'Page 7',
                                        href: '#/page7',
                                    },
                                    {
                                        type: 'link',
                                        text: 'Page 8',
                                        href: '#/page8',
                                    },
                                    {
                                        type: 'link',
                                        text: 'Page 9',
                                        href: '#/page9',
                                    },
                                ],
                            },
                        ]}
                    />
                </Flex>
            </Col>
            <Col numColSpan={6}>
                {' '}
                <Flex className="flex flex-col min-h-[500px] ">
                    <Table
                        className="p-3 max-w-[60vw] min-h-[450px]"
                        // resizableColumns
                        renderAriaLive={({
                            firstIndex,
                            lastIndex,
                            totalItemsCount,
                        }) =>
                            `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
                        }
                        columnDefinitions={[
                            {
                                id: 'id',
                                header: 'ID',
                                cell: (item) => item.id,
                                sortingField: 'id',
                                isRowHeader: true,
                            },
                            {
                                id: 'title',
                                header: 'Title',
                                cell: (item) => item.title,
                                sortingField: 'alt',
                                minWidth: 500,
                            },
                            {
                                id: 'connector',
                                header: 'Connector',
                                cell: (item) => item.connector,
                            },
                            {
                                id: 'query',
                                header: 'Primary Table',
                                cell: (item) => item?.query?.primary_table,
                            },
                            {
                                id: 'severity',
                                header: 'Severity',
                                cell: (item) => (
                                    <Badge
                                        // @ts-ignore
                                        color={`severity-${item.severity}`}
                                    >
                                        {item.severity.charAt(0).toUpperCase() +
                                            item.severity.slice(1)}
                                    </Badge>
                                ),
                            },
                            {
                                id: 'query.parameters',
                                header: 'Has Parametrs',
                                cell: (item) => (
                                    // @ts-ignore
                                    <>
                                        {item.query?.parameters.length > 0
                                            ? 'True'
                                            : 'False'}
                                    </>
                                ),
                            },
                            {
                                id: 'incidents',
                                header: 'Incidents',
                                cell: (item) => (
                                    // @ts-ignore
                                    <></>
                                ),
                                minWidth: 50,
                            },
                            {
                                id: 'passing_resources',
                                header: 'Passing Resources',
                                cell: (item) => (
                                    // @ts-ignore
                                    <></>
                                ),
                            },
                            {
                                id: 'action',
                                header: 'Action',
                                cell: (item) => (
                                    // @ts-ignore
                                    <KButton
                                        onClick={() => {
                                            navigateToInsightsDetails(item.id)
                                        }}
                                        variant="inline-link"
                                        ariaLabel={`Open Detail`}
                                    >
                                        Open
                                    </KButton>
                                ),
                            },
                        ]}
                        columnDisplay={[
                            { id: 'id', visible: false },
                            { id: 'title', visible: true },
                            { id: 'connector', visible: false },
                            { id: 'query', visible: false },
                            { id: 'severity', visible: true },
                            { id: 'incidents', visible: true },
                            { id: 'passing_resources', visible: true },

                            // { id: 'action', visible: true },
                        ]}
                        enableKeyboardNavigation
                        items={rows}
                        loadingText="Loading resources"
                        // stickyColumns={{ first: 0, last: 1 }}
                        // stripedRows
                        trackBy="id"
                        empty={
                            <Box
                                margin={{ vertical: 'xs' }}
                                textAlign="center"
                                color="inherit"
                            >
                                <SpaceBetween size="m">
                                    <b>No resources</b>
                                    <Button>Create resource</Button>
                                </SpaceBetween>
                            </Box>
                        }
                        filter={
                            <TextFilter
                                className="w-100"
                                filteringPlaceholder="Find Control"
                                filteringText=""
                            />
                        }
                        header={<Header className="w-full"></Header>}
                        pagination={
                            <Pagination
                                currentPageIndex={page}
                                pagesCount={totalPage}
                            />
                        }
                    />
                </Flex>
            </Col>
        </Grid>
    )
}
