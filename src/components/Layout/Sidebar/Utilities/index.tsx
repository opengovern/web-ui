import { Flex, Text } from '@tremor/react'
import { Link } from 'react-router-dom'
import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline'
import JobsMenu from './JobsMenu'
import CLIMenu from './CLIMenu'
import Profile from './Profile'

interface IUtilities {
    isCollapsed: boolean
    workspace: string | undefined
}

export default function Utilities({ isCollapsed, workspace }: IUtilities) {
    return (
        <Flex
            flexDirection="col"
            alignItems="start"
            justifyContent="start"
            className="p-2 gap-0.5 border-t border-t-gray-700 h-fit min-h-fit"
        >
            {!isCollapsed && <Text className="my-2 !text-xs">UTILITIES</Text>}
            <JobsMenu isCollapsed={isCollapsed} workspace={workspace} />
            <CLIMenu isCollapsed={isCollapsed} />
            <Link
                to={`/${workspace}/assistant`}
                className={`w-full px-6 py-2 mb-3 flex items-center rounded-md gap-2.5 text-gray-50 hover:bg-kaytu-800 ${
                    isCollapsed ? '!p-2' : ''
                }`}
            >
                <ChatBubbleLeftEllipsisIcon className="h-5 w-5 stroke-2 text-gray-400" />
                {!isCollapsed && (
                    <Text className="text-inherit">Assistant</Text>
                )}
            </Link>
            <Profile isCollapsed={isCollapsed} />
        </Flex>
    )
}
