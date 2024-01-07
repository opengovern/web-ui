import { Flex, Title } from '@tremor/react'
import { useParams } from 'react-router-dom'
import { ReactNode } from 'react'
import TopHeader from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'
import Notification from '../Notification'
import { KaytuIcon } from '../../icons/icons'

type IProps = {
    children: ReactNode
    filter?: boolean
    datePicker?: boolean
    breadCrumb?: (string | undefined)[]
    currentPage:
        | 'home'
        | 'insights'
        | 'assets'
        | 'spend'
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
    hfull?: boolean
}

export default function Layout({
    children,
    currentPage,
    showSidebar = true,
    hfull = false,
    filter = false,
    datePicker = false,
    breadCrumb,
}: IProps) {
    const workspace = useParams<{ ws: string }>().ws

    return (
        <Flex className="h-screen overflow-hidden">
            {showSidebar && (
                <Sidebar workspace={workspace} currentPage={currentPage} />
            )}

            <div className="z-10 w-full h-full relative bg-kaytu-950">
                <TopHeader
                    filter={filter}
                    datePicker={datePicker}
                    breadCrumb={breadCrumb}
                />
                <Notification />
                <Flex
                    flexDirection="col"
                    alignItems="center"
                    className="mt-16 bg-gray-100 dark:bg-gray-900 h-screen overflow-y-scroll overflow-x-hidden"
                    id="kaytu-container"
                >
                    <Flex
                        justifyContent="center"
                        className={`px-12 ${hfull ? 'h-full' : ''}`}
                    >
                        <div
                            className={`${
                                currentPage === 'settings' ? '' : 'max-w-7xl'
                            } w-full py-8 ${hfull ? 'h-full' : ''}`}
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
