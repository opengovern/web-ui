import React, { useState } from 'react'
import { Button, Flex, Grid, Title } from '@tremor/react'
import { useAtomValue } from 'jotai'
import LoggedInLayout from '../../components/LoggedInLayout'
import { useWorkspaceApiV1WorkspacesList } from '../../api/workspace.gen'
import WorkspaceCard from '../../components/Cards/WorkspaceCard'
import CreateWorkspace from './CreateWorkspace'
import Spinner from '../../components/Spinner'
import { isDemoAtom } from '../../store'

export default function Workspaces() {
    const isDemo = useAtomValue(isDemoAtom)
    const [openDrawer, setOpenDrawer] = useState(false)
    const {
        response: workspaces,
        isLoading,
        sendNow: refreshList,
    } = useWorkspaceApiV1WorkspacesList({
        ...(isDemo && { headers: { prefer: 'dynamic=false' } }),
    })

    return (
        <LoggedInLayout currentPage="assets" showSidebar={false}>
            {isLoading ? (
                <Flex justifyContent="center" className="mt-56">
                    <Spinner />
                </Flex>
            ) : (
                <Flex justifyContent="center" flexDirection="row">
                    <div className="max-w-6xl w-2/3">
                        <Flex flexDirection="row" className="mb-6">
                            <Title>Your Workspaces</Title>
                            <Button
                                variant="secondary"
                                onClick={() => setOpenDrawer(true)}
                            >
                                Add new Kaytu instance
                            </Button>
                        </Flex>
                        <CreateWorkspace
                            open={openDrawer}
                            onClose={() => {
                                setOpenDrawer(false)
                                refreshList()
                            }}
                        />
                        <Grid numItems={1} className="gap-4">
                            {workspaces?.map((ws) => {
                                return (
                                    <WorkspaceCard
                                        workspace={ws}
                                        refreshList={refreshList}
                                    />
                                )
                            })}
                        </Grid>
                    </div>
                </Flex>
            )}
        </LoggedInLayout>
    )
}
