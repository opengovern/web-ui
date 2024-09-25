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
import Integrations from './stepComponents/step2'
import Complete from './stepComponents/step3'

export default () => {
    const [activeStepIndex, setActiveStepIndex] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(true)
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
                    cancelButton: 'Cancel',
                    previousButton: 'Previous',
                    nextButton: 'Next',
                    submitButton: 'Launch instance',
                    optional: 'optional',
                }}
                onNavigate={({ detail }) =>
                    setActiveStepIndex(detail.requestedStepIndex)
                }
                activeStepIndex={activeStepIndex}
                steps={[
                    {
                        title: 'License Agreement',

                        content: <License setLoading={setLoading} />,
                    },
                    {
                        title: 'Setup Integrations',
                        content: <Integrations setLoading={setLoading} />,
                        isOptional: false,
                    },
                    {
                        title: 'Complete',
                        content: (
                            <Complete
                                setLoading={setLoading}
                                setActiveStepIndex={setActiveStepIndex}
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
