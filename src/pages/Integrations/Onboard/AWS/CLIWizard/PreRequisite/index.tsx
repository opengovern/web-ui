import { Button, Card, Title, Text, Flex, Bold } from '@tremor/react'
import { Checkbox, Switch, useCheckboxState } from 'pretty-checkbox-react'
import { useState } from 'react'

interface IPreRequisite {
    accountType: 'organization' | 'single'
    onPrev: () => void
    onNext: () => void
}

export function PreRequisite({ accountType, onPrev, onNext }: IPreRequisite) {
    const [understanding, setUnderstanding] = useState(false)
    const [adminAccess, setAdminAccess] = useState(false)
    const [awsCLI, setAWSCLI] = useState(false)
    const [kaytuCLI, setKaytuCLI] = useState(false)

    const item = (
        id: string,
        state: boolean,
        setState: (v: boolean) => void,
        label: string
    ) => {
        return (
            <Checkbox
                shape="curve"
                id={id}
                name={id}
                checked={state}
                onChange={(e) => {
                    setState(e.target.checked)
                }}
                className="py-2"
            >
                <label htmlFor={id} className="text-sm text-gray-500">
                    {label}
                </label>
            </Checkbox>
        )
    }

    const preRequisiteList = () => {
        if (accountType === 'organization') {
            return (
                <>
                    {item(
                        'understanding',
                        understanding,
                        setUnderstanding,
                        'I understanding how no-password secure onboarding works'
                    )}
                    {item(
                        'adminAccess',
                        adminAccess,
                        setAdminAccess,
                        'I have administrative access to AWS Organization Account'
                    )}
                    {item(
                        'awsCLI',
                        awsCLI,
                        setAWSCLI,
                        'AWS CLI is installed & logged-in to Organization master account'
                    )}
                    {item(
                        'kaytuCLI',
                        kaytuCLI,
                        setKaytuCLI,
                        'Kaytu CLI installed & logged-in'
                    )}
                </>
            )
        }
        return (
            <>
                {item(
                    'understanding',
                    understanding,
                    setUnderstanding,
                    'I understanding how no-password secure onboarding works'
                )}
                {item(
                    'adminAccess',
                    adminAccess,
                    setAdminAccess,
                    'I have administrative access to AWS Account'
                )}
                {item(
                    'awsCLI',
                    awsCLI,
                    setAWSCLI,
                    'AWS CLI is installed & logged-in'
                )}
                {item(
                    'kaytuCLI',
                    kaytuCLI,
                    setKaytuCLI,
                    'Kaytu CLI installed & logged-in'
                )}
            </>
        )
    }

    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" alignItems="start">
                <Bold className="mb-4">Prerequisite</Bold>
                <Flex
                    flexDirection="col"
                    justifyContent="start"
                    alignItems="start"
                >
                    {preRequisiteList()}
                </Flex>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={() => onPrev()}>
                    Back
                </Button>
                <Button
                    disabled={
                        !understanding || !adminAccess || !awsCLI || !kaytuCLI
                    }
                    onClick={() => onNext()}
                    className="ml-3"
                >
                    Next
                </Button>
            </Flex>
        </Flex>
    )
}
