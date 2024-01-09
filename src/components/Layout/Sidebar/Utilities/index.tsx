import { Flex, Text } from '@tremor/react'
import { Link } from 'react-router-dom'
import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline'
import JobsMenu from '../JobsMenu'
import CLIMenu from '../CLIMenu'
import Profile from '../Profile'

interface IUtilities {
    isCollapsed: boolean
}

export default function Utilities({ isCollapsed }: IUtilities) {
    return (
        <Flex
            flexDirection="col"
            alignItems="start"
            justifyContent="start"
            className="p-2 gap-0.5 border-t border-t-gray-700"
        >
            <Text className="ml-3 mt-2 mb-2">UTILITIES</Text>
            <JobsMenu isCollapsed={isCollapsed} />
            <CLIMenu isCollapsed={isCollapsed} />
            <Link
                to="https://kaytu.io/docs"
                target="_blank"
                className="w-full px-6 py-2 flex items-center rounded-md gap-2.5 text-gray-50 hover:bg-kaytu-800"
            >
                <ChatBubbleLeftEllipsisIcon className="h-5 w-5 stroke-2 text-gray-400" />
                <Text className="text-inherit">Support</Text>
            </Link>
            <Profile isCollapsed={isCollapsed} />
        </Flex>
    )
}
