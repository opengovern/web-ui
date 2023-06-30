import React, { useEffect, useState } from 'react'
import { Button, Col, Flex, Grid, Title } from '@tremor/react'
import LoggedInLayout from '../../components/LoggedInLayout'
import { useWorkspaceApiV1WorkspacesList } from '../../api/workspace.gen'
import WorkspaceCard from '../../components/Cards/WorkspaceCard'
import CreateWorkspace from './CreateWorkspace'

export default function Workspaces() {
    const [openDrawer, setOpenDrawer] = useState(false)
    const { response: workspaces, sendNow: refreshList } =
        useWorkspaceApiV1WorkspacesList()

    return (
        <LoggedInLayout currentPage="assets" showSidebar={false}>
            <main className="w-full">
                <Flex justifyContent="center" flexDirection="row">
                    <div className="max-w-6xl">
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
                        <Grid numItems={1} className="gap-3">
                            {workspaces?.map((ws) => {
                                return (
                                    <Col>
                                        <WorkspaceCard
                                            workspace={ws}
                                            refreshList={refreshList}
                                        />
                                    </Col>
                                )
                            })}
                        </Grid>
                    </div>
                </Flex>
            </main>
        </LoggedInLayout>
    )
}
