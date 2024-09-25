// @ts-nocheck
import Wizard from '@cloudscape-design/components/wizard'
import {
    Container,
    FormField,
    Header,
    Input,
    KeyValuePairs,
    Link,
    SpaceBetween,
} from '@cloudscape-design/components'
import { Button, Card } from '@tremor/react'
import './style.css'
import License from './stepComponents/step1'
import { useState } from 'react'
import Integrations from './stepComponents/step3'
import Complete from './stepComponents/step4'
import UserCredinations from './stepComponents/step2'
import { WizarData } from './types'
import { notificationAtom } from '../../store'
import { useSetAtom } from 'jotai'

export default  function SetupWizard () {
    const [activeStepIndex, setActiveStepIndex] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const [wizardData, setWizardData] = useState<WizarData>()
    const setNotification = useSetAtom(notificationAtom)

    const OnClickNext = (index: number) => {
        if(index ==1){
                setActiveStepIndex(index)
return;
        }
        if (index === 2) {
            if (wizardData?.userData?.email && wizardData?.userData?.password) {
                setActiveStepIndex(index)
                return
            } else {
                console.log('hi')
                setNotification({
                    text: 'Please enter your email and password',
                    type: 'error',
                })
                return
            }
        }
        if (index === 3) {
            if (wizardData?.sampleLoaded === 'sample') {
                setActiveStepIndex(index)
                return
            } else {
                console.log(wizardData)
                if (!wizardData?.awsData) {
                    setNotification({
                        text: 'Please  AWS and complete the form',
                        type: 'error',
                    })
                    return
                }
                if (!wizardData?.azureData) {
                    setNotification({
                        text: 'Please Select an Azure and complete the form',
                        type: 'error',
                    })
                    return
                }
                if (
                    !wizardData?.azureData?.applicationId ||
                    !wizardData?.azureData?.directoryId ||
                    !wizardData?.azureData?.objectId ||
                    !wizardData?.azureData?.secretValue
                ) {
                    setNotification({
                        text: 'Please Complete the Azure form corrctly',
                        type: 'error',
                    })
                    return
                }
                if (
                    !wizardData?.awsData?.accessKey ||
                    !wizardData?.awsData?.accessSecret ||
                    !wizardData?.awsData?.role
                ) {
                    setNotification({
                        text: 'Please Complete the AWS form corrctly',
                        type: 'error',
                    })
                    return
                }
                setActiveStepIndex(index)
            }
        }
    }

    return (
        <Card className="flex justify-center items-center wizard-card w-full">
            <Wizard
                className="w-full"
                i18nStrings={{
                    stepNumberLabel: (stepNumber) => `Step ${stepNumber}`,
                    collapsedStepsLabel: (stepNumber, stepsCount) =>
                        `Step ${stepNumber} of ${stepsCount}`,
                    skipToButtonLabel: (step, stepNumber) =>
                        `Skip to ${step.title}`,
                    navigationAriaLabel: 'Steps',
                    cancelButton: '',
                    previousButton: 'Previous',
                    nextButton: 'Next',
                    submitButton: 'Submit',
                    optional: 'optional',
                }}
                onNavigate={({ detail }) =>
                    OnClickNext(detail.requestedStepIndex)
                }
                activeStepIndex={activeStepIndex}
                steps={[
                    {
                        title: 'License Agreement',

                        content: <License setLoading={setLoading} />,
                    },
                    {
                        title: 'Setup Login',

                        content: (
                            <UserCredinations
                                setLoading={setLoading}
                                wizardData={wizardData}
                                setWizardData={setWizardData}
                            />
                        ),
                    },
                    {
                        title: 'Setup Integrations',
                        content: (
                            <Integrations
                                setLoading={setLoading}
                                wizardData={wizardData}
                                setWizardData={setWizardData}
                            />
                        ),
                        isOptional: false,
                    },
                    {
                        title: 'Review and create',
                        content: (
                            <Complete
                                setLoading={setLoading}
                                setActiveStepIndex={setActiveStepIndex}
                                wizardData={wizardData}
                                setWizardData={setWizardData}
                            />
                        ),
                        isOptional: false,
                    },
                ]}
                isLoadingNextStep={loading}
            />
        </Card>
    )
}
