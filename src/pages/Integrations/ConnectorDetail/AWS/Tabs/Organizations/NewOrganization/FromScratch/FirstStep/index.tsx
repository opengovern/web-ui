import {
    Bold,
    Button,
    Card,
    Flex,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    Text,
} from '@tremor/react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import clipboardCopy from 'clipboard-copy'
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import { CLITabs } from '../../../../../../../../../components/Layout/CLIMenu'

interface IStep {
    onNext: () => void
    onPrevious: () => void
}

export default function FirstStep({ onNext, onPrevious }: IStep) {
    const [showCopied, setShowCopied] = useState<boolean>(false)

    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" alignItems="start">
                <Bold className="my-6">Configure your AWS Organization</Bold>
                <Text>
                    Please configure your AWS organization using Kaytu CLI or
                    refer to this guide to configure it manually:
                </Text>
                <TabGroup>
                    <TabList className="mt-2">
                        <Tab>Kaytu CLI</Tab>
                        <Tab>Manual</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Text className="my-2 font-bold">
                                Download the CLI:
                            </Text>
                            <CLITabs />
                            <Text className="my-2 font-bold">
                                Then run this command:
                            </Text>
                            <Flex
                                flexDirection="row"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Card
                                    className="w-2/3 text-gray-800 font-mono cursor-pointer p-2.5"
                                    onClick={() => {
                                        setShowCopied(true)
                                        setTimeout(() => {
                                            setShowCopied(false)
                                        }, 2000)
                                        clipboardCopy('kaytu bootstrap aws')
                                    }}
                                >
                                    <Flex flexDirection="row">
                                        <Text className="px-1.5 text-gray-800">
                                            kaytu bootstrap aws
                                        </Text>
                                        <Flex
                                            flexDirection="col"
                                            className="h-5 w-5"
                                        >
                                            <DocumentDuplicateIcon className="h-5 w-5 text-kaytu-600 cursor-pointer" />
                                            <Text
                                                className={`${
                                                    showCopied ? '' : 'hidden'
                                                } absolute -bottom-4 bg-kaytu-600 text-white rounded-md p-1`}
                                            >
                                                Copied!
                                            </Text>
                                        </Flex>
                                    </Flex>
                                </Card>
                            </Flex>
                        </TabPanel>
                        <TabPanel>
                            <Button variant="light">
                                <Link
                                    to="https://kaytu.io/docs/latest/onboard_aws/"
                                    target="_blank"
                                >
                                    Refer to guide, by clicking this link
                                </Link>
                            </Button>
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={() => onPrevious()}>
                    Cancel
                </Button>
                <Button onClick={() => onNext()} className="ml-3">
                    Next
                </Button>
            </Flex>
        </Flex>
    )
}
