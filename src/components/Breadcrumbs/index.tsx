import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { Button, Flex } from '@tremor/react'
import { useNavigate } from 'react-router-dom'

type IProps = {
    pages: {
        name: any
        path: any
        current: boolean
    }[]
}

export default function Breadcrumbs({ pages }: IProps) {
    const navigate = useNavigate()
    const newPages = () => {
        const nP = []
        for (let i = 1; i < pages.length; i += 1) {
            nP.push({
                name: pages[i].name,
                href: pages[i].path,
                current: pages[i].current,
            })
        }
        return nP
    }
    return (
        <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
                <li>
                    <div>
                        <Button
                            onClick={pages[0].path}
                            variant="light"
                            className={`text-sm font-medium ${
                                pages[0].current
                                    ? 'text-blue-600'
                                    : 'text-gray-900'
                            } hover:text-blue-600`}
                            aria-current={pages[0].current ? 'page' : undefined}
                        >
                            {pages[0].name}
                        </Button>
                    </div>
                </li>
                {newPages().map((page) => (
                    <li key={page.name}>
                        <Flex alignItems="center">
                            <ChevronRightIcon
                                className="h-5 w-5 flex-shrink-0 text-gray-600"
                                aria-hidden="true"
                            />
                            <Button
                                onClick={page.href}
                                variant="light"
                                className={`ml-4 text-sm font-medium ${
                                    page.current
                                        ? 'text-blue-600'
                                        : 'text-gray-900'
                                } hover:text-blue-600`}
                                aria-current={page.current ? 'page' : undefined}
                                disabled={page.current}
                            >
                                {page.name}
                            </Button>
                        </Flex>
                    </li>
                ))}
            </ol>
        </nav>
    )
}
