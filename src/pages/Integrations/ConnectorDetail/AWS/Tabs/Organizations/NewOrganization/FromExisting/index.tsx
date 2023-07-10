import { useState } from 'react'
import { Flex, Text } from '@tremor/react'
import Steps from '../../../../../../../../components/Steps'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import FinalStep from './FinalStep'

interface ISteps {
    close: any
    accounts: any
}

export default function FromExisting({ close, accounts }: ISteps) {
    const [stepNum, setStepNum] = useState(1)
    const [connection, setConnection] = useState({})
    const [data, setData] = useState({
        roleName: '',
        externalId: '',
    })

    const showStep = (s: number) => {
        switch (s) {
            case 1:
                return (
                    <FirstStep
                        onPrevious={() => close()}
                        onNext={(con: any) => {
                            setStepNum(2)
                            setConnection(con)
                        }}
                        accounts={accounts}
                    />
                )
            case 2:
                return (
                    <SecondStep
                        onNext={(d: any) => {
                            setData(d)
                            setStepNum(3)
                        }}
                        onPrevious={() => setStepNum(1)}
                    />
                )
            case 3:
                return (
                    <FinalStep
                        onPrevious={() => setStepNum(1)}
                        data={data}
                        connection={connection}
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
