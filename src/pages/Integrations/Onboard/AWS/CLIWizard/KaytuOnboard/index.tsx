import { Button, Card, Title, Text, Flex, Bold, TextInput } from '@tremor/react'
import { Checkbox, Switch, useCheckboxState } from 'pretty-checkbox-react'
import { useEffect, useState } from 'react'
import { CodeBlock } from '../../../../../../components/CodeBlock'

interface IKaytuOnboard {
    bootstrapMode: boolean
    orgOrSingle: 'organization' | 'single'
    onPrev: () => void
    onNext: () => void
}

export function KaytuOnboard({
    bootstrapMode,
    orgOrSingle,
    onPrev,
    onNext,
}: IKaytuOnboard) {
    const [ou, setOU] = useState<string>('')
    const [profile, setProfile] = useState('')

    const command = () => {
        let txt = 'kaytu onboard aws'

        if (bootstrapMode) {
            txt = `${txt} -b`
        }
        if (orgOrSingle === 'single') {
            txt = `${txt} --single-connection`
        }
        if (ou.length > 0) {
            txt = `${txt} --organization-unit ${ou}`
        }
        if (profile.length > 0) {
            txt = `${txt} --profile ${profile}`
        }
        return txt
    }
    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" justifyContent="start" alignItems="start">
                <Text className="mb-2">
                    Specify your profile in AWS CLI if any
                </Text>
                <TextInput
                    className="mb-4"
                    onChange={(e) => setProfile(e.target.value)}
                />
                {orgOrSingle === 'organization' && (
                    <>
                        <Text className="mb-2">
                            Provide Organization Units (Root OU will be used if
                            not specified)
                        </Text>
                        <TextInput
                            value={ou}
                            className="mb-2"
                            onChange={(e) => setOU(e.target.value)}
                        />
                    </>
                )}

                <Text className="mt-4 mb-2">
                    Run this command on your terminal
                </Text>
                <CodeBlock command={command()} text={`$ ${command()}`} />
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={() => onPrev()}>
                    Back
                </Button>
                <Button onClick={() => onNext()} className="ml-3">
                    Next
                </Button>
            </Flex>
        </Flex>
    )
}
