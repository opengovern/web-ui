import { Flex } from '@tremor/react'
import { ReactNode, UIEvent } from 'react'
import Footer from './Footer'
import Sidebar from './Sidebar'
import Notification from '../Notification'

type IProps = {
    children: ReactNode
    onScroll?: (e: UIEvent) => void
    scrollRef?: any
}

export default function Layout({ children, onScroll, scrollRef }: IProps) {
    const url = window.location.pathname.split('/')
    if (url[1] === 'ws') {
        url.shift()
    }
    let current = url[2]
    if (url.length > 3) {
        for (let i = 3; i < url.length; i += 1) {
            current += `/${url[i]}`
        }
    }
    const workspace = url[1]
    const showSidebar =
        workspace !== 'workspaces' &&
        workspace !== 'billing' &&
        workspace !== 'requestdemo' &&
        workspace !== 'new-ws' &&
        current !== 'bootstrap' &&
        workspace !== 'callback'

    return (
        <Flex
            flexDirection="row"
            className="h-screen overflow-hidden"
            justifyContent="start"
        >
            {showSidebar && (
                <Sidebar workspace={workspace} currentPage={current} />
            )}
            <div className="z-10 w-full h-full relative">
                <Flex
                    flexDirection="col"
                    alignItems="center"
                    justifyContent="between"
                    className={`bg-gray-100 dark:bg-gray-900 h-screen ${
                        current === 'assistant' ? '' : 'overflow-y-scroll'
                    } overflow-x-hidden`}
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
                        className={`${
                            current === 'assistant'
                                ? 'h-fit'
                                : 'px-12 mt-16 h-fit  pl-48 '
                        } `}
                        // pl-44 
                    >
                        <div
                            className={`w-full ${
                                current === 'dashboard' ? '' : ''
                            } ${
                                current === 'assistant'
                                    ? 'w-full max-w-full'
                                    : 'py-6'
                            }`}
                        >
                            {children}
                        </div>
                    </Flex>
                    <Footer />
                </Flex>
            </div>
            <Notification />
        </Flex>
    )
}
