import React, { useMemo, useState } from 'react'
import { useAtom } from 'jotai'
import {
    Badge,
    Button,
    Card,
    DateRangePicker,
    Flex,
    Grid,
    Metric,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    Text,
    Title,
} from '@tremor/react'
import { FunnelIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import Composition from '../../components/Blocks/Composition'
import Region from '../../components/Blocks/Region'
import LoggedInLayout from '../../components/LoggedInLayout'
import { filterAtom, timeAtom } from '../../store'
import { useInventoryApiV2ResourcesTagList } from '../../api/inventory.gen'
import { useOnboardApiV1SourcesList } from '../../api/onboard.gen'
import { useWorkspaceApiV1WorkspacesList } from '../../api/workspace.gen'

const Workspaces: React.FC<any> = () => {
    const navigate = useNavigate()
    const {
        response: workspaces,
        isLoading,
        error,
    } = useWorkspaceApiV1WorkspacesList()

    return (
        <LoggedInLayout>
            <main>
                <Flex
                    flexDirection="row"
                    justifyContent="between"
                    alignItems="center"
                >
                    <Title>Workspaces</Title>
                </Flex>

                <TabGroup className="mt-6">
                    <TabPanels>
                        <TabPanel>
                            <Grid
                                numItemsMd={workspaces?.length || 0}
                                className="mt-20 gap-6 flex justify-between"
                            >
                                {workspaces?.map((ws) => {
                                    return (
                                        <Card
                                            className="max-w-xs mx-auto"
                                            decoration="top"
                                            decorationColor="indigo"
                                            onClick={() => {
                                                navigate(`/${ws.name}`)
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <Metric>{ws.name}</Metric>
                                            <Text>{`id:${ws.id}`}</Text>
                                            <Text>
                                                {`createdAt:${ws.createdAt}`}
                                            </Text>
                                            <Text>{`uri:${ws.uri}`}</Text>
                                            <Badge size="xs">
                                                Version: {ws.version}
                                            </Badge>
                                            <Badge size="xs">
                                                Status: {ws.status}
                                            </Badge>
                                            <Badge size="xs">
                                                Tier: {ws.tier}
                                            </Badge>
                                        </Card>
                                    )
                                })}
                            </Grid>
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </main>
        </LoggedInLayout>
    )
}

export default Workspaces
