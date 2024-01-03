import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    Button,
    Card,
    Divider,
    Flex,
    Text,
    TextInput,
} from '@tremor/react'
import { Checkbox, Radio, useCheckboxState } from 'pretty-checkbox-react'
import { useState } from 'react'
import {
    CheckCircleIcon,
    MagnifyingGlassIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline'
import { AWSIcon, AzureIcon } from '../../../../../icons/icons'
import Spinner from '../../../../../components/Spinner'
import { benchmarkList } from '../../../Compliance'
import { useIntegrationApiV1ConnectionsSummariesList } from '../../../../../api/integration.gen'
import {
    useComplianceApiV1BenchmarksSummaryList,
    useComplianceApiV1FindingsFiltersCreate,
} from '../../../../../api/compliance.gen'
import {
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityConnection,
    SourceType,
} from '../../../../../api/api'
import { compareArrays } from '../../../../../components/Filter'

const severity = [
    { name: 'Critical', color: '#6E120B' },
    { name: 'High', color: '#CA2B1D' },
    { name: 'Medium', color: '#EE9235' },
    { name: 'Low', color: '#F4C744' },
    { name: 'None', color: '#9BA2AE' },
]

const filteredConnectionsList = (
    connection:
        | GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityConnection[]
        | undefined,
    filter: string
) => {
    const result = connection?.filter(
        (c) =>
            c?.providerConnectionName
                ?.toLowerCase()
                .includes(filter.toLowerCase()) ||
            c?.providerConnectionID
                ?.toLowerCase()
                .includes(filter.toLowerCase())
    )
    const count = result?.length || 0
    return {
        result,
        count,
    }
}

interface IFindingsFilter {
    providerFilter: SourceType[]
    statusFilter: string[]
    connectionFilter: string[]
    benchmarkFilter: string[]
    resourceFilter: string[]
    severityFilter: string[]
    onApply: (obj: {
        provider: SourceType[]
        status: string[]
        connection: string[]
        benchmark: string[]
        resource: string[]
        severity: string[]
    }) => void
}

export default function FindingFilters({
    providerFilter,
    statusFilter,
    connectionFilter,
    benchmarkFilter,
    resourceFilter,
    severityFilter,
    onApply,
}: IFindingsFilter) {
    const [connectionSearch, setConnectionSearch] = useState('')
    const [resourceSearch, setResourceSearch] = useState('')

    const [provider, setProvider] = useState('')
    const [status, setStatus] = useState(['alarm', 'info', 'skip', 'error'])
    const connectionCheckbox = useCheckboxState({ state: [] })
    const benchmarkCheckbox = useCheckboxState({ state: [] })
    const resourceCheckbox = useCheckboxState({ state: [] })
    const severityCheckbox = useCheckboxState({
        state: ['critical', 'high', 'medium', 'low', 'none'],
    })

    const applyFilters = () => {
        return {
            provider: provider.length ? [provider] : [],
            status,
            connection: connectionCheckbox.state,
            benchmark: benchmarkCheckbox.state,
            resource: resourceCheckbox.state,
            severity: severityCheckbox.state,
        }
    }
    const showApply = () => {
        return (
            !compareArrays(
                providerFilter,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                provider.length ? [provider] : []
            ) ||
            !compareArrays(statusFilter.sort(), status.sort()) ||
            !compareArrays(
                connectionFilter.sort(),
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                connectionCheckbox.state.sort()
            ) ||
            !compareArrays(
                benchmarkFilter.sort(),
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                benchmarkCheckbox.state.sort()
            ) ||
            !compareArrays(
                resourceFilter.sort(),
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                resourceCheckbox.state.sort()
            ) ||
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            !compareArrays(severityFilter.sort(), severityCheckbox.state.sort())
        )
    }

    const resetFilters = () => {
        setProvider('')
        setStatus(['alarm', 'info', 'skip', 'error'])
        connectionCheckbox.setState([])
        benchmarkCheckbox.setState([])
        resourceCheckbox.setState([])
        severityCheckbox.setState(['critical', 'high', 'medium', 'low', 'none'])

        return {
            provider: [],
            status: ['alarm', 'info', 'skip', 'error'],
            connection: [],
            benchmark: [],
            resource: [],
            severity: ['critical', 'high', 'medium', 'low', 'none'],
        }
    }
    const showReset = () => {
        return (
            providerFilter.length ||
            statusFilter.length !== 4 ||
            connectionFilter.length ||
            benchmarkFilter.length ||
            resourceFilter.length ||
            !compareArrays(
                severityFilter.sort(),
                ['critical', 'high', 'medium', 'low', 'none'].sort()
            )
        )
    }
    const { response: connections, isLoading: connectionsLoading } =
        useIntegrationApiV1ConnectionsSummariesList({
            connector: providerFilter,
            pageNumber: 1,
            pageSize: 2000,
            needCost: false,
            needResourceCount: false,
        })
    const { response: benchmarks, isLoading: benchmarksLoading } =
        useComplianceApiV1BenchmarksSummaryList({
            connector: providerFilter,
            connectionId: connectionFilter,
        })
    const { response: filters, isLoading: filtersLoading } =
        useComplianceApiV1FindingsFiltersCreate({})
    return (
        <Card className="sticky top-6 min-w-[300px] max-w-[300px]">
            <Accordion
                defaultOpen
                className="border-0 rounded-none bg-transparent mb-1"
            >
                <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                    <Text className="font-semibold text-gray-800">
                        Cloud provider
                    </Text>
                </AccordionHeader>
                <AccordionBody className="pt-3 pb-1 px-0.5 w-full cursor-default bg-transparent">
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        className="gap-1.5"
                    >
                        <Radio
                            name="provider"
                            onClick={() => setProvider('')}
                            checked={provider === ''}
                        >
                            All
                        </Radio>
                        <Radio
                            name="provider"
                            onClick={() => setProvider('AWS')}
                            checked={provider === 'AWS'}
                        >
                            <Flex className="gap-1">
                                <img src={AWSIcon} className="w-6" alt="aws" />
                                <Text>AWS</Text>
                            </Flex>
                        </Radio>
                        <Radio
                            name="provider"
                            onClick={() => setProvider('Azure')}
                            checked={provider === 'Azure'}
                        >
                            <Flex className="gap-1">
                                <img
                                    src={AzureIcon}
                                    className="w-6 rounded-full"
                                    alt="azure"
                                />
                                <Text>Azure</Text>
                            </Flex>
                        </Radio>
                    </Flex>
                </AccordionBody>
            </Accordion>
            <Divider className="my-3" />
            <Accordion
                defaultOpen
                className="border-0 rounded-none bg-transparent mb-1"
            >
                <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                    <Text className="font-semibold text-gray-800">
                        Conformance status
                    </Text>
                </AccordionHeader>
                <AccordionBody className="pt-3 pb-1 px-0.5 w-full cursor-default bg-transparent">
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        className="gap-1.5"
                    >
                        <Radio
                            name="status"
                            onClick={() =>
                                setStatus([
                                    'ok',
                                    'alarm',
                                    'info',
                                    'skip',
                                    'error',
                                ])
                            }
                            checked={status.length === 5}
                        >
                            All
                        </Radio>
                        <Radio
                            name="status"
                            onClick={() => setStatus(['ok'])}
                            checked={
                                status.length === 1 && status.includes('ok')
                            }
                        >
                            <Flex className="gap-1">
                                <CheckCircleIcon className="w-4 text-emerald-500" />
                                <Text>Passed</Text>
                            </Flex>
                        </Radio>
                        <Radio
                            name="status"
                            onClick={() =>
                                setStatus(['alarm', 'info', 'skip', 'error'])
                            }
                            checked={status.length === 4}
                        >
                            <Flex className="gap-1">
                                <XCircleIcon className="w-4 text-rose-600" />
                                <Text>Failed</Text>
                            </Flex>
                        </Radio>
                    </Flex>
                </AccordionBody>
            </Accordion>
            <Divider className="my-3" />
            <Accordion
                defaultOpen
                className="border-0 rounded-none bg-transparent mb-1"
            >
                <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                    <Text className="font-semibold text-gray-800">
                        Severity
                    </Text>
                </AccordionHeader>
                <AccordionBody className="pt-3 pb-1 px-0.5 w-full cursor-default bg-transparent">
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        className="gap-1.5"
                    >
                        {severity.map((s) => (
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            <Checkbox
                                shape="curve"
                                className="!items-start"
                                value={s.name.toLowerCase()}
                                {...severityCheckbox}
                            >
                                <Flex className="gap-1.5">
                                    <div
                                        className="h-4 w-1.5 rounded-sm"
                                        style={{
                                            backgroundColor: s.color,
                                        }}
                                    />
                                    <Text>{s.name}</Text>
                                </Flex>
                            </Checkbox>
                        ))}
                    </Flex>
                </AccordionBody>
            </Accordion>
            <Divider className="my-3" />
            <Accordion className="border-0 rounded-none bg-transparent mb-1">
                <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                    <Text className="font-semibold text-gray-800">
                        Cloud accounts
                    </Text>
                </AccordionHeader>
                <AccordionBody className="pt-3 pb-1 px-0.5 w-full cursor-default bg-transparent">
                    <TextInput
                        icon={MagnifyingGlassIcon}
                        placeholder="Search cloud accounts..."
                        value={connectionSearch}
                        onChange={(e) => setConnectionSearch(e.target.value)}
                        className="mb-4"
                    />
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        className="px-0.5 gap-2.5 max-h-[200px] overflow-y-scroll overflow-x-hidden"
                    >
                        {connectionsLoading ? (
                            <Spinner />
                        ) : (
                            <>
                                {filteredConnectionsList(
                                    connections?.connections,
                                    connectionSearch
                                ).result?.map(
                                    (con, i) =>
                                        i < 100 && (
                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                            // @ts-ignore
                                            <Checkbox
                                                shape="curve"
                                                className="!items-start"
                                                value={con.id}
                                                {...connectionCheckbox}
                                            >
                                                <Flex
                                                    flexDirection="col"
                                                    alignItems="start"
                                                    className="-mt-0.5"
                                                >
                                                    <Text className="text-gray-800 truncate">
                                                        {
                                                            con.providerConnectionName
                                                        }
                                                    </Text>
                                                    <Text className="text-xs truncate">
                                                        {
                                                            con.providerConnectionID
                                                        }
                                                    </Text>
                                                </Flex>
                                            </Checkbox>
                                        )
                                )}
                                <Flex justifyContent="end">
                                    <Text>
                                        {filteredConnectionsList(
                                            connections?.connections,
                                            connectionSearch
                                        ).count > 100
                                            ? `+ ${
                                                  filteredConnectionsList(
                                                      connections?.connections,
                                                      connectionSearch
                                                  ).count - 100
                                              } more`
                                            : ''}
                                    </Text>
                                </Flex>
                            </>
                        )}
                    </Flex>
                </AccordionBody>
            </Accordion>
            <Divider className="my-3" />
            <Accordion className="border-0 rounded-none bg-transparent mb-1">
                <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                    <Text className="text-gray-800 font-semibold">
                        Benchmarks
                    </Text>
                </AccordionHeader>
                <AccordionBody className="pt-3 pb-1 px-0.5 w-full cursor-default bg-transparent">
                    {benchmarksLoading ? (
                        <Spinner />
                    ) : (
                        <Flex
                            flexDirection="col"
                            alignItems="start"
                            className="px-0.5 gap-2.5"
                        >
                            {benchmarkList(
                                benchmarks?.benchmarkSummary
                            ).connected?.map((ben) => (
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                <Checkbox
                                    shape="curve"
                                    className="!items-start"
                                    value={ben.id}
                                    {...benchmarkCheckbox}
                                >
                                    {ben.title}
                                </Checkbox>
                            ))}
                        </Flex>
                    )}
                </AccordionBody>
            </Accordion>
            <Divider className="my-3" />
            <Accordion className="border-0 rounded-none bg-transparent mb-1">
                <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                    <Text className="text-gray-800 font-semibold">
                        Resource types
                    </Text>
                </AccordionHeader>
                <AccordionBody className="pt-3 pb-1 px-0.5 w-full cursor-default bg-transparent">
                    <TextInput
                        icon={MagnifyingGlassIcon}
                        placeholder="Search resource types..."
                        value={resourceSearch}
                        onChange={(e) => setResourceSearch(e.target.value)}
                        className="mb-4"
                    />
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        className="px-0.5 gap-2.5 max-h-[200px] overflow-y-scroll overflow-x-hidden"
                    >
                        {filtersLoading ? (
                            <Spinner />
                        ) : (
                            filters?.resourceTypeID
                                ?.filter(
                                    (p) =>
                                        p.displayName
                                            ?.toLowerCase()
                                            .includes(
                                                resourceSearch.toLowerCase()
                                            ) ||
                                        p.key
                                            ?.toLowerCase()
                                            .includes(
                                                resourceSearch.toLowerCase()
                                            )
                                )
                                .map((p, i) => (
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    <Checkbox
                                        shape="curve"
                                        className="!items-start"
                                        value={p.key}
                                        {...resourceCheckbox}
                                    >
                                        <Flex
                                            flexDirection="col"
                                            alignItems="start"
                                            className="-mt-0.5"
                                        >
                                            <Text className="text-gray-800 truncate">
                                                {p.displayName}
                                            </Text>
                                            <Text className="text-xs truncate">
                                                {p.key}
                                            </Text>
                                        </Flex>
                                    </Checkbox>
                                ))
                        )}
                    </Flex>
                </AccordionBody>
            </Accordion>
            <Flex flexDirection="row-reverse">
                {showApply() && (
                    <Button
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        onClick={() => onApply(applyFilters())}
                        className="mt-4"
                    >
                        Apply
                    </Button>
                )}
                {showReset() && (
                    <Button
                        variant="light"
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        onClick={() => onApply(resetFilters())}
                        className="mt-4"
                    >
                        Reset filters
                    </Button>
                )}
            </Flex>
        </Card>
    )
}
