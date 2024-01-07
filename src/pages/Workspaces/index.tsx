import { Button, Flex, Grid } from '@tremor/react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { useEffect } from 'react'
import Layout from '../../components/Layout'
import { useWorkspaceApiV1WorkspacesList } from '../../api/workspace.gen'
import WorkspaceCard from '../../components/Cards/WorkspaceCard'
import Spinner from '../../components/Spinner'

export default function Workspaces() {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    const {
        response: workspaces,
        isLoading,
        isExecuted,
        sendNow: refreshList,
    } = useWorkspaceApiV1WorkspacesList()

    useEffect(() => {
        if (isExecuted && !isLoading) {
            if (workspaces?.length === 0) {
                navigate(`/new-ws`)
            } else if (
                workspaces?.length === 1 &&
                searchParams.has('onLogin')
            ) {
                window.location.href = `/${workspaces.at(0)?.name}`
            }
        }
    }, [isLoading])

    return (
        <Layout
            currentPage="assets"
            showSidebar={false}
            headerChildren={
                !isLoading && (
                    <Flex className="w-fit gap-3">
                        <Button variant="secondary" onClick={refreshList}>
                            <ArrowPathIcon className="h-5 text-kaytu-500" />
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => navigate(`/new-ws`)}
                        >
                            Add new Kaytu workspace
                        </Button>
                    </Flex>
                )
            }
        >
            {isLoading ? (
                <Flex justifyContent="center" className="mt-56">
                    <Spinner />
                </Flex>
            ) : (
                <Flex justifyContent="center" flexDirection="row">
                    <div className="max-w-6xl w-2/3">
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
