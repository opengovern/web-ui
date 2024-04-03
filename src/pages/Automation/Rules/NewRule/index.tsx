import { useEffect, useState } from 'react'
import DrawerPanel from '../../../../components/DrawerPanel'
import Steps from '../../../../components/Steps'
import StepOne from './StepOne'
import StepTwo from './StepTwo'
import StepThree from './StepThree'
import StepFour from './StepFour'
import { useAlertingApiV1RuleCreateCreate } from '../../../../api/alerting.gen'
import { GithubComKaytuIoKaytuEnginePkgAlertingApiRule } from '../../../../api/api'

interface INewRule {
    open: boolean
    onClose: () => void
    selectedRule?: GithubComKaytuIoKaytuEnginePkgAlertingApiRule | undefined
}

export default function NewRule({ open, onClose, selectedRule }: INewRule) {
    const [currentStep, setCurrentStep] = useState(1)
    const [event, setEvent] = useState('')
    const [compliance, setCompliance] = useState('')
    const [control, setControl] = useState('')
    const [condition, setCondition] = useState<any>({})
    const [actionId, setActionId] = useState<string | number>('')
    const [metadata, setMetadata] = useState<any>({})
    const [scope, setScope] = useState<any>({})

    const { response, sendNow } = useAlertingApiV1RuleCreateCreate(
        {
            action_id: Number(actionId),
            event_type: {
                benchmark_id: compliance,
            },
            metadata,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            condition,
            scope,
        },
        {},
        false
    )

    useEffect(() => {
        if (response) onClose()
    }, [response])

    useEffect(() => {
        if (metadata.name) {
            sendNow()
        }
    }, [metadata])

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <StepOne
                        onNext={(e, b, c) => {
                            setEvent(e)
                            setCompliance(b)
                            setControl(c)
                            setCurrentStep(2)
                        }}
                        onBack={onClose}
                    />
                )
            case 2:
                return (
                    <StepTwo
                        onNext={(query, s) => {
                            setCondition(query)
                            setScope(s)
                            setCurrentStep(3)
                        }}
                        onBack={() => setCurrentStep(1)}
                    />
                )
            case 3:
                return (
                    <StepThree
                        onNext={(id) => {
                            setActionId(id)
                            setCurrentStep(4)
                        }}
                        onBack={() => setCurrentStep(2)}
                    />
                )
            case 4:
                return (
                    <StepFour
                        onNext={(name, description, label) => {
                            setMetadata({
                                name,
                                description,
                                label: [label],
                            })
                        }}
                        onBack={() => setCurrentStep(3)}
                    />
                )
            default:
                return <div />
        }
    }

    return (
        <DrawerPanel title="New rule" open={open} onClose={onClose}>
            <Steps steps={4} currentStep={currentStep} />
            {renderStep()}
        </DrawerPanel>
    )
}
