// @ts-nocheck
import { useAtomValue } from 'jotai'
import { ICellRendererParams, ValueFormatterParams } from 'ag-grid-community'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    Button,
    Flex,
    MultiSelect,
    MultiSelectItem,
    Text,
    Title,
} from '@tremor/react'
import {
    ArrowPathRoundedSquareIcon,
    CloudIcon,
    PlayCircleIcon,
} from '@heroicons/react/24/outline'
import { Checkbox, useCheckboxState } from 'pretty-checkbox-react'
import { useComplianceApiV1AssignmentsBenchmarkDetail } from '../../../../../api/compliance.gen'
import {
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignedConnection,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary,
} from '../../../../../api/api'
import DrawerPanel from '../../../../../components/DrawerPanel'
import Table, { IColumn } from '../../../../../components/Table'
import { isDemoAtom } from '../../../../../store'
import KFilter from '../../../../../components/Filter'
import { Box, Icon, Multiselect, SpaceBetween, Spinner } from '@cloudscape-design/components'
import { Fragment, ReactNode } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Modal from '@cloudscape-design/components/modal'
import KButton from '@cloudscape-design/components/button'
import axios from 'axios'
import KTable from '@cloudscape-design/components/table'
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs'
import Badge from '@cloudscape-design/components/badge'
import {
    BreadcrumbGroup,
    Header,
    Link,
    Pagination,
    PropertyFilter,
} from '@cloudscape-design/components'
import { AppLayout, SplitPanel } from '@cloudscape-design/components'
import { dateTimeDisplay } from '../../../../../utilities/dateDisplay'
import StatusIndicator from '@cloudscape-design/components/status-indicator'
import SeverityBar from '../../BenchmarkCard/SeverityBar'
interface IEvaluate {
    id: string | undefined
    assignmentsCount: number
    benchmarkDetail:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
        | undefined
    onEvaluate: (c: string[]) => void
}

