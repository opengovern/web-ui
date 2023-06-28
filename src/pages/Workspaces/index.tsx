import React from 'react'
import { Col, Flex, Grid, Title } from '@tremor/react'
import { useAuth0 } from '@auth0/auth0-react'
import LoggedInLayout from '../../components/LoggedInLayout'
import { useWorkspaceApiV1WorkspacesList } from '../../api/workspace.gen'
import WorkspaceCard from '../../components/Cards/WorkspaceCard'

const Workspaces: React.FC<any> = () => {
    const { user } = useAuth0()
    const { response: workspaces } = useWorkspaceApiV1WorkspacesList()

    return (
        <LoggedInLayout currentPage="assets" showSidebar={false}>
            <main>
                <Flex
                    flexDirection="row"
                    justifyContent="between"
                    alignItems="center"
                    className="mb-12"
                >
                    <Title>Your Workspaces</Title>
                </Flex>

                <Grid numItems={1} className="gap-3">
                    {workspaces?.map((ws) => {
                        return (
                            <Col>
                                <WorkspaceCard workspace={ws} />
                            </Col>
                        )
                    })}
                </Grid>
            </main>
        </LoggedInLayout>
    )
}

export default Workspaces
