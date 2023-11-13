import { Card, Flex } from '@tremor/react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ChooseYourPlan } from './ChoosePlan'
import { WorkspaceInformation } from './WorkspaceInfo'
import { OnboardConnection } from './OnboardConnection'
import NewOrganization from '../../Integrations/ConnectorDetail/AWS/Tabs/Organizations/NewOrganization'
import NewPrincipal from '../../Integrations/ConnectorDetail/Azure/Tabs/Principals/NewPrincipal'
import { Status } from './Status'
import {
    useWorkspaceApiV1BootstrapFinishCreate,
    useWorkspaceApiV1WorkspaceCreate,
} from '../../../api/workspace.gen'
import Layout from '../../../components/Layout'

export default function Boostrap() {
    const currentWorkspace = useParams<{ ws: string }>().ws
    const [tier, setTier] = useState('FREE')
    const [name, setName] = useState(currentWorkspace || '')
    const [step, setStep] = useState(currentWorkspace === undefined ? 1 : 3)
    const [newAWSOpen, setNewAWSOpen] = useState(false)
    const [newAzureOpen, setNewAzureOpen] = useState(false)

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
                setStep(3)
            }
        }
    }, [createWorkspaceIsLoading])

    const {
        isExecuted: finishIsExecuted,
        isLoading: finishIsLoading,
        sendNow: finishSendNow,
        error: finishError,
    } = useWorkspaceApiV1BootstrapFinishCreate(
        currentWorkspace || '',
        {},
        false
    )

    useEffect(() => {
        if (finishIsExecuted && !finishIsLoading) {
            if (!finishError) {
                setStep(4)
            }
        }
    }, [finishIsLoading])

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
                />
            )}
            <Flex justifyContent="center" flexDirection="row">
                {step < 4 ? (
                    <div className="max-w-6xl w-2/3">
                        <Card className="p-0">
                            <ChooseYourPlan
                                open={step === 1}
                                tier={tier}
                                setTier={setTier}
                                onDone={() => setStep(2)}
                                done={step > 1}
                            />
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
                            <OnboardConnection
                                open={step === 3}
                                doDone={finishSendNow}
                                done={finishIsExecuted}
                                isLoading={finishIsExecuted && finishIsLoading}
                                onAWSClick={() => setNewAWSOpen(true)}
                                onAzureClick={() => setNewAzureOpen(true)}
                            />
                        </Card>
                    </div>
                ) : (
                    <Status />
                )}
            </Flex>
        </Layout>
    )
}