export default function EvaluateTable({
    id,
    benchmarkDetail,
    assignmentsCount,
    onEvaluate,
}: IEvaluate) {
    const [open, setOpen] = useState(false)
    const isDemo = useAtomValue(isDemoAtom)
    const [openConfirm, setOpenConfirm] = useState(false)
    const [connections, setConnections] = useState<string[]>([])
 const [loading, setLoading] = useState(false)
 const [detailLoading, setDetailLoading] = useState(false)

 const [accounts, setAccounts] = useState()
 const [selected, setSelected] = useState()
 const [detail, setDetail] = useState()

 const [page, setPage] = useState(1)
const [totalCount, setTotalCount] = useState(0)
const [totalPage, setTotalPage] = useState(0)

  const GetHistory = () => {
      // /compliance/api/v3/benchmark/{benchmark-id}/assignments
      setLoading(true)
      let url = ''
      if (window.location.origin === 'http://localhost:3000') {
          url = window.__RUNTIME_CONFIG__.REACT_APP_BASE_URL
      } else {
          url = window.location.origin
      }
      // @ts-ignore
      const token = JSON.parse(localStorage.getItem('kaytu_auth')).token

      const config = {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      }
      const body ={
        cursor : page,
        per_page:20,

      }
      axios
          .post(
              `${url}/main/schedule/api/v3/benchmark/${id}/run-history`,
              body,config
          )
          .then((res) => {
              setAccounts(res.data.items)
              setTotalCount(res.data.total_count)
                setTotalPage(Math.ceil(res.data.total_count / 20))
              setLoading(false)
          })
          .catch((err) => {
              setLoading(false)
              console.log(err)
          })
  }
  
  const GetDetail = () => {
      // /compliance/api/v3/benchmark/{benchmark-id}/assignments
      setDetailLoading(true)
      let url = ''
      if (window.location.origin === 'http://localhost:3000') {
          url = window.__RUNTIME_CONFIG__.REACT_APP_BASE_URL
      } else {
          url = window.location.origin
      }
      // @ts-ignore
      const token = JSON.parse(localStorage.getItem('kaytu_auth')).token

      const config = {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      }
      let connector = ''
      benchmarkDetail?.connectors?.map((c) => {
          connector += `connector=${c}&`
      })
      axios
          .get(
              // @ts-ignore
              `${url}/main//compliance/api/v3/compliance/summary/${selected.job_id} `,
              config
          )
          .then((res) => {
              //   setAccounts(res.data.integrations)
              setDetail(res.data)
              setDetailLoading(false)
          })
          .catch((err) => {
              setDetailLoading(false)
              console.log(err)
          })
  }
  useEffect(()=>{
    GetHistory()
  },[page])
  
    useEffect(() => {
        if(selected){
        GetDetail()

        }
    }, [selected])
  
    return (
        <>
            <AppLayout
                toolsOpen={false}
                navigationOpen={false}
                contentType="table"
                toolsHide={true}
                navigationHide={true}
                splitPanelOpen={open}
                onSplitPanelToggle={() => {
                    setOpen(!open)
                    if (open) {
                        setSelected(undefined)
                    }
                }}
                splitPanel={
                    // @ts-ignore
                    <SplitPanel
                        // @ts-ignore
                        header={
                            selected ? (
                                <>{`Job No ${selected?.job_id} Selected`}</>
                            ) : (
                                'Job not selected'
                            )
                        }
                    >
                        {detailLoading ? (
                            <>
                                <Spinner />
                            </>
                        ) : (
                            <>
                                <Flex flexDirection="col" className="w-full" alignItems='center' justifyContent='center'>
                                    <KeyValuePairs
                                    className='w-full'
                                        columns={6}
                                        items={[
                                            {
                                                label: 'Job ID',
                                                value: selected?.job_id,
                                            },
                                            {
                                                label: 'Benchmark ID',
                                                value: detail?.benchmark_id,
                                            },
                                            {
                                                label: 'Benchmark Title',
                                                value: detail?.benchmark_title,
                                            },
                                            {
                                                label: 'Last Evaulated at',
                                                value: (
                                                    <>
                                                        {dateTimeDisplay(
                                                            selected?.updated_at
                                                        )}
                                                    </>
                                                ),
                                            },
                                            {
                                                label: 'Job Status',
                                                value: (
                                                    <StatusIndicator>
                                                        {selected?.job_status}
                                                    </StatusIndicator>
                                                ),
                                            },
                                        ]}
                                    />
                                    <Flex className='w-1/2 mt-2'>
                                        <SeverityBar benchmark={detail} />
                                    </Flex>
                                </Flex>
                            </>
                        )}
                    </SplitPanel>
                }
                content={
                    <KTable
                        className="   min-h-[450px]"
                        // resizableColumns
                        variant="full-page"
                        renderAriaLive={({
                            firstIndex,
                            lastIndex,
                            totalItemsCount,
                        }) =>
                            `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
                        }
                        onSortingChange={(event) => {
                            // setSort(event.detail.sortingColumn.sortingField)
                            // setSortOrder(!sortOrder)
                        }}
                        // sortingColumn={sort}
                        // sortingDescending={sortOrder}
                        // sortingDescending={sortOrder == 'desc' ? true : false}
                        // @ts-ignore
                        onRowClick={(event) => {
                            const row = event.detail.item
                            // @ts-ignore
                            setSelected(row)
                            setOpen(true)
                        }}
                        columnDefinitions={[
                            {
                                id: 'job_id',
                                header: 'Id',
                                cell: (item) => item.job_id,
                                sortingField: 'id',
                                isRowHeader: true,
                            },
                            {
                                id: 'updated_at',
                                header: 'Last Updated at',
                                cell: (item) => (
                                    // @ts-ignore
                                    <>{dateTimeDisplay(item.updated_at)}</>
                                ),
                            },

                            {
                                id: 'integrantion_id',
                                header: 'Integration Id',
                                cell: (item) => (
                                    // @ts-ignore
                                    <>{dateTimeDisplay(item.updated_at)}</>
                                ),
                            },

                            {
                                id: 'integrantion_name',
                                header: 'Integration Name',
                                cell: (item) => (
                                    // @ts-ignore
                                    <>{dateTimeDisplay(item.updated_at)}</>
                                ),
                            },

                            {
                                id: 'job_status',
                                header: 'Job Status',
                                cell: (item) => (
                                    // @ts-ignore
                                    <>{item.job_status}</>
                                ),
                            },
                        ]}
                        columnDisplay={[
                            { id: 'job_id', visible: true },
                            { id: 'updated_at', visible: true },
                            { id: 'job_status', visible: true },
                            // { id: 'conformanceStatus', visible: true },
                            // { id: 'severity', visible: true },
                            // { id: 'evaluatedAt', visible: true },

                            // { id: 'action', visible: true },
                        ]}
                        enableKeyboardNavigation
                        // @ts-ignore
                        items={accounts}
                        loading={loading}
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
                                </SpaceBetween>
                            </Box>
                        }
                        filter={
                            ''
                            // <PropertyFilter
                            //     // @ts-ignore
                            //     query={undefined}
                            //     // @ts-ignore
                            //     onChange={({ detail }) => {
                            //         // @ts-ignore
                            //         setQueries(detail)
                            //     }}
                            //     // countText="5 matches"
                            //     enableTokenGroups
                            //     expandToViewport
                            //     filteringAriaLabel="Control Categories"
                            //     // @ts-ignore
                            //     // filteringOptions={filters}
                            //     filteringPlaceholder="Control Categories"
                            //     // @ts-ignore
                            //     filteringOptions={undefined}
                            //     // @ts-ignore

                            //     filteringProperties={undefined}
                            //     // filteringProperties={
                            //     //     filterOption
                            //     // }
                            // />
                        }
                        header={
                            <Header className="w-full">
                                Jobs{' '}
                                <span className=" font-medium">
                                    ({totalCount})
                                </span>
                            </Header>
                        }
                        pagination={
                            <Pagination
                                currentPageIndex={page}
                                pagesCount={totalPage}
                                onChange={({ detail }) =>
                                    setPage(detail.currentPageIndex)
                                }
                            />
                        }
                    />
                }
            />
        </>
    )
}
