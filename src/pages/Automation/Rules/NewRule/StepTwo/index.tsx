import {
    Button,
    Card,
    Flex,
    List,
    ListItem,
    Select,
    SelectItem,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    Text,
    TextInput,
    Title,
} from '@tremor/react'
import 'react-querybuilder/dist/query-builder.css'
import { QueryBuilder, RuleGroupType } from 'react-querybuilder'
import { useEffect, useState } from 'react'
import {
    MagnifyingGlassIcon,
    MinusIcon,
    PlusIcon,
} from '@heroicons/react/24/outline'
import { useOnboardApiV1ConnectionGroupsList } from '../../../../../api/onboard.gen'
import Spinner from '../../../../../components/Spinner'
import { getConnectorIcon } from '../../../../../components/Cards/ConnectorCard'
import { useIntegrationApiV1ConnectionsSummariesList } from '../../../../../api/integration.gen'

interface IStep {
    onNext: (
        query: string,
        scope: {
            connection_group?: string
            connection_id?: string
        }
    ) => void
    onBack: () => void
}

export default function StepTwo({ onNext, onBack }: IStep) {
    const [query, setQuery] = useState<RuleGroupType>({
        combinator: 'and',
        rules: [{ field: 'score', operator: '<', value: '80' }],
    })
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [connectionGroup, setConnectionGroup] = useState('')
    const [connections, setConnections] = useState<any>('')
    const [search, setSearch] = useState('')

    const [hasScope, setHasScope] = useState(false)

    const { response: groupList, isLoading: groupListLoading } =
        useOnboardApiV1ConnectionGroupsList()
    const { response, isLoading } = useIntegrationApiV1ConnectionsSummariesList(
        {
            connector: [],
            pageNumber: 1,
            pageSize: 10000,
            needCost: false,
            needResourceCount: false,
        }
    )

    useEffect(() => {
        setConnections('')
        setConnectionGroup('')
    }, [selectedIndex, hasScope])

    const queryCreator = () => {
        let temp = JSON.stringify(query)
        temp = temp.replaceAll('combinator', 'condition_type')
        temp = temp.replaceAll('operator', 'operator_type')
        temp = temp.replaceAll('rules', 'operator')

        const re = /value":\s*"([-\d.]+)"/i
        temp = temp.replace(re, 'value": $1')

        return JSON.parse(temp)
    }

    return (
        <Flex flexDirection="col" style={{ height: 'calc(100% - 60px)' }}>
            <Flex flexDirection="col" alignItems="start">
                <Flex justifyContent="start" className="gap-1 mb-6">
                    <Text>2/4.</Text>
                    <Text className="text-gray-800 font-semibold">
                        Condition
                    </Text>
                </Flex>
                <QueryBuilder
                    fields={[
                        {
                            name: 'score',
                            label: 'Score (%)',
                            datatype: 'number',
                        },
                    ]}
                    operators={[
                        { name: '<', label: '<' },
                        { name: '>', label: '>' },
                    ]}
                    query={query}
                    onQueryChange={(q) => setQuery(q)}
                />
                <Flex justifyContent="end" className="mt-12 mb-3">
                    <Button
                        variant="light"
                        icon={hasScope ? MinusIcon : PlusIcon}
                        onClick={() => setHasScope(!hasScope)}
                    >
                        {hasScope ? 'Remove scope' : 'Add scope'}
                    </Button>
                </Flex>
                {hasScope && (
                    <TabGroup
                        index={selectedIndex}
                        onIndexChange={setSelectedIndex}
                    >
                        <TabList>
                            <Tab>Group</Tab>
                            <Tab>Connection</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Title className="mb-3">Connection Group</Title>
                                {groupListLoading ? (
                                    <Spinner />
                                ) : (
                                    <Select
                                        enableClear={false}
                                        value={connectionGroup}
                                        onChange={(v) => {
                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                            // @ts-ignore
                                            setConnectionGroup(v)
                                        }}
                                        placeholder={
                                            connectionGroup.length
                                                ? connectionGroup
                                                : 'Select connection group...'
                                        }
                                    >
                                        <div>
                                            {groupList?.map((cg) => (
                                                <SelectItem
                                                    value={String(cg.name)}
                                                >
                                                    {cg.name}
                                                </SelectItem>
                                            ))}
                                        </div>
                                    </Select>
                                )}
                            </TabPanel>
                            <TabPanel>
                                <Title className="mb-3">Connection</Title>
                                {isLoading ? (
                                    <Spinner />
                                ) : (
                                    <Flex className="relative">
                                        <TextInput
                                            icon={MagnifyingGlassIcon}
                                            placeholder={
                                                connections.id
                                                    ? connections.providerConnectionName
                                                    : 'Search connection by ID or name...'
                                            }
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                        />
                                        {!!search.length && (
                                            <Card className="absolute z-10 top-full mt-1.5 shadow-lg py-2 px-3 max-h-[228px] overflow-y-scroll">
                                                <List>
                                                    {response?.connections
                                                        ?.filter(
                                                            (c) =>
                                                                c?.providerConnectionName
                                                                    ?.toLowerCase()
                                                                    .includes(
                                                                        search.toLowerCase()
                                                                    ) ||
                                                                c?.providerConnectionID
                                                                    ?.toLowerCase()
                                                                    .includes(
                                                                        search.toLowerCase()
                                                                    )
                                                        )
                                                        .map((connection) => (
                                                            <ListItem
                                                                className="py-1"
                                                                key={
                                                                    connection.id
                                                                }
                                                            >
                                                                <Flex
                                                                    justifyContent="start"
                                                                    className="py-1 cursor-pointer hover:bg-kaytu-50/50 rounded-lg"
                                                                    onClick={() => {
                                                                        setConnections(
                                                                            connection
                                                                        )
                                                                        setSearch(
                                                                            ''
                                                                        )
                                                                    }}
                                                                >
                                                                    {getConnectorIcon(
                                                                        connection.connector
                                                                    )}
                                                                    <Flex
                                                                        flexDirection="col"
                                                                        alignItems="start"
                                                                    >
                                                                        <Text className="text-gray-800">
                                                                            {
                                                                                connection.providerConnectionName
                                                                            }
                                                                        </Text>
                                                                        <Text className="text-xs">
                                                                            {
                                                                                connection.providerConnectionID
                                                                            }
                                                                        </Text>
                                                                    </Flex>
                                                                </Flex>
                                                            </ListItem>
                                                        ))}
                                                </List>
                                            </Card>
                                        )}
                                    </Flex>
                                )}
                            </TabPanel>
                        </TabPanels>
                    </TabGroup>
                )}
            </Flex>
            <Flex justifyContent="end" className="gap-4">
                <Button variant="secondary" onClick={onBack}>
                    Back
                </Button>
                <Button
                    onClick={() =>
                        onNext(queryCreator(), {
                            ...(connections.id && {
                                connection_id: connections.id
                                    ? connections.id
                                    : '',
                            }),
                            ...(connectionGroup.length > 0 && {
                                connection_group: connectionGroup,
                            }),
                        })
                    }
                >
                    Next
                </Button>
            </Flex>
        </Flex>
    )
}
