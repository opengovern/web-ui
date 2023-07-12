import { useState } from 'react'
import { Flex, Text } from '@tremor/react'
import Steps from '../../../../../../../../components/Steps'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import FinalStep from './FinalStep'
import { GithubComKaytuIoKaytuEnginePkgOnboardApiConnection } from '../../../../../../../../api/api'

interface ISteps {
    onClose: () => void
    accounts: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
}

interface IData {
    roleName: string
    externalID: string
}

export default function FromExisting({ onClose, accounts }: ISteps) {
    const [stepNum, setStepNum] = useState(1)
    const [connectionID, setConnectionID] = useState<string>('')
    const [data, setData] = useState<IData>({
        roleName: '',
        externalID: '',
    })

    const close = () => {
        setStepNum(1)
        setConnectionID('')
        setData({
            roleName: '',
            externalID: '',
        })
        onClose()
    }

    const showStep = (s: number) => {
        switch (s) {
            case 1:
                return (
                    <FirstStep
                        onPrevious={close}
                        onNext={(connID) => {
                            setStepNum(2)
                            setConnectionID(connID)
                        }}
                        accounts={accounts}
                    />
                )
            case 2:
                return (
                    <SecondStep
                        onNext={(roleName, externalID) => {
                            setData({
                                roleName,
                                externalID,
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
                            // TODO
                        }}
                        externalId={data.externalID}
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
