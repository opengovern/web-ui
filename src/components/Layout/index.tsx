import { Flex } from '@tremor/react'
import { ReactNode, UIEvent } from 'react'
import Footer from './Footer'
import Sidebar from './Sidebar'
import Notification from '../Notification'

type IProps = {
    children: ReactNode
    headerChildren?: ReactNode | undefined
    filter?: boolean
    datePicker?: boolean
    breadCrumb?: (string | undefined)[]
    currentPage?:
        | 'home'
        | 'insights'
        | 'assets'
        | 'assets-detail-account'
        | 'assets-detail-metric'
        | 'spend'
        | 'spend-detail-account'
        | 'spend-detail-metric'
        | 'spend/accounts'
        | 'spend/metrics'
        | 'integrations'
        | 'compliance'
        | 'service-advisor'
        | 'findings'
        | 'resource-collection'
        | 'settings'
        | 'stack'
        | 'rules'
        | 'alerts'
        | 'query'
        | 'billing'
        | '404'
    showSidebar?: boolean
    hFull?: boolean
    onScroll?: (e: UIEvent) => void
    scrollRef?: any
}

export default function Layout({
    children,
    currentPage,
    showSidebar = true,
    hFull = false,
    headerChildren,
    filter = false,
    datePicker = false,
    breadCrumb,
    onScroll,
    scrollRef,
}: IProps) {
    const url = window.location.pathname.split('/')
    const current = `${url[2]}${url[3] ? `/${url[3]}` : ''}`
    const workspace = url[1]

    return (
        <Flex className="h-screen overflow-hidden">
            {showSidebar && (
                <Sidebar workspace={workspace} currentPage={current} />
            )}
            <div className="z-10 w-full h-full relative">
                <Notification />
                <Flex
                    flexDirection="col"
                    alignItems="center"
                    className="mt-16 bg-gray-100 dark:bg-gray-900 h-screen overflow-y-scroll overflow-x-hidden"
                    id="kaytu-container"
                    onScroll={(e) => {
                        if (onScroll) {
                            onScroll(e)
                        }
                    }}
                    ref={scrollRef}
                >
                    <Flex
                        justifyContent="center"
                        className={`px-12 ${hFull ? 'h-full' : ''}`}
                    >
                        <div
                            className={`${
                                currentPage === 'settings' ? '' : 'max-w-7xl'
                            } w-full py-6 ${hFull ? 'h-full' : ''}`}
                        >
                            {children}
                        </div>
                    </Flex>
                    <Footer />
                </Flex>
            </div>
        </Flex>
    )
}
