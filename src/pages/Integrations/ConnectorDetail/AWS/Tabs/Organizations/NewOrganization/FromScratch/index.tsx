import { Flex, Text } from '@tremor/react'
import { useState } from 'react'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import ThirdStep from './ThirdStep'
import FinalStep from './FinalStep'
import Steps from '../../../../../../../../components/Steps'

interface ISteps {
    close: any
}

export default function FromScratch({ close }: ISteps) {
    const [stepNum, setStepNum] = useState(1)
    const [data, setData] = useState({
        accessKey: '',
        secretKey: '',
        roleName: '',
        externalId: '',
    })
    const showStep = (s: number) => {
        switch (s) {
            case 1:
                return (
                    <FirstStep
                        onPrevious={() => close()}
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
                        onNext={(info: any) => {
                            setData(info)
                            setStepNum(4)
                        }}
                    />
                )
            case 4:
                return (
                    <FinalStep
                        data={data}
                        onPrevious={() => setStepNum(3)}
                        onNext={() => setStepNum(4)}
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
