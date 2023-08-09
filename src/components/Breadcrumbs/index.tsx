import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { Button, Flex } from '@tremor/react'

type IProps = {
    pages: {
        name: string | undefined
        path: (() => void) | string
        current: boolean
    }[]
}

export default function Breadcrumbs({ pages }: IProps) {
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

    const handleOnClick = (path: (() => void) | string) => {
        return () => {
            if (typeof path === 'string') {
                // do nothing
            } else {
                path()
            }
        }
    }
    return (
        <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
                <li>
                    <Button
                        onClick={handleOnClick(pages[0].path)}
                        variant="light"
                        className="text-sm font-medium hover:text-blue-600"
                        aria-current={pages[0].current ? 'page' : undefined}
                    >
                        {pages[0].name}
                    </Button>
                </li>
                {newPages().map((page) => (
                    <li key={page.name}>
                        <Flex alignItems="center">
                            <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-600" />
                            <Button
                                onClick={handleOnClick(page.href)}
                                variant="light"
                                className={`${
                                    page.current
                                        ? 'text-black opacity-100'
                                        : 'hover:text-blue-600'
                                } ml-4 text-sm font-medium`}
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
