import React, { useState } from 'react'
import { Button, Flex, Grid } from '@tremor/react'
import Menu from '../../components/Menu'
import { useWorkspaceApiV1WorkspacesList } from '../../api/workspace.gen'
import WorkspaceCard from '../../components/Cards/WorkspaceCard'
import CreateWorkspace from './CreateWorkspace'
import Spinner from '../../components/Spinner'
import { isDemo } from '../../utilities/demo'
import Header from '../../components/Header'

export default function Workspaces() {
    const [openDrawer, setOpenDrawer] = useState(false)
    const {
        response: workspaces,
        isLoading,
        sendNow: refreshList,
    } = useWorkspaceApiV1WorkspacesList()

    return (
        <Menu currentPage="assets" showSidebar={false}>
            {isLoading ? (
                <Flex justifyContent="center" className="mt-56">
                    <Spinner />
                </Flex>
            ) : (
                <Flex justifyContent="center" flexDirection="row">
                    <div className="max-w-6xl w-2/3">
                        <Header>
                            <Button
                                variant="secondary"
                                onClick={() => setOpenDrawer(true)}
                            >
                                Add new Kaytu instance
                            </Button>
                        </Header>
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
        </Menu>
    )
}
