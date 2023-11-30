import { Button, Flex, Grid } from '@tremor/react'
import { useNavigate } from 'react-router-dom'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { useEffect } from 'react'
import Layout from '../../components/Layout'
import { useWorkspaceApiV1WorkspacesList } from '../../api/workspace.gen'
import WorkspaceCard from '../../components/Cards/WorkspaceCard'
import Spinner from '../../components/Spinner'
import Header from '../../components/Header'
import { useEffect } from 'react'

export default function Workspaces() {
    const navigate = useNavigate()

    const {
        response: workspaces,
        isExecuted,
        isLoading,
        isExecuted,
        sendNow: refreshList,
    } = useWorkspaceApiV1WorkspacesList()

    useEffect(() => {
        if (isExecuted && !isLoading) {
            if (workspaces?.length === 0) {
                navigate(`/new-ws`)
            }
        }
    }, [isLoading])

    return (
        <Layout currentPage="asset" showSidebar={false}>
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
                                onClick={refreshList}
                                className="mx-2"
                            >
                                <ArrowPathIcon className="h-5 text-kaytu-500" />
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => navigate(`/new-ws`)}
                            >
                                Add new Kaytu workspace
                            </Button>
                        </Header>
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
        </Layout>
    )
}
