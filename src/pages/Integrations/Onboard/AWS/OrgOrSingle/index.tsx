import { Bold, Button, Flex, Text } from '@tremor/react'
import { useState } from 'react'
import Steps from '../../../../../components/Steps'

interface IOrgOrSinglePage {
    onPrev: () => void
    onNext: (value: 'organization' | 'single') => void
}

export function OrgOrSinglePage({ onPrev, onNext }: IOrgOrSinglePage) {
    const [option, setOption] = useState<'organization' | 'single'>(
        'organization'
    )

    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" alignItems="start">
                <Steps steps={4} currentStep={1} />
                <Text>Select one of the two options:</Text>
                <Flex flexDirection="col" className="w-full mt-2">
                    <Flex
                        flexDirection="row"
                        justifyContent="start"
                        className="mb-2 w-full"
                        onClick={() => setOption('organization')}
                    >
                        <input
                            type="radio"
                            name="aws"
                            checked={option === 'organization'}
                        />
                        <Text className="ml-3 w-4/5 text-black">
                            Onboard an AWS Organization and member accounts
                        </Text>
                    </Flex>
                    <Flex
                        flexDirection="row"
                        justifyContent="start"
                        onClick={() => setOption('single')}
                    >
                        <input
                            type="radio"
                            name="aws"
                            checked={option === 'single'}
                        />
                        <Text className="ml-3 text-black">
                            Onboard individual AWS Account
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={() => onPrev()}>
                    Back
                </Button>
                <Button onClick={() => onNext(option)} className="ml-3">
                    Next
                </Button>
            </Flex>
        </Flex>
    )
}
