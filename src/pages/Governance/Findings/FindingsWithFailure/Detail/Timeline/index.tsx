import { Flex, Icon, Text, Title } from '@tremor/react'
import { XCircleIcon } from '@heroicons/react/24/solid'
import { severityBadge } from '../../../../Controls'

export default function Timeline() {
    return (
        <Flex
            flexDirection="col"
            justifyContent="start"
            alignItems="start"
            className="gap-10 relative"
        >
            <div
                className="absolute w-0.5 h-full bg-gray-200 z-10 top-1"
                style={{ left: 'calc(20% + 51px)' }}
            />
            <Flex alignItems="start" className="gap-6 z-20">
                <Flex flexDirection="col" alignItems="end" className="w-1/3">
                    <Title>Time</Title>
                    <Text>Time</Text>
                </Flex>
                <Icon
                    icon={XCircleIcon}
                    color="rose"
                    size="xl"
                    className="p-0"
                />
                <Flex flexDirection="col" alignItems="start" className="gap-1">
                    <Title>Some random title</Title>
                    <Flex className="w-fit gap-4">
                        {severityBadge('critical')}
                        <Text className="pl-4 border-l border-l-gray-200">
                            Section:
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
            <Flex alignItems="start" className="gap-6 z-20">
                <Flex flexDirection="col" alignItems="end" className="w-1/3">
                    <Title>Time</Title>
                    <Text>Time</Text>
                </Flex>
                <Icon
                    icon={XCircleIcon}
                    color="rose"
                    size="xl"
                    className="p-0"
                />
                <Flex flexDirection="col" alignItems="start" className="gap-1">
                    <Title>Some random title</Title>
                    <Flex className="w-fit gap-4">
                        {severityBadge('critical')}
                        <Text className="pl-4 border-l border-l-gray-200">
                            Section:
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
            <Flex alignItems="start" className="gap-6 z-20">
                <Flex flexDirection="col" alignItems="end" className="w-1/3">
                    <Title>Time</Title>
                    <Text>Time</Text>
                </Flex>
                <Icon
                    icon={XCircleIcon}
                    color="rose"
                    size="xl"
                    className="p-0"
                />
                <Flex flexDirection="col" alignItems="start" className="gap-1">
                    <Title>Some random title</Title>
                    <Flex className="w-fit gap-4">
                        {severityBadge('critical')}
                        <Text className="pl-4 border-l border-l-gray-200">
                            Section:
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
            <Flex alignItems="start" className="gap-6 z-20">
                <Flex flexDirection="col" alignItems="end" className="w-1/3">
                    <Title>Time</Title>
                    <Text>Time</Text>
                </Flex>
                <Icon
                    icon={XCircleIcon}
                    color="rose"
                    size="xl"
                    className="p-0"
                />
                <Flex flexDirection="col" alignItems="start" className="gap-1">
                    <Title>Some random title</Title>
                    <Flex className="w-fit gap-4">
                        {severityBadge('critical')}
                        <Text className="pl-4 border-l border-l-gray-200">
                            Section:
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}
