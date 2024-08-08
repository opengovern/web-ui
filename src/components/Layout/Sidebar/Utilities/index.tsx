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
            <Profile isCollapsed={isCollapsed} />
        </Flex>
    )
}
