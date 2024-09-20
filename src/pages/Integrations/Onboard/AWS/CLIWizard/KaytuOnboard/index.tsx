import { Button, Card, Title, Text, Flex, Bold, TextInput } from '@tremor/react'
import { Checkbox, Switch, useCheckboxState } from 'pretty-checkbox-react'
import { useEffect, useState } from 'react'
import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import { CodeBlock } from '../../../../../../components/CodeBlock'

interface IKaytuOnboard {
    // bootstrapMode: boolean
    orgOrSingle: 'organization' | 'single'
    onPrev: () => void
    onNext: () => void
}

export function KaytuOnboard({
    // bootstrapMode,
    orgOrSingle,
    onPrev,
    onNext,
}: IKaytuOnboard) {
    const [ou, setOU] = useState<string>('')
    const [profile, setProfile] = useState('')

    const command = () => {
        let txt = 'kaytu onboard aws'

        // if (bootstrapMode) {
        //     txt = `${txt} -b`
        // }
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

    const [openProfile, setOpenProfile] = useState<boolean>(false)
    const [openOU, setOpenOU] = useState<boolean>(false)

    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" justifyContent="start" alignItems="start">
                <Text className="mb-4 text-gray-900">
                    Copy and run the command in your terminal
                </Text>
                <CodeBlock command={command()} text={`$ ${command()}`} />
                <Text className="mt-4 mb-4 text-gray-900">Options</Text>

                <Flex
                    justifyContent="start"
                    onClick={() => setOpenProfile(!openProfile)}
                >
                    {openProfile ? (
                        <MinusCircleIcon className="text-kaytu-600 w-4" />
                    ) : (
                        <PlusCircleIcon className="text-kaytu-600 w-4" />
                    )}
                    <Text className="text-kaytu-600 ml-1 mt-1 mb-2">
                        Specify your AWS CLI profile
                    </Text>
                </Flex>

                {openProfile && (
                    <TextInput
                        className="mb-4"
                        placeholder="AWS CLI profile"
                        onChange={(e) => setProfile(e.target.value)}
                    />
                )}

                {orgOrSingle === 'organization' && (
                    <>
                        <Flex
                            justifyContent="start"
                            className="text-kaytu-600"
                            onClick={() => setOpenOU(!openOU)}
                        >
                            {openOU ? (
                                <MinusCircleIcon className="text-kaytu-600 w-4" />
                            ) : (
                                <PlusCircleIcon className="text-kaytu-600 w-4" />
                            )}
                            <Text className="text-kaytu-600 ml-1 mt-1 mb-2">
                                Specify organization units to onboard
                            </Text>
                        </Flex>

                        {openOU && (
                            <TextInput
                                value={ou}
                                className="mb-2"
                                placeholder="OUs to onboard (separated by comma)"
                                onChange={(e) => setOU(e.target.value)}
                            />
                        )}
                    </>
                )}
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
