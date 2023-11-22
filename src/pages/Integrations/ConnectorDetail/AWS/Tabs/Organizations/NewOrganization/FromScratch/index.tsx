import { Flex, Text } from '@tremor/react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import FinalStep from './FinalStep'
import Steps from '../../../../../../../../components/Steps'
import { useOnboardApiV1CredentialCreate } from '../../../../../../../../api/onboard.gen'
import Spinner from '../../../../../../../../components/Spinner'
import { getErrorMessage } from '../../../../../../../../types/apierror'
import { SourceType } from '../../../../../../../../api/api'
import { useWorkspaceApiV1BootstrapCredentialCreate } from '../../../../../../../../api/workspace.gen'

interface ISteps {
    bootstrapMode: boolean
    onClose: () => void
}

export default function FromScratch({ onClose, bootstrapMode }: ISteps) {
    const currentWorkspace = useParams<{ ws: string }>().ws
    const [stepNum, setStepNum] = useState(1)
    const [data, setData] = useState({
        roleName: '',
    })

    const close = () => {
        setStepNum(1)
        setData({
            roleName: '',
        })
        onClose()
    }

    const { error, isLoading, isExecuted, sendNow } =
        useOnboardApiV1CredentialCreate(
            {
                source_type: SourceType.CloudAWS,
                config: {
                    assumeRoleName: data.roleName,
                    assumeAdminRoleName: data.roleName,
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
            connectorType: SourceType.CloudAWS,
            config: {
                assumeRoleName: data.roleName,
                assumeAdminRoleName: data.roleName,
            },
        },
        {},
        false
    )

    if ((isLoading && isExecuted) || (bcIsLoading && bcIsExecuted)) {
        return <Spinner />
    }

    const showStep = (s: number) => {
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
                        onPrevious={() => setStepNum(1)}
                        onNext={(roleName) => {
                            setData({
                                roleName,
                            })
                            setStepNum(3)
                        }}
                    />
                )
            case 3:
                return (
                    <FinalStep
                        roleName={data.roleName}
                        onPrevious={() => setStepNum(2)}
                        error={getErrorMessage(bootstrapMode ? bcError : error)}
                        isLoading={
                            (isExecuted && isLoading) ||
                            (bcIsExecuted && bcIsLoading)
                        }
                        onSubmit={() => {
                            if (bootstrapMode) {
                                bcSendNow()
                            } else {
                                sendNow()
                            }
                        }}
                    />
                )
            default:
                return null
        }
    }

    return (
        <Flex
            flexDirection="col"
            justifyContent="start"
            alignItems="start"
            className="h-full"
        >
            <Text className="my-6">Organization from new AWS account</Text>
            <Steps steps={3} currentStep={stepNum} />
            {showStep(stepNum)}
        </Flex>
    )
}
