import { Flex } from '@tremor/react'
import { useParams } from 'react-router-dom'
import { ReactNode, UIEvent } from 'react'
import TopHeader from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'
import Notification from '../Notification'

type IProps = {
    children: ReactNode
    headerChildren?: ReactNode | undefined
    filter?: boolean
    datePicker?: boolean
    breadCrumb?: (string | undefined)[]
    currentPage:
        | 'home'
        | 'insights'
        | 'assets'
        | 'spend'
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
    const workspace = useParams<{ ws: string }>().ws

    return (
        <Flex className="h-screen overflow-hidden">
            {showSidebar && (
                <Sidebar workspace={workspace} currentPage={currentPage} />
            )}

            <div className="z-10 w-full h-full relative">
                <TopHeader
                    filter={filter}
                    datePicker={datePicker}
                    breadCrumb={breadCrumb}
                >
                    {headerChildren}
                </TopHeader>
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
