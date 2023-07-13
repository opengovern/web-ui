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
    accessKey: string
    secretKey: string
    accountName: string
}

export default function FromScratch({ close }: ISteps) {
    const [stepNum, setStepNum] = useState(1)
    const [data, setData] = useState<IData>({
        accessKey: '',
        secretKey: '',
        accountName: '',
    })

    const closeDrawer = () => {
        close()
        setStepNum(1)
        setData({
            accessKey: '',
            secretKey: '',
            accountName: '',
        })
    }

    const { response, isLoading, isExecuted, error, sendNow } =
        useOnboardApiV1SourceAwsCreate(
            {
                config: {
                    accessKey: data.accessKey,
                    secretKey: data.secretKey,
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
                                accessKey: info.accessKey,
                                secretKey: info.secretKey,
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
                        accessKeyParam={data.accessKey}
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
