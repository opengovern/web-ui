import { useEffect, useState } from 'react'
import { Flex } from '@tremor/react'
import { useParams } from 'react-router-dom'
import DrawerPanel from '../../../../../../../components/DrawerPanel'
import Steps from '../../../../../../../components/Steps'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import { useOnboardApiV1CredentialCreate } from '../../../../../../../api/onboard.gen'
import { SourceType } from '../../../../../../../api/api'
import FinalStep from './FinalStep'
import Spinner from '../../../../../../../components/Spinner'
import { getErrorMessage } from '../../../../../../../types/apierror'
import { useWorkspaceApiV1BootstrapCredentialCreate } from '../../../../../../../api/workspace.gen'

interface INewPrinciple {
    open: boolean
    onClose: () => void
    useDrawer?: boolean
    bootstrapMode?: boolean
}

export default function NewPrincipal({
    open,
    onClose,
    useDrawer = true,
    bootstrapMode = false,
}: INewPrinciple) {
    const currentWorkspace = useParams<{ ws: string }>().ws
    const [stepNum, setStepNum] = useState(1)
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
    } = useOnboardApiV1CredentialCreate(
        {
            config: {
                clientId: data.appId,
                secretId: data.secId,
                tenantId: data.tenId,
                objectId: data.objectId,
                clientSecret: data.clientSecret,
                subscriptionId: data.subscriptionId,
            },
            source_type: SourceType.CloudAzure,
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
        setStepNum(1)
        onClose()
    }

    useEffect(() => {
        if (isExecuted && !isLoading && error) {
            setStepNum(2)
        }
    }, [isLoading])

    useEffect(() => {
        if (bcIsExecuted && !bcIsLoading && bcError) {
            setStepNum(2)
        }
    }, [bcIsLoading])

    useEffect(() => {
        if (stepNum === 3) {
            if (bootstrapMode) {
                bcSendNow()
            } else {
                sendNow()
            }
        }
    }, [stepNum])

    const showStep = (s: number) => {
        if (bootstrapMode) {
            if (bcIsLoading && bcIsExecuted) {
                return <Spinner />
            }
        } else if (isLoading && isExecuted) {
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
                        iAppId={data.appId}
                        iObjectId={data.objectId}
                        iClientSecret={data.clientSecret}
                        iSecId={data.secId}
                        iTenId={data.tenId}
                        iSubscriptionId={data.subscriptionId}
                        onPrevious={() => setStepNum(1)}
                        error={getErrorMessage(bootstrapMode ? bcError : error)}
                        onNext={(
                            appId,
                            tenId,
                            secId,
                            objectId,
                            clientSecret,
                            subscriptionId
                        ) => {
                            setData({
                                appId,
                                tenId,
                                secId,
                                objectId,
                                clientSecret,
                                subscriptionId,
                            })
                            setStepNum(3)
                        }}
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
        <Flex flexDirection="col" justifyContent="between" className="h-full">
            <Steps steps={3} currentStep={stepNum} />
            {showStep(stepNum)}
        </Flex>
    )
}
