import { useEffect, useState } from 'react'
import { Flex, Text } from '@tremor/react'
import Steps from '../../../../../../../../components/Steps'
import FirstStep from './FirstStep'
import FinalStep from './FinalStep'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
} from '../../../../../../../../api/api'
import { useOnboardApiV1CredentialAutoonboardCreate } from '../../../../../../../../api/onboard.gen'
import Spinner from '../../../../../../../../components/Spinner'

interface ISteps {
    onClose: () => void
    organizations: GithubComKaytuIoKaytuEnginePkgOnboardApiCredential[]
    accounts: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
}

export default function FromExisting({
    onClose,
    organizations,
    accounts,
}: ISteps) {
    const [stepNum, setStepNum] = useState(1)
    const [orgID, setOrgID] = useState<string>('')

    const {
        response: autoOnboardResult,
        isLoading,
        isExecuted,
        sendNow,
    } = useOnboardApiV1CredentialAutoonboardCreate(orgID, {}, false)

    const close = () => {
        setOrgID('')
        setStepNum(1)
        onClose()
    }

    useEffect(() => {
        if (stepNum === 2) {
            sendNow()
        }
    }, [stepNum])

    if (isExecuted && isLoading) {
        return <Spinner />
    }

    const showStep = (s: number) => {
        switch (s) {
            case 1:
                return (
                    <FirstStep
                        onPrevious={close}
                        onNext={(v) => {
                            setOrgID(v)
                            setStepNum(2)
                        }}
                        organizations={organizations}
                    />
                )
            case 2:
                return (
                    <FinalStep
                        onNext={close}
                        accounts={autoOnboardResult || []}
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
            <Text className="my-6">
                Discover new Accounts from an AWS Organization
            </Text>
            <Steps steps={3} currentStep={stepNum} />
            {showStep(stepNum)}
        </Flex>
    )
}
