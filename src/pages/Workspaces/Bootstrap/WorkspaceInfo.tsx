import { Button, Flex, Text, TextInput } from '@tremor/react'
import {
    CheckCircleIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

interface IWorkspaceInformation {
    open: boolean
    name: string
    isLoading: boolean
    setName: (name: string) => void
    done: boolean
    errorMessage: string
    onDone: () => void
}
export function WorkspaceInformation({
    open,
    name,
    isLoading,
    setName,
    done,
    errorMessage,
    onDone,
}: IWorkspaceInformation) {
    const navigate = useNavigate()
    return (
        <div className="p-6 border-b border-b-gray-200">
            <Flex justifyContent="between">
                <Flex alignItems="start" justifyContent="start">
                    <CheckCircleIcon
                        height={20}
                        className={done ? 'text-emerald-500' : 'text-gray-500'}
                    />
                    <Text className="ml-2 text-sm text-gray-800">
                        1. Workspace Information
                    </Text>
                </Flex>
                <div>
                    {open ? (
                        <ChevronUpIcon height={20} color="text-blue-500" />
                    ) : (
                        <ChevronDownIcon height={20} color="text-blue-500" />
                    )}
                </div>
            </Flex>
            {open && (
                <div className="m-6">
                    <Flex justifyContent="start">
                        <Text className="font-normal text-sm text-gray-500">
                            Choose a unique name for your workspace.
                        </Text>
                    </Flex>
                    <Flex
                        flexDirection="row"
                        justifyContent="between"
                        className="w-1/2 my-3"
                    >
                        <Text className="font-medium text-sm text-gray-900">
                            Name*
                        </Text>
                        <TextInput
                            value={name}
                            className="w-2/3"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Flex>
                    {errorMessage.length > 0 && (
                        <Flex justifyContent="start">
                            <Text className="font-normal text-sm text-red-700">
                                {errorMessage}
                            </Text>
                        </Flex>
                    )}
                    <Flex justifyContent="start" className="mt-3">
                        <Button onClick={onDone} loading={isLoading}>
                            Next
                        </Button>
                        <Button
                            variant="secondary"
                            className="ml-3"
                            onClick={() => navigate('/')}
                        >
                            Back
                        </Button>
                    </Flex>
                </div>
            )}
        </div>
    )
}
