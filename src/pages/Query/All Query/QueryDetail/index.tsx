import { Link, useParams } from 'react-router-dom'
import { useAtomValue, useSetAtom } from 'jotai'
import {
    Button,
    Card,
    Flex,
    Grid,
    List,
    ListItem,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    Text,
    Title,
} from '@tremor/react'
import { useEffect } from 'react'
import ReactJson from '@microlink/react-json-view'
import { CheckCircleIcon, PlayCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import {
    GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus,
    GithubComKaytuIoKaytuEnginePkgComplianceApiResourceFinding,
    GithubComKaytuIoKaytuEnginePkgInventoryApiSmartQueryItem,
    GithubComKaytuIoKaytuEnginePkgInventoryApiSmartQueryItemV2,
} from '../../../../api/api'
import DrawerPanel from '../../../../components/DrawerPanel'
import { getConnectorIcon } from '../../../../components/Cards/ConnectorCard'
import SummaryCard from '../../../../components/Cards/SummaryCard'
import { useComplianceApiV1FindingsResourceCreate } from '../../../../api/compliance.gen'
import Spinner from '../../../../components/Spinner'
// import { severityBadge } from '../Controls'
import { isDemoAtom, notificationAtom, queryAtom } from '../../../../store'
// import Timeline from '../FindingsWithFailure/Detail/Timeline'
import { searchAtom } from '../../../../utilities/urlstate'
import { dateTimeDisplay } from '../../../../utilities/dateDisplay'
import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs' // eslint-disable-next-line import/no-extraneous-dependencies
import 'prismjs/components/prism-sql' // eslint-disable-next-line import/no-extraneous-dependencies
import 'prismjs/themes/prism.css'

interface IResourceFindingDetail {
    query:
        | GithubComKaytuIoKaytuEnginePkgInventoryApiSmartQueryItemV2
        | undefined
    open: boolean
    onClose: () => void
    onRefresh: () => void
    linkPrefix?: string
}

export default function QueryDetail({
    query,
    open,
    onClose,
    onRefresh,
    linkPrefix = '',
}: IResourceFindingDetail) {
    const { ws} = useParams()
    const setQuery = useSetAtom(queryAtom)

    // const { response, isLoading, sendNow } =
    //     useComplianceApiV1FindingsResourceCreate(
    //         { kaytuResourceId: resourceFinding?.kaytuResourceID || '' },
    //         {},
    //         false
    //     )
    const searchParams = useAtomValue(searchAtom)

    // useEffect(() => {
    //     if (resourceFinding && open) {
    //         sendNow()
    //     }
    // }, [resourceFinding, open])

    const isDemo = useAtomValue(isDemoAtom)

    // const finding = resourceFinding?.findings
    //     ?.filter((f) => f.controlID === controlID)
    //     .at(0)

    // const conformance = () => {
    //     if (showOnlyOneControl) {
    //         return (finding?.conformanceStatus || 0) ===
    //             GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus.ConformanceStatusFailed ? (
    //             <Flex className="w-fit gap-1.5">
    //                 <XCircleIcon className="h-4 text-rose-600" />
    //                 <Text>Failed</Text>
    //             </Flex>
    //         ) : (
    //             <Flex className="w-fit gap-1.5">
    //                 <CheckCircleIcon className="h-4 text-emerald-500" />
    //                 <Text>Passed</Text>
    //             </Flex>
    //         )
    //     }

    //     const failingControls = new Map<string, string>()
    //     resourceFinding?.findings?.forEach((f) => {
    //         failingControls.set(f.controlID || '', '')
    //     })

    //     return failingControls.size > 0 ? (
    //         <Flex className="w-fit gap-1.5">
    //             <XCircleIcon className="h-4 text-rose-600" />
    //             <Text>{failingControls.size} Failing</Text>
    //         </Flex>
    //     ) : (
    //         <Flex className="w-fit gap-1.5">
    //             <CheckCircleIcon className="h-4 text-emerald-500" />
    //             <Text>Passed</Text>
    //         </Flex>
    //     )
    // }

    return (
        <DrawerPanel
            open={open}
            onClose={onClose}
            title={
                <Flex justifyContent="start">
                    {getConnectorIcon(query?.connectors)}
                    <Title className="text-lg font-semibold ml-2 my-1">
                        {query?.title}
                    </Title>
                </Flex>
            }
        >
            <Grid className="w-full gap-4 mb-6" numItems={1}>
                <Flex
                    flexDirection="row"
                    justifyContent="between"
                    alignItems="start"
                    className="mt-2"
                >
                    <Text className="w-56 font-bold">ID : </Text>
                    <Text className="w-full">{query?.id}</Text>
                </Flex>
                <Flex
                    flexDirection="row"
                    justifyContent="between"
                    alignItems="start"
                    className="mt-2"
                >
                    <Text className="w-56 font-bold">Title : </Text>
                    <Text className="w-full">{query?.title}</Text>
                </Flex>{' '}
                <Flex
                    flexDirection="row"
                    justifyContent="between"
                    alignItems="start"
                    className="mt-2"
                >
                    <Text className="w-56 font-bold">Description : </Text>
                    <Text className="w-full">{query?.description}</Text>
                </Flex>{' '}
                <Flex
                    flexDirection="row"
                    justifyContent="between"
                    alignItems="start"
                    className="mt-2"
                >
                    <Text className="w-56 font-bold">Connector : </Text>
                    <Text className="w-full">
                        {query?.connectors?.map((item, index) => {
                            return `${item} `
                        })}
                    </Text>
                </Flex>
                <Flex
                    flexDirection="row"
                    justifyContent="between"
                    alignItems="start"
                    className="mt-2"
                >
                    <Text className="w-56 font-bold">Query Engine : </Text>
                    <Text className="w-full">
                        {/* @ts-ignore */}
                        {query?.query?.query_engine}
                    </Text>
                </Flex>
            </Grid>
            <TabGroup>
                <TabPanels>
                    <TabPanel>
                        <Flex flexDirection="row" className="mb-2">
                            <Title className="mb-2">Query</Title>

                            <Button
                                icon={PlayCircleIcon}
                                onClick={() => {
                                    // @ts-ignore
                                    setQuery(query?.query?.query_to_execute)
                                }}
                                disabled={false}
                                loading={false}
                                loadingText="Running"
                            >
                                <Link to={`/ws/${ws}/query`}>Run in Query</Link>{' '}
                            </Button>
                        </Flex>
                        <Card className=" py-3 mb-2 relative ">
                            <Editor
                                onValueChange={(text) => {
                                    console.log(text)
                                }}
                                highlight={(text) =>
                                    highlight(text, languages.sql, 'sql')
                                }
                                // @ts-ignore
                                value={query?.query?.query_to_execute}
                                className="w-full bg-white dark:bg-gray-900 dark:text-gray-50 font-mono text-sm"
                                style={{
                                    minHeight: '200px',
                                    // maxHeight: '500px',
                                    overflowY: 'scroll',
                                }}
                                placeholder="-- write your SQL query here"
                                disabled={true}
                            />
                        </Card>
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </DrawerPanel>
    )
}
