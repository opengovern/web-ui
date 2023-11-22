import { useEffect, useState } from 'react'
import { Flex, Text } from '@tremor/react'
import Steps from '../../../../../../../../components/Steps'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import FinalStep from './FinalStep'
import { GithubComKaytuIoKaytuEnginePkgOnboardApiConnection } from '../../../../../../../../api/api'
import { useOnboardApiV1CredentialUpdate } from '../../../../../../../../api/onboard.gen'
import Spinner from '../../../../../../../../components/Spinner'
import { getErrorMessage } from '../../../../../../../../types/apierror'

interface ISteps {
    onClose: () => void
    accounts: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
}

interface IData {
    roleName: string
}

export default function FromExisting({ onClose, accounts }: ISteps) {
    const [stepNum, setStepNum] = useState(1)
    const [credentialID, setCredentialID] = useState<string>('')
    const [data, setData] = useState<IData>({
        roleName: '',
    })

    const close = () => {
        setStepNum(1)
        setCredentialID('')
        setData({
            roleName: '',
        })
        onClose()
    }

    const { error, isLoading, isExecuted, sendNow } =
        useOnboardApiV1CredentialUpdate(
            credentialID,
            {
                config: {
                    assumeRoleName: data.roleName,
                },
            },
            {},
            false
        )

    useEffect(() => {
        if (isExecuted && !isLoading && !error) {
            close()
        }
    }, [isLoading])

    if (isLoading && isExecuted) {
        return <Spinner />
    }

    const showStep = (s: number) => {
        switch (s) {
            case 1:
                return (
                    <FirstStep
                        onPrevious={close}
                        onNext={(credID) => {
                            setStepNum(2)
                            setCredentialID(credID)
                        }}
                        accounts={accounts}
                    />
                )
            case 2:
                return (
                    <SecondStep
                        onNext={(roleName) => {
                            setData({
                                roleName,
                            })
                            setStepNum(3)
                        }}
                        onPrevious={() => setStepNum(1)}
                    />
                )
            case 3:
                return (
                    <FinalStep
                        onPrevious={() => setStepNum(1)}
                        onSubmit={() => {
                            sendNow()
                        }}
                        isLoading={isLoading && isExecuted}
                        error={getErrorMessage(error)}
                        roleName={data.roleName}
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
            <Text className="my-6">Organization from existing AWS account</Text>
            <Steps steps={3} currentStep={stepNum} />
            {showStep(stepNum)}
        </Flex>
    )
}
