import { Button, Flex, Text, TextInput } from '@tremor/react'
import { CheckIcon } from '@heroicons/react/20/solid'

interface INode {
    first?: boolean
    done?: boolean
    running?: boolean
    text?: string
}

function Node({ first, done, running, text }: INode) {
    const roundStyles = () => {
        if (done) {
            return 'bg-kaytu-500'
        }
        if (running) {
            return 'border-2 border-kaytu-500 bg-white'
        }
        return 'border-2 border-gray-300 bg-white'
    }
    return (
        <>
            {!first && (
                <Flex className="relative" aria-hidden="true">
                    <div
                        className={`h-4 w-0.5 ml-4 ${
                            running || done ? 'bg-kaytu-500' : 'bg-gray-200'
                        }`}
                    />
                </Flex>
            )}
            <Flex flexDirection="row">
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    className={`relative h-8 w-8 rounded-full ${roundStyles()}`}
                >
                    {done && (
                        <CheckIcon
                            className={`h-5 w-5 font-extrabold ${
                                done ? 'text-white' : ''
                            }`}
                            aria-hidden="true"
                        />
                    )}

                    {running && (
                        <span
                            className="h-2.5 w-2.5 rounded-full bg-kaytu-500"
                            aria-hidden="true"
                        />
                    )}
                </Flex>
                <Flex className="pl-3">
                    <Text className="font-medium text-sm text-gray-800">
                        {text}
                    </Text>
                </Flex>
            </Flex>
        </>
    )
}

interface IStatus {
    workspaceName?: string
}

export function Status({ workspaceName }: IStatus) {
    return (
        <Flex justifyContent="start" className="h-full" alignItems="start">
            <Flex
                className="w-1/3 h-full"
                flexDirection="col"
                alignItems="start"
            >
                <Text className="font-bold text-sm text-gray-800">
                    In Progress
                </Text>
                <Text className="text-sm text-gray-800 mb-4">
                    Kaytu is working on creating your workspace
                </Text>
                <Node first running text="Creating Workspace" />
                <Node text="Gathering Inventory" />
                <Node text="Reviewing Infrastructure & Cost" />
                <Node text="Evaluating Compliances" />
                <Node text="Gathering Insights" />
                <Node text="Finishing Up" />
            </Flex>
            <Flex className="w-2/3 h-full" flexDirection="col">
                <Text>Start the game</Text>
            </Flex>
        </Flex>
    )
}
