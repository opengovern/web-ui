import { Card, Flex } from '@tremor/react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChooseYourPlan } from './ChoosePlan'
import { WorkspaceInformation } from './WorkspaceInfo'
import { OnboardConnection } from './OnboardConnection'
import NewOrganization from '../../Integrations/ConnectorDetail/AWS/Tabs/Organizations/NewOrganization'
import NewPrincipal from '../../Integrations/ConnectorDetail/Azure/Tabs/Principals/NewPrincipal'
import { Status } from './Status'
import {
    useWorkspaceApiV1BootstrapDetail,
    useWorkspaceApiV1BootstrapFinishCreate,
    useWorkspaceApiV1WorkspaceCreate,
} from '../../../api/workspace.gen'
import Layout from '../../../components/Layout'

export default function Boostrap() {
    const currentWorkspace = useParams<{ ws: string }>().ws
    const navigate = useNavigate()
    const [tier, setTier] = useState('FREE')
    const [name, setName] = useState(currentWorkspace || '')
    const [step, setStep] = useState(currentWorkspace === undefined ? 1 : 3)
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

    const page = () => {
        switch (step) {
            case 1:
                return (
                    <ChooseYourPlan
                        open={step === 1}
                        tier={tier}
                        setTier={setTier}
                        onDone={() => setStep(2)}
                        done={step > 1}
                    />
                )
            case 2:
                return (
                    <WorkspaceInformation
                        open={step === 2}
                        name={name}
                        setName={setName}
                        isLoading={
                            createWorkspaceIsExecuted &&
                            createWorkspaceIsLoading
                        }
                        onDone={createWorkspaceSendNow}
                        done={step > 2}
                    />
                )
            case 3:
                return (
                    <OnboardConnection
                        open={step === 3}
                        workspaceName={name}
                        doDone={finishSendNow}
                        done={finishIsExecuted}
                        isLoading={finishIsExecuted && finishIsLoading}
                        onAWSClick={() => setNewAWSOpen(true)}
                        onAzureClick={() => setNewAzureOpen(true)}
                    />
                )
            default:
                return null
        }
        return null
    }

    return (
        <Layout currentPage="infrastructure" showSidebar={false} hfull>
            {newAWSOpen && (
                <NewOrganization
                    open={newAWSOpen}
                    onClose={() => setNewAWSOpen(false)}
                    accounts={[]}
                    forceFromScratch
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
            <Flex justifyContent="center" flexDirection="row">
                {step < 4 ? (
                    <div className="max-w-6xl w-2/3">
                        <Card className="p-0">{page()}</Card>
                    </div>
                ) : (
                    <Status workspaceName={name} />
                )}
            </Flex>
        </Layout>
    )
}
