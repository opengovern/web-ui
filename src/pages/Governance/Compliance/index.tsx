// @ts-nocheck
import { Card, Col, Flex, Grid, Icon, Title } from '@tremor/react'
import { useEffect, useState } from 'react'
import { DocumentTextIcon, PuzzlePieceIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { useComplianceApiV1BenchmarksSummaryList } from '../../../api/compliance.gen'
import {
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary,
    SourceType,
} from '../../../api/api'
import ComplianceListCard from '../../../components/Cards/ComplianceListCard'
import TopHeader from '../../../components/Layout/Header'
import FilterGroup, { IFilter } from '../../../components/FilterGroup'
import { useURLParam, useURLState } from '../../../utilities/urlstate'
import {
    BenchmarkStateFilter,
    ConnectorFilter,
} from '../../../components/FilterGroup/FilterTypes'
import { errorHandling } from '../../../types/apierror'
import RadioSelector, {
    RadioItem,
} from '../../../components/FilterGroup/RadioSelector'
import { benchmarkChecks } from '../../../components/Cards/ComplianceCard'
import Spinner from '../../../components/Spinner'
import axios from 'axios'
import BenchmarkCard from './BenchmarkCard'
import BenchmarkCards from './BenchmarkCard'
import { Header, Pagination, PropertyFilter } from '@cloudscape-design/components'
import Multiselect from '@cloudscape-design/components/multiselect'
import Select from '@cloudscape-design/components/select'
export default function Compliance() {
    const defaultSelectedConnectors = ''
  
    const [loading,setLoading] = useState<boolean>(false);
    const [query, setQuery] = useState({
        tokens: [],
        operation: 'and',
    })
    const [connectors, setConnectors] = useState(
        {
            label: 'Any',
            value: 'Any',
        },
       
    )
    const [enable, setEnanble] = useState(
        {
            label: 'No',
            value: false,
        },
    )
    const [isSRE, setIsSRE] = useState({
        label: 'Compliance Benchmark',
        value: false,
    })
    
        const [AllBenchmarks,setBenchmarks] = useState();
        const [BenchmarkDetails, setBenchmarksDetails] = useState()
    const [page, setPage] = useState<number>(1)
const [totalPage, setTotalPage] = useState<number>(0)
const [totalCount, setTotalCount] = useState<number>(0)

 const GetCard = () => {
     let url = ''
     setLoading(true)
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
     const connectors= []
     const enable = []
     const isSRE = []
    query.tokens.map((item) => {
        if(item.propertyKey == 'connector'){
            connectors.push(item.value)
        }
        if(item.propertyKey == 'enable'){
            enable.push(item.value)
        }
        if(item.propertyKey == 'family'){
            isSRE.push(item.value)
        }
    }
    )
    const connector_filter = connectors.length ==1 ? connectors : []

    let  sre_filter = false
    if(isSRE.length == 1){
        if(isSRE[0] == 'SRE benchmark'){
            sre_filter = true
        }
    }

    let enable_filter = true
    if(enable.length == 1){
        if(enable[0] == 'No'){
            enable_filter = false
        }

    }
     
     const body = {
         cursor: page,
         per_page: 6,
         sort_by: 'incidents',
         assigned: false,
         is_sre_benchmark: sre_filter,
         connectors: connector_filter,
         root: true,
     }

     axios
         .post(`${url}/main/compliance/api/v3/benchmarks`, body,config)
         .then((res) => {
             //  const temp = []
            if(!res.data.items){
            setLoading(false)

            }
            setBenchmarks(res.data.items)
            setTotalPage(Math.ceil(res.data.total_count/6))
            setTotalCount(res.data.total_count)
         })
         .catch((err) => {
            setLoading(false)
            setBenchmarks([])

             console.log(err)
         })
 }

  const Detail = (benchmarks: string[]) => {
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
      const body = {
         benchmarks: benchmarks
      }
      axios
          .post(
              `${url}/main/compliance/api/v3/compliance/summary/benchmark`,
              body,
              config
          )
          .then((res) => {
              //  const temp = []
                setLoading(false)
              setBenchmarksDetails(res.data)
          })
          .catch((err) => {
                setLoading(false)
              setBenchmarksDetails([])

              console.log(err)
          })
  }
 
   useEffect(() => {
       GetCard()
   }, [page, query])
 
   useEffect(() => {
    if(AllBenchmarks){
  const temp = []
  AllBenchmarks?.map((item) => {
      temp.push(item.benchmark.id)
  })
  Detail(temp)
    }
    
   }, [AllBenchmarks])

    return (
        <>
            {/* <TopHeader /> */}
            <Flex
                className="bg-white w-[90%] rounded-xl border-solid  border-2 border-gray-200   "
                flexDirection="col"
                justifyContent="center"
                alignItems="center"
            >
                <div className="border-b w-full rounded-xl border-tremor-border bg-tremor-background-muted p-4 dark:border-dark-tremor-border dark:bg-gray-950 sm:p-6 lg:p-8">
                    <header>
                        <h1 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            Frameworks
                        </h1>
                        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                            Assign, Audit, and govern your tech stack with
                            Compliance Frameworks.
                        </p>
                        <div className="mt-8 w-full md:flex md:max-w-3xl md:items-stretch md:space-x-4">
                            <Card className="w-full md:w-7/12">
                                <div className="inline-flex items-center justify-center rounded-tremor-small border border-tremor-border p-2 dark:border-dark-tremor-border">
                                    <DocumentTextIcon
                                        className="size-5 text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis"
                                        aria-hidden={true}
                                    />
                                </div>
                                <h3 className="mt-4 text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                    <a
                                        href="https://docs.opengovernance.io/"
                                        target="_blank"
                                        className="focus:outline-none"
                                    >
                                        {/* Extend link to entire card */}
                                        <span
                                            className="absolute inset-0"
                                            aria-hidden={true}
                                        />
                                        Documentation
                                    </a>
                                </h3>
                                <p className="dark:text-dark-tremor-cont text-tremor-default text-tremor-content">
                                    Learn how to audit for compliance.
                                </p>
                            </Card>
                        </div>
                    </header>
                </div>
                <div className="w-full">
                    <div className="p-4 sm:p-6 lg:p-8">
                        <main>
                            <div className="flex items-center justify-between">
                                {/* <h2 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                            Available Dashboards
                                        </h2> */}
                                <div className="flex items-center space-x-2">
                                    {/* <Select
                                        placeholder="Sorty by"
                                        enableClear={false}
                                        className="[&>button]:rounded-tremor-small"
                                    >
                                        <SelectItem value="1">Name</SelectItem>
                                        <SelectItem value="2">
                                            Last edited
                                        </SelectItem>
                                        <SelectItem value="3">Size</SelectItem>
                                    </Select> */}
                                    {/* <button
                                                type="button"
                                                onClick={() => {
                                                    f()
                                                    setOpen(true)
                                                }}
                                                className="hidden h-9 items-center gap-1.5 whitespace-nowrap rounded-tremor-small bg-tremor-brand px-3 py-2.5 text-tremor-default font-medium text-tremor-brand-inverted shadow-tremor-input hover:bg-tremor-brand-emphasis dark:bg-dark-tremor-brand dark:text-dark-tremor-brand-inverted dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-brand-emphasis sm:inline-flex"
                                            >
                                                <PlusIcon
                                                    className="-ml-1 size-5 shrink-0"
                                                    aria-hidden={true}
                                                />
                                                Create new Dashboard
                                            </button> */}
                                </div>
                            </div>
                            <div className="flex items-center w-full">
                                <Grid
                                    numItemsMd={1}
                                    numItemsLg={1}
                                    className="gap-[10px] mt-1 w-full justify-items-start"
                                >
                                    {loading ? (
                                        <Spinner />
                                    ) : (
                                        <>
                                            <Grid className="w-full gap-4 justify-items-start">
                                                <Header className="w-full">
                                                    Frameworks{' '}
                                                    <span className=" font-medium">
                                                        ({totalCount})
                                                    </span>
                                                </Header>
                                                <Grid
                                                    numItems={9}
                                                    className="gap-2 min-h-[80px]  w-1/2 "
                                                >
                                                    <Col numColSpan={9}>
                                                        <PropertyFilter
                                                            query={query}
                                                            onChange={({
                                                                detail,
                                                            }) =>{
                                                                console.log(detail)
                                                                setQuery(detail)

                                                            }
                                                            }
                                                            countText="5 matches"
                                                            // enableTokenGroups
                                                            expandToViewport
                                                            filteringAriaLabel="Filter Benchmarks"
                                                            filteringOptions={[
                                                                {
                                                                    propertyKey:
                                                                        'connector',
                                                                    value: 'AWS',
                                                                },
                                                                {
                                                                    propertyKey:
                                                                        'connector',
                                                                    value: 'Azure',
                                                                },
                                                                {
                                                                    propertyKey:
                                                                        'enable',
                                                                    value: 'Yes',
                                                                },
                                                                {
                                                                    propertyKey:
                                                                        'enable',
                                                                    value: 'No',
                                                                },
                                                                {
                                                                    propertyKey:
                                                                        'family',
                                                                    value: 'SRE benchmark',
                                                                },
                                                                {
                                                                    propertyKey:
                                                                        'family',
                                                                    value: 'Compliance Benchmark',
                                                                },
                                                            ]}
                                                            filteringPlaceholder="Find Benchmarks"
                                                            filteringProperties={[
                                                                {
                                                                    key: 'connector',
                                                                    operators: [
                                                                        '=',
                                                                    ],
                                                                    propertyLabel:
                                                                        'Connector',
                                                                    groupValuesLabel:
                                                                        'Connector values',
                                                                },
                                                                {
                                                                    key: 'enable',
                                                                    operators: [
                                                                        '=',
                                                                    ],
                                                                    propertyLabel:
                                                                        'Has Scope Assigments',
                                                                    groupValuesLabel:
                                                                        'Has Scope Assigments values',
                                                                },
                                                                {
                                                                    key: 'family',
                                                                    operators: [
                                                                        '=',
                                                                    ],
                                                                    propertyLabel:
                                                                        'Family',
                                                                    groupValuesLabel:
                                                                        'Family values',
                                                                },
                                                            ]}
                                                        />
                                                    </Col>
                                                </Grid>
                                                <BenchmarkCards
                                                    benchmark={BenchmarkDetails}
                                                    all={AllBenchmarks}
                                                    loading={loading}
                                                />
                                                <Flex
                                                    className="w-full"
                                                    justifyContent="center"
                                                >
                                                    <Pagination
                                                        currentPageIndex={page}
                                                        pagesCount={totalPage}
                                                        onChange={({
                                                            detail,
                                                        }) =>
                                                            setPage(
                                                                detail.currentPageIndex
                                                            )
                                                        }
                                                    />
                                                </Flex>
                                            </Grid>
                                        </>
                                    )}
                                </Grid>
                            </div>
                        </main>
                    </div>
                </div>
            </Flex>
        </>
    )
}
