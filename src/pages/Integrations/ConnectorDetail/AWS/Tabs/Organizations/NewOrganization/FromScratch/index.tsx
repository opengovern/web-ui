import { Flex, Text } from '@tremor/react'
import { useState } from 'react'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import ThirdStep from './ThirdStep'
import FinalStep from './FinalStep'
import Steps from '../../../../../../../../components/Steps'
import { useOnboardApiV1CredentialCreate } from '../../../../../../../../api/onboard.gen'
import Spinner from '../../../../../../../../components/Spinner'
import { getErrorMessage } from '../../../../../../../../types/apierror'
import { SourceType } from '../../../../../../../../api/api'

interface ISteps {
    onClose: () => void
}

export default function FromScratch({ onClose }: ISteps) {
    const [stepNum, setStepNum] = useState(1)
    const [data, setData] = useState({
        accessKey: '',
        secretKey: '',
        roleName: '',
        externalId: '',
    })

    const close = () => {
        setStepNum(1)
        setData({
            accessKey: '',
            secretKey: '',
            roleName: '',
            externalId: '',
        })
        onClose()
    }

    const { error, isLoading, isExecuted, sendNow } =
        useOnboardApiV1CredentialCreate(
            {
                source_type: SourceType.CloudAWS,
                config: {
                    accessKey: data.accessKey,
                    secretKey: data.secretKey,
                    assumeRoleName: data.roleName,
                    externalId: data.externalId,
                },
            },
            {},
            false
        )

    if (isLoading && isExecuted) {
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
                        onNext={() => setStepNum(3)}
                    />
                )
            case 3:
                return (
                    <ThirdStep
                        onPrevious={() => setStepNum(2)}
                        onNext={(
                            accessKey,
                            secretKey,
                            roleName,
                            externalId
                        ) => {
                            setData({
                                accessKey,
                                secretKey,
                                roleName,
                                externalId,
                            })
                            setStepNum(4)
                        }}
                    />
                )
            case 4:
                return (
                    <FinalStep
                        accessKeyParam={data.accessKey}
                        secretKey={data.secretKey}
                        roleName={data.roleName}
                        externalId={data.externalId}
                        onPrevious={() => setStepNum(3)}
                        error={getErrorMessage(error)}
                        isLoading={isExecuted && isLoading}
                        onSubmit={() => {
                            sendNow()
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
            <Steps steps={4} currentStep={stepNum} />
            {showStep(stepNum)}
        </Flex>
    )
}