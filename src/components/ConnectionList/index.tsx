import { useState } from 'react'
import {
    Button,
    Card,
    Divider,
    Flex,
    List,
    ListItem,
    Select,
    SelectItem,
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
import DrawerPanel from '../DrawerPanel'
import Spinner from '../Spinner'
import { useOnboardApiV1ConnectionsSummaryList } from '../../api/onboard.gen'
import { filterAtom } from '../../store'
import { getConnectorIcon } from '../Cards/ConnectorCard'
import Tag from '../Tag'

export default function Filters() {
    const [openDrawer, setOpenDrawer] = useState(false)
    const [selectedFilters, setSelectedFilters] = useAtom(filterAtom)
    const [provider, setProvider] = useState(selectedFilters.provider)
    const [connections, setConnections] = useState(selectedFilters.connections)
    const [search, setSearch] = useState('')

    const { response, isLoading } = useOnboardApiV1ConnectionsSummaryList({
        connector: [],
        pageNumber: 1,
        pageSize: 10000,
        needCost: false,
        needResourceCount: false,
    })

    const connectionList = response?.connections

    const restFilters = () => {
        setProvider(selectedFilters.provider)
        setConnections(selectedFilters.connections)
    }

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
        <>
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
            <DrawerPanel
                open={openDrawer}
                onClose={() => {
                    setOpenDrawer(false)
                    restFilters()
                    setSearch('')
                }}
                title="Filters"
            >
                {isLoading ? (
                    <Flex className="mt-56">
                        <Spinner />
                    </Flex>
                ) : (
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        className="h-full w-full"
                    >
                        <Flex
                            flexDirection="col"
                            alignItems="start"
                            justifyContent="start"
                        >
                            <Flex
                                justifyContent="start"
                                className="flex-wrap gap-2 mb-6"
                            >
                                {provider.length ? (
                                    <Tag text={`Provider: ${provider}`} />
                                ) : (
                                    <Flex
                                        justifyContent="start"
                                        className="gap-2"
                                    >
                                        <Tag text="Provider: AWS" />
                                        <Tag text="Provider: Azure" />
                                    </Flex>
                                )}
                                {connections.map((c) => (
                                    <Tag
                                        key={c}
                                        text={`Connection ID: ${c}`}
                                        onClick={() => {
                                            setConnections((prevState) => {
                                                const arr = prevState
                                                arr.splice(
                                                    arr.indexOf(
                                                        String(
                                                            arr.find(
                                                                (s) => s === c
                                                            )
                                                        )
                                                    ),
                                                    1
                                                )
                                                return arr
                                            })
                                        }}
                                    />
                                ))}
                            </Flex>
                            <Title className="font-semibold mb-3">
                                Provider
                            </Title>
                            <Flex justifyContent="start" className="gap-4">
                                <label
                                    htmlFor="aws"
                                    className="flex items-center"
                                >
                                    <input
                                        id="aws"
                                        type="checkbox"
                                        value="AWS"
                                        checked={
                                            provider === 'AWS' ||
                                            provider === ''
                                        }
                                        onClick={() => {
                                            if (provider === 'AWS') {
                                                setProvider('Azure')
                                            } else if (provider === 'Azure') {
                                                setProvider('')
                                            } else {
                                                setProvider('AWS')
                                            }
                                        }}
                                        className="w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <Text className="font-semibold">AWS</Text>
                                </label>
                                <label
                                    htmlFor="azure"
                                    className="flex items-center"
                                >
                                    <input
                                        id="azure"
                                        type="checkbox"
                                        value="Azure"
                                        checked={
                                            provider === 'Azure' ||
                                            provider === ''
                                        }
                                        onClick={() => {
                                            if (provider === 'AWS') {
                                                setProvider('')
                                            } else if (provider === 'Azure') {
                                                setProvider('AWS')
                                            } else {
                                                setProvider('Azure')
                                            }
                                        }}
                                        className="w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <Text className="font-semibold">Azure</Text>
                                </label>
                            </Flex>
                            <Divider />
                            <Title className="font-semibold mb-3">
                                Connection Group
                            </Title>
                            <Select>
                                <SelectItem value="1">Group 1</SelectItem>
                            </Select>
                            <Divider />
                            <Flex justifyContent="start" className="gap-2">
                                <Title className="font-semibold mb-3">
                                    Connection
                                </Title>
                                {!!connections.length && (
                                    <Text className="mb-2.5">
                                        ({connections.length})
                                    </Text>
                                )}
                            </Flex>
                            <Flex className="relative">
                                <TextInput
                                    icon={MagnifyingGlassIcon}
                                    placeholder="Select connection by ID or name..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
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
                                                        key={connection.id}
                                                    >
                                                        <Flex
                                                            justifyContent="start"
                                                            className="py-1 cursor-pointer hover:bg-kaytu-50/50 rounded-lg"
                                                            onClick={() => {
                                                                if (
                                                                    !connections.includes(
                                                                        String(
                                                                            connection.providerConnectionID
                                                                        )
                                                                    )
                                                                ) {
                                                                    setConnections(
                                                                        (
                                                                            prevState
                                                                        ) => [
                                                                            ...prevState,
                                                                            connection.providerConnectionID ||
                                                                                '',
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
                        </Flex>
                        <Flex>
                            <Button
                                variant="light"
                                onClick={() => restFilters()}
                            >
                                Reset filters
                            </Button>
                            <Flex justifyContent="end" className="gap-4">
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
                                            connections,
                                        })
                                        setOpenDrawer(false)
                                        setSearch('')
                                    }}
                                >
                                    Apply
                                </Button>
                            </Flex>
                        </Flex>
                    </Flex>
                )}
            </DrawerPanel>
        </>
    )
}
