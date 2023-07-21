import { Button, Flex, Tab, TabGroup, TabList, Text } from '@tremor/react'
import { DocumentIcon, PlayCircleIcon } from '@heroicons/react/24/outline'
import LoggedInLayout from '../../components/LoggedInLayout'

const navigation = [{ name: 'hi', icon: true }]

export default function Finder() {
    return (
        <LoggedInLayout currentPage="finder">
            <Flex alignItems="start" className="h-full gap-x-6">
                <Flex className="w-56 h-full border-r border-gray-300">
                    <ul className="w-full space-y-1.5">
                        {navigation.map((item) => (
                            <li key={item.name}>
                                {item.name === '' ? (
                                    <div className="text-gray-500 font-semibold group flex gap-x-3 p-1">
                                        {item.icon}
                                        {item.name}
                                    </div>
                                ) : (
                                    <Text
                                        className={`
                                            (item.page === currentSubPage ||
                                            (!currentSubPage &&
                                                item.page === 'entitlement')
                                                ? 'bg-blue-100 rounded-lg text-gray-800'
                                                : 'text-gray-500',
                                            'font-medium group flex gap-x-3 py-2 px-10')
                                        `}
                                    >
                                        {item.name}
                                    </Text>
                                )}
                            </li>
                        ))}
                    </ul>
                </Flex>
                <Flex flexDirection="col">
                    <textarea className="w-full" />
                    <Flex justifyContent="end" className="gap-x-6 mt-4">
                        <Button
                            variant="light"
                            color="gray"
                            icon={DocumentIcon}
                        >
                            New Query
                        </Button>
                        <Button icon={PlayCircleIcon}>Run Script</Button>
                    </Flex>
                    <TabGroup className="mt-6">
                        <TabList>
                            <Tab>Get Started</Tab>
                            <Tab>Result</Tab>
                        </TabList>
                    </TabGroup>
                </Flex>
            </Flex>
        </LoggedInLayout>
    )
}
