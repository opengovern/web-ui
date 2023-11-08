import { Flex } from '@tremor/react'
import { useParams } from 'react-router-dom'
import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'
import Notification from '../Notification'

type IProps = {
    children: ReactNode
    currentPage:
        | 'home'
        | 'insights'
        | 'infrastructure'
        | 'spend'
        | 'integrations'
        | 'compliance'
        | 'service-advisor'
        | 'settings'
        | 'stack'
        | 'rules'
        | 'alerts'
        | 'finder'
        | '404'
    showSidebar?: boolean
}

export default function Layout({
    children,
    currentPage,
    showSidebar = true,
}: IProps) {
    const workspace = useParams<{ ws: string }>().ws

    return (
        <Flex className="h-screen overflow-hidden">
            {showSidebar && (
                <Sidebar workspace={workspace} currentPage={currentPage} />
            )}
            <div className="z-10 w-full h-full relative bg-kaytu-950">
                <Header workspace={workspace} />
                <Notification />
                <Flex
                    flexDirection="col"
                    alignItems="center"
                    className="mt-16 bg-gray-100 dark:bg-gray-900 h-screen overflow-y-scroll overflow-x-hidden"
                    id="kaytu-container"
                >
                    <Flex justifyContent="center" className="px-12">
                        <div className="max-w-7xl w-full py-8">{children}</div>
                    </Flex>
                    <Footer />
                </Flex>
            </div>
        </Flex>
    )
}
