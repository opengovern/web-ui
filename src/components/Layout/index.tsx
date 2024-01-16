import { Flex } from '@tremor/react'
import { ReactNode, UIEvent } from 'react'
import Footer from './Footer'
import Sidebar from './Sidebar'
import Notification from '../Notification'

type IProps = {
    children: ReactNode
    showSidebar?: boolean
    hFull?: boolean
    onScroll?: (e: UIEvent) => void
    scrollRef?: any
}

export default function Layout({
    children,
    showSidebar = true,
    hFull = false,
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
                                current === 'settings' ? '' : 'max-w-7xl'
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
