import { Flex } from '@tremor/react'
import { ReactNode, UIEvent } from 'react'
import Footer from './Footer'
import Sidebar from './Sidebar'
import Notification from '../Notification'
import AssistantSidebar from './AssistantSidebar'

type IProps = {
    children: ReactNode
    onScroll?: (e: UIEvent) => void
    scrollRef?: any
}

export default function Layout({ children, onScroll, scrollRef }: IProps) {
    const url = window.location.pathname.split('/')
    const current = url[2]
    const workspace = url[1]
    const showSidebar =
        workspace !== 'workspaces' &&
        workspace !== 'billing' &&
        workspace !== 'requestdemo' &&
        current !== 'assistant'

    return (
        <Flex
            flexDirection="row"
            className="h-screen overflow-hidden"
            justifyContent="start"
        >
            {showSidebar && (
                <Sidebar workspace={workspace} currentPage={current} />
            )}
            {current === 'assistant' && (
                <AssistantSidebar workspace={workspace} currentPage={current} />
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
                                : 'px-12 mt-16 h-fit'
                        } `}
                    >
                        <div
                            className={`w-full ${
                                current === 'dashboard' ? '' : 'max-w-7xl'
                            } ${
                                current === 'assistant'
                                    ? 'w-full max-w-full'
                                    : ''
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
