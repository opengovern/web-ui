import { Flex } from '@tremor/react'
import { useParams } from 'react-router-dom'
import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'

type IProps = {
    children: ReactNode
    currentPage:
        | 'home'
        | 'insight'
        | 'assets'
        | 'spend'
        | 'integration'
        | 'benchmarks'
        | 'settings'
        | 'stack'
        | 'finder'
        | '404'
    showSidebar?: boolean
}

export default function Menu({
    children,
    currentPage,
    showSidebar = true,
}: IProps) {
    const workspace = useParams<{ ws: string }>().ws
    return (
        <Flex flexDirection="row" className="h-screen overflow-hidden">
            {showSidebar && (
                <Sidebar workspace={workspace} currentPage={currentPage} />
            )}
            <div
                className="z-10 w-full h-full relative"
                style={{ backgroundColor: '#1F2737' }}
            >
                <Header workspace={workspace} />
                <Flex
                    flexDirection="col"
                    alignItems="center"
                    className="mt-16 bg-gray-100 dark:bg-gray-900 h-screen overflow-y-scroll"
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
