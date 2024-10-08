import { useEffect, useState } from 'react'
import { Flex } from '@tremor/react'
import { useParams } from 'react-router-dom'
import DrawerPanel from '../../../../../../../components/DrawerPanel'
import Steps from '../../../../../../../components/Steps'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import { SourceType } from '../../../../../../../api/api'
import FinalStep from './FinalStep'
import Spinner from '../../../../../../../components/Spinner'
import { getErrorMessage } from '../../../../../../../types/apierror'
import { useWorkspaceApiV1BootstrapCredentialCreate } from '../../../../../../../api/workspace.gen'
import { useIntegrationApiV1CredentialsAzureCreate } from '../../../../../../../api/integration.gen'
import KButton from '@cloudscape-design/components/button'
import Wizard from '@cloudscape-design/components/wizard'
import StatusIndicator from '@cloudscape-design/components/status-indicator'

interface INewPrinciple {
    open: boolean
    onClose: () => void
    useDrawer?: boolean
    onSubmit? : Function
    // bootstrapMode?: boolean
    onCancel?: () => void
    credintalsSendNow?: Function
}

export default function NewPrincipal({
    open,
    onClose,
    useDrawer = true,
    // bootstrapMode = false,
    onCancel,
    credintalsSendNow,
    onSubmit = () => {}
}: INewPrinciple) {
    const currentWorkspace = useParams<{ ws: string }>().ws
    const [stepNum, setStepNum] = useState(0)
    const [data, setData] = useState({
        tenId: '',
        secId: '',
        appId: '',
        objectId: '',
        clientSecret: '',
        subscriptionId: '',
    })

    const {
        response: principal,
        isLoading,
        isExecuted,
        error,
        sendNow,
    } = useIntegrationApiV1CredentialsAzureCreate(
        {
            config: {
                clientId: data.appId,
                tenantId: data.tenId,
                objectId: data.objectId,
                clientSecret: data.clientSecret,
            },
        },
        {},
        false
    )

    const {
        error: bcError,
        isLoading: bcIsLoading,
        isExecuted: bcIsExecuted,
        sendNow: bcSendNow,
    } = useWorkspaceApiV1BootstrapCredentialCreate(
        currentWorkspace || '',
        {
            connectorType: SourceType.CloudAzure,
            azureConfig: {
                clientId: data.appId,
                secretId: data.secId,
                tenantId: data.tenId,
                objectId: data.objectId,
                clientSecret: data.clientSecret,
                subscriptionId: data.subscriptionId,
            },
        },
        {},
        false
    )
    const close = () => {
        setStepNum(0)
        onClose()
        if(onCancel){
            onCancel()
        }
    }

    useEffect(() => {
        if (isExecuted && !isLoading && error) {
            setStepNum(0)
        }
    }, [isLoading])

    useEffect(() => {
        if (bcIsExecuted && !bcIsLoading && bcError) {
            setStepNum(0)
        }
    }, [bcIsLoading])

    useEffect(() => {
        if (stepNum === 1) {
            // if (bootstrapMode) {
            //     bcSendNow()
            // } else {
            //     sendNow()
            // }
            sendNow()
            if(credintalsSendNow){
            credintalsSendNow()

            }
        }
    }, [stepNum])

    const showStep = (s: number) => {
        // if (bootstrapMode) {
        //     if (bcIsLoading && bcIsExecuted) {
        //         return <Spinner />
        //     }
        // } else
         if (isLoading && isExecuted) {
            return <Spinner />
        }

        switch (s) {
            case 1:
                return (
                    <FirstStep
                        onPrevious={close}
                        onNext={() => setStepNum(2)}
                    />
                )
            case 2:
                return (
                    <SecondStep
                        data={data}
                        setData={setData}
                        error={getErrorMessage(error)}
                    />
                )
            case 3:
                return <FinalStep data={data} health="" onNext={close} />
            default:
                return ' '
        }
    }

    if (useDrawer) {
        return (
            <DrawerPanel
                title="New Service Principle"
                open={open}
                onClose={close}
            >
                <Flex
                    flexDirection="col"
                    justifyContent="between"
                    className="h-full"
                >
                    <Steps steps={3} currentStep={stepNum} />
                    {showStep(stepNum)}
                </Flex>
            </DrawerPanel>
        )
    }
    return (
            <Wizard
                i18nStrings={{
                    stepNumberLabel: (stepNumber) => `Step ${stepNumber}`,
                    collapsedStepsLabel: (stepNumber, stepsCount) =>
                        `Step ${stepNumber} of ${stepsCount}`,
                    skipToButtonLabel: (step, stepNumber) =>
                        `Skip to ${step.title}`,
                    navigationAriaLabel: 'Steps',
                    cancelButton: 'Cancel',
                    previousButton: 'Previous',
                    nextButton: 'Next',
                    submitButton: 'Submit',
                    optional: 'optional',
                }}
                isLoadingNextStep={false}
                onSubmit={()=>{
                    if(credintalsSendNow){
                    credintalsSendNow()

                    }
                    onClose()
                  onSubmit()
                }}
                onCancel={close}
                onNavigate={
                    ({ detail }) => {
                        setStepNum(detail.requestedStepIndex)
                    }
                    // setActiveStepIndex(detail.requestedStepIndex)
                }
                activeStepIndex={stepNum}
                // allowSkipTo
                steps={[
                    {
                        title: 'SPN Credentials',

                        description: (
                            <>
                                Enter the Service Principal credentials
                            </>
                        ),
                        content: (
                            <SecondStep
                                
                                data ={data}
                                setData ={setData}
                                // error={getErrorMessage(bootstrapMode ? bcError : error)}
                                error={getErrorMessage(error)}
                               
                            />
                        ),
                    },
                    {
                        title: 'Final Step',
                        description: (
                            <>
                                Review the Service Principal credentials
                            </>
                        ),
                        content: <FinalStep data={data} health="" onNext={close} />,
                    }
                ]}
            />
            
    )
}
