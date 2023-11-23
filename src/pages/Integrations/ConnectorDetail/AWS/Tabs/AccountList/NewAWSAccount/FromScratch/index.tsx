import { Flex, Text } from '@tremor/react'
import { useEffect, useState } from 'react'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import ThirdStep from './ThirdStep'
import FinalStep from './FinalStep'
import Steps from '../../../../../../../../components/Steps'
import ForthStep from './ForthStep'
import { useOnboardApiV1SourceAwsCreate } from '../../../../../../../../api/onboard.gen'
import Spinner from '../../../../../../../../components/Spinner'
import { getErrorMessage } from '../../../../../../../../types/apierror'

interface ISteps {
    close: () => void
}

interface IData {
    roleARN: string
    accountID: string
    accountName: string
    externalId: string
}

export default function FromScratch({ close }: ISteps) {
    const [stepNum, setStepNum] = useState(1)
    const [data, setData] = useState<IData>({
        roleARN: '',
        accountID: '',
        externalId: '',
        accountName: '',
    })

    const closeDrawer = () => {
        close()
        setStepNum(1)
        setData({
            roleARN: '',
            accountID: '',
            externalId: '',
            accountName: '',
        })
    }

    const { response, isLoading, isExecuted, error, sendNow } =
        useOnboardApiV1SourceAwsCreate(
            {
                config: {
                    accessKey: '',
                    secretKey: '',
                    assumeRoleName: data.roleARN,
                    assumeAdminRoleName: data.roleARN,
                    accountId: data.accountID,
                    externalId: data.externalId,
                },
            },
            {},
            false
        )

    useEffect(() => {
        if (error) {
            setStepNum(3)
        }
    }, [isLoading])

    useEffect(() => {
        if (stepNum === 4) {
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
                        onPrevious={closeDrawer}
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
                        error={getErrorMessage(error)}
                        onPrevious={() => setStepNum(2)}
                        onNext={(info) => {
                            setData({
                                ...data,
                                roleARN: info.roleArn,
                                accountID: info.accountID,
                                externalId: info.externalId,
                            })
                            setStepNum(4)
                        }}
                    />
                )
            case 4:
                return (
                    <ForthStep
                        accountID={response?.id || ''}
                        onPrevious={close}
                        onNext={(accountName) => {
                            setData({
                                ...data,
                                accountName,
                            })
                            setStepNum(5)
                        }}
                    />
                )
            case 5:
                return (
                    <FinalStep
                        accountID={response?.id || ''}
                        accountName={data.accountName}
                        onNext={close}
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
            <Text className="my-6">Onboard Standalone AWS Account</Text>
            <Steps steps={5} currentStep={stepNum} />
            {showStep(stepNum)}
        </Flex>
    )
}
