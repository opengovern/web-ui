import { useEffect, useState } from 'react'
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
import { FunnelIcon as FunnelIconSolid } from '@heroicons/react/24/solid'
import {
    FunnelIcon as FunnelIconOutline,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { useAtom } from 'jotai'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import {
    useOnboardApiV1ConnectionGroupsList,
    useOnboardApiV1ConnectionsSummaryList,
} from '../../api/onboard.gen'
import { filterAtom } from '../../store'
import { getConnectorIcon } from '../Cards/ConnectorCard'
import Tag from '../Tag'

export default function Filters() {
    const [openDrawer, setOpenDrawer] = useState(false)
    const [selectedFilters, setSelectedFilters] = useAtom(filterAtom)
    const [provider, setProvider] = useState(selectedFilters.provider)
    const [connectionGroup, setConnectionGroup] = useState(
        selectedFilters.connectionGroup
    )
    const [search, setSearch] = useState('')
    const { response: groupList } = useOnboardApiV1ConnectionGroupsList()
    const { response, isLoading } = useOnboardApiV1ConnectionsSummaryList({
        connector: [],
        pageNumber: 1,
        pageSize: 10000,
        needCost: false,
        needResourceCount: false,
    })
    const [selectedIndex, setSelectedIndex] = useState(0)
    const findConnections = () => {
        const conn = []
        if (response) {
            for (let i = 0; i < selectedFilters.connections.length; i += 1) {
                conn.push(
                    response?.connections?.find(
                        (c) => c.id === selectedFilters.connections[i]
                    )
                )
            }
        }
        return conn
    }
    const [connections, setConnections] = useState(findConnections)

    const connectionID = (list: any) => {
        const idList = []
        if (list) {
            for (let i = 0; i < list.length; i += 1) {
                idList.push(list[i].id)
            }
        }
        return idList
    }

    const connectionList = response?.connections

    const restFilters = () => {
        setProvider(selectedFilters.provider)
        setConnections(findConnections)
    }

    useEffect(() => {
        restFilters()
    }, [selectedIndex])

    useEffect(() => setSelectedIndex(0), [openDrawer])

    const filterText = () => {
        if (selectedFilters.connections.length > 0) {
            return `${selectedFilters.connections.length} filters`
        }
        if (selectedFilters.provider !== '') {
            return selectedFilters.provider
        }
        return 'Filters'
    }

    return (
        <div className="relative">
            <Button
                variant="secondary"
                className="ml-4 h-9"
                onClick={() => setOpenDrawer(true)}
                icon={
                    selectedFilters.connections.length > 0 ||
                    selectedFilters.provider !== ''
                        ? FunnelIconSolid
                        : FunnelIconOutline
                }
            >
                {filterText()}
            </Button>
            {openDrawer && (
                <>
                    <button
                        type="button"
                        onClick={() => {
                            restFilters()
                            setOpenDrawer(false)
                            setSearch('')
                        }}
                        className="cursor-default opacity-0 top-0 left-0 z-10 fixed w-screen h-screen"
                    >
                        filters
                    </button>
                    <Card className="w-fit border border-gray-300 shadow-lg mt-2.5 p-4 z-20 absolute top-full right-0">
                        <TabGroup
                            index={selectedIndex}
                            onIndexChange={setSelectedIndex}
                            className="w-fit rounded-lg"
                        >
                            <TabList variant="solid" className="mb-4">
                                <Tab className="pt-0.5 pb-1">
                                    <Text>Provider</Text>
                                </Tab>
                                <Tab className="pt-0.5 pb-1">
                                    <Text>Group</Text>
                                </Tab>
                                <Tab className="pt-0.5 pb-1">
                                    <Text>Connection</Text>
                                </Tab>
                                <Tab className="pt-0.5 pb-1" disabled>
                                    <Text>Saved</Text>
                                </Tab>
                            </TabList>
                            <TabPanels className="px-2">
                                <TabPanel>
                                    <Title className="mb-3">Provider</Title>
                                    <Flex
                                        justifyContent="start"
                                        className="gap-6"
                                    >
                                        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
                                        <label
                                            onClick={() => setProvider('')}
                                            htmlFor="all"
                                            className="flex items-center gap-2"
                                        >
                                            <input
                                                id="all"
                                                type="radio"
                                                checked={provider === ''}
                                            />
                                            <Text>All</Text>
                                        </label>
                                        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
                                        <label
                                            onClick={() => setProvider('AWS')}
                                            htmlFor="aws"
                                            className="flex items-center gap-2"
                                        >
                                            <input
                                                id="aws"
                                                type="radio"
                                                checked={provider === 'AWS'}
                                            />
                                            <Text>AWS</Text>
                                        </label>
                                        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
                                        <label
                                            onClick={() => setProvider('Azure')}
                                            htmlFor="azure"
                                            className="flex items-center gap-2"
                                        >
                                            <input
                                                id="azure"
                                                type="radio"
                                                checked={provider === 'Azure'}
                                            />
                                            <Text>Azure</Text>
                                        </label>
                                    </Flex>
                                </TabPanel>
                                <TabPanel>
                                    <Flex
                                        justifyContent="start"
                                        alignItems="end"
                                        className="gap-1 mb-3"
                                    >
                                        <Title>Connection Groups</Title>
                                        <Text className="mb-0.5">
                                            ( up to 3 groups )
                                        </Text>
                                    </Flex>
                                    <Select
                                        value={connectionGroup}
                                        placeholder={
                                            connectionGroup.length
                                                ? `${
                                                      connectionGroup.length
                                                  } group${
                                                      connectionGroup.length > 1
                                                          ? 's'
                                                          : ''
                                                  } selected`
                                                : 'Select connection group...'
                                        }
                                        className="mb-6"
                                    >
                                        <>
                                            <SelectItem
                                                value=""
                                                onClick={() =>
                                                    setConnectionGroup('')
                                                }
                                            >
                                                Select none
                                            </SelectItem>
                                            {groupList?.map((cg) => (
                                                <SelectItem
                                                    value={cg.name || ''}
                                                    onClick={() =>
                                                        setConnectionGroup(
                                                            cg.name || ''
                                                        )
                                                    }
                                                >
                                                    {cg.name}
                                                </SelectItem>
                                            ))}
                                        </>
                                    </Select>
                                    <Flex
                                        justifyContent="start"
                                        className="gap-3 flex-wrap"
                                    >
                                        {!!connectionGroup.length && (
                                            <Tag
                                                text={connectionGroup}
                                                onClick={() =>
                                                    setConnectionGroup('')
                                                }
                                            />
                                        )}
                                    </Flex>
                                </TabPanel>
                                <TabPanel>
                                    <Flex
                                        justifyContent="start"
                                        alignItems="end"
                                        className="gap-1 mb-3"
                                    >
                                        <Title>Connections</Title>
                                        <Text className="mb-0.5">
                                            ( up to 20 connections )
                                        </Text>
                                    </Flex>
                                    <Flex className="relative">
                                        <TextInput
                                            icon={MagnifyingGlassIcon}
                                            placeholder="Search connection by ID or name..."
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                        />
                                        {!!search.length && (
                                            <Card className="absolute top-full mt-1.5 shadow-lg py-2 px-3 max-h-[228px] overflow-y-scroll">
                                                <List>
                                                    {connectionList
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
                                                                        if (
                                                                            !connections.includes(
                                                                                connection
                                                                            )
                                                                        ) {
                                                                            setConnections(
                                                                                (
                                                                                    prevState
                                                                                ) => [
                                                                                    ...prevState,
                                                                                    connection,
                                                                                ]
                                                                            )
                                                                            setSearch(
                                                                                ''
                                                                            )
                                                                        }
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
                                    {connections.length > 0 && (
                                        <div className="mt-6" />
                                    )}
                                    <Flex
                                        justifyContent="start"
                                        className="gap-3 flex-wrap"
                                    >
                                        {connections.map((c) => (
                                            <Tag
                                                key={c?.id}
                                                text={c?.providerConnectionName}
                                                onClick={() => {
                                                    setConnections(
                                                        (prevState) => {
                                                            const arr =
                                                                prevState
                                                            arr.splice(
                                                                arr.indexOf(
                                                                    arr.find(
                                                                        (s) =>
                                                                            s?.id ===
                                                                            c?.id
                                                                    )
                                                                ),
                                                                1
                                                            )
                                                            return arr
                                                        }
                                                    )
                                                }}
                                            />
                                        ))}
                                    </Flex>
                                </TabPanel>
                            </TabPanels>
                        </TabGroup>
                        <Flex className="mt-8">
                            <Button
                                variant="light"
                                onClick={() => restFilters()}
                            >
                                Reset filters
                            </Button>
                            <Flex className="w-fit gap-2">
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        restFilters()
                                        setOpenDrawer(false)
                                        setSearch('')
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => {
                                        setSelectedFilters({
                                            provider,
                                            connections:
                                                connectionID(connections),
                                            connectionGroup,
                                        })
                                        setOpenDrawer(false)
                                        setSearch('')
                                    }}
                                >
                                    Apply
                                </Button>
                            </Flex>
                        </Flex>
                    </Card>
                </>
            )}
        </div>
    )
}
