import { Card, Flex } from '@tremor/react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { WorkspaceInformation } from './WorkspaceInfo'
import { OnboardConnection } from './OnboardConnection'
import NewPrincipal from '../../Integrations/ConnectorDetail/Azure/Tabs/Principals/NewPrincipal'
import { Status } from './Status'
import {
    useWorkspaceApiV1BootstrapDetail,
    useWorkspaceApiV1BootstrapFinishCreate,
    useWorkspaceApiV1WorkspaceCreate,
} from '../../../api/workspace.gen'
import Layout from '../../../components/Layout'
import { getErrorMessage } from '../../../types/apierror'
import OnboardDrawer from '../../Integrations/Onboard/AWS'

export default function Boostrap() {
    const currentWorkspace = useParams<{ ws: string }>().ws
    const navigate = useNavigate()
    const [tier, setTier] = useState('FREE')
    const [name, setName] = useState(currentWorkspace || '')
    const [step, setStep] = useState(currentWorkspace === undefined ? 2 : 3)
    const [newAWSOpen, setNewAWSOpen] = useState(false)
    const [newAzureOpen, setNewAzureOpen] = useState(false)

    const {
        response: statusResponse,
        isExecuted: statusIsExecuted,
        isLoading: statusIsLoading,
        error: statusError,
    } = useWorkspaceApiV1BootstrapDetail(name, {}, step > 2)

    useEffect(() => {
        if ((statusResponse?.workspaceCreationStatus?.done || 0) !== 0) {
            setStep(4)
        }
    }, [statusIsLoading])

    const {
        isExecuted: createWorkspaceIsExecuted,
        isLoading: createWorkspaceIsLoading,
        sendNow: createWorkspaceSendNow,
        error: createWorkspaceError,
    } = useWorkspaceApiV1WorkspaceCreate(
        {
            name,
            organization_id: -1,
            tier,
        },
        {},
        false
    )

    useEffect(() => {
        if (createWorkspaceIsExecuted && !createWorkspaceIsLoading) {
            if (!createWorkspaceError) {
                if (currentWorkspace === undefined) {
                    navigate(`/${name}/bootstrap`)
                } else {
                    setStep(3)
                }
            }
        }
    }, [createWorkspaceIsLoading])

    const {
        isExecuted: finishIsExecuted,
        isLoading: finishIsLoading,
        sendNow: finishSendNow,
        error: finishError,
    } = useWorkspaceApiV1BootstrapFinishCreate(name || '', {}, false)

    useEffect(() => {
        if (finishIsExecuted && !finishIsLoading) {
            if (!finishError) {
                setStep(4)
            }
        }
    }, [finishIsLoading])

    return (
        <Layout currentPage="assets" showSidebar={false} hFull>
            {newAWSOpen && (
                <OnboardDrawer
                    open={newAWSOpen}
                    onClose={() => setNewAWSOpen(false)}
                    bootstrapMode
                />
            )}

            {newAzureOpen && (
                <NewPrincipal
                    open={newAzureOpen}
                    onClose={() => setNewAzureOpen(false)}
                    bootstrapMode
                />
            )}
            <Flex
                justifyContent="center"
                flexDirection="row"
                className="h-full"
                alignItems="start"
            >
                {step < 4 ? (
                    <div className="max-w-6xl w-2/3">
                        <Card className="p-0">
                            {/* <ChooseYourPlan
                                open={step === 1}
                                tier={tier}
                                setTier={setTier}
                                onDone={() => setStep(2)}
                                done={step > 1}
                            /> */}
                            <WorkspaceInformation
                                open={step === 2}
                                name={name}
                                setName={setName}
                                isLoading={
                                    createWorkspaceIsExecuted &&
                                    createWorkspaceIsLoading
                                }
                                errorMessage={getErrorMessage(
                                    createWorkspaceError
                                )}
                                onDone={createWorkspaceSendNow}
                                done={step > 2}
                            />
                            <OnboardConnection
                                open={step === 3}
                                workspaceName={name}
                                doDone={finishSendNow}
                                done={finishIsExecuted}
                                isLoading={finishIsExecuted && finishIsLoading}
                                onAWSClick={() => setNewAWSOpen(true)}
                                onAzureClick={() => setNewAzureOpen(true)}
                            />
                        </Card>
                    </div>
                ) : (
                    <Status workspaceName={name} />
                )}
            </Flex>
        </Layout>
    )
}
