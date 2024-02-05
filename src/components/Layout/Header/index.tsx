import { useAtomValue } from 'jotai'
import { Button, Flex, Title } from '@tremor/react'
import { ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import {
    kebabCaseToLabel,
    snakeCaseToLabel,
} from '../../../utilities/labelMaker'
import DateRangePicker from './DatePicker'
import Filter from './Filter'
import { searchAtom } from '../../../utilities/urlstate'
import NewDatePicker from './NewDatePicker'

interface IHeader {
    filter?: boolean
    datePicker?: boolean
    children?: ReactNode
    breadCrumb?: (string | undefined)[]
}

export default function TopHeader({
    filter = false,
    datePicker = false,
    children,
    breadCrumb,
}: IHeader) {
    const navigate = useNavigate()
    const searchParams = useAtomValue(searchAtom)
    const url = window.location.pathname.split('/')

    const mainPage = () => {
        if (url[1] === 'billing') {
            return 'Usage & Billing'
        }
        return url[2] ? kebabCaseToLabel(url[2]) : 'Workspaces'
    }

    const subPages = () => {
        const pages = []
        for (let i = 3; i < url.length; i += 1) {
            pages.push(kebabCaseToLabel(url[i]))
        }
        return pages
    }

    const goBack = (n: number) => {
        let temp = '.'
        for (let i = 0; i < n; i += 1) {
            temp += '/..'
        }
        return temp
    }

    document.title = `${mainPage()} | Kaytu`

    return (
        <div className="px-12 z-10 absolute top-0 left-0 w-full flex h-16 items-center justify-center gap-x-4 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 shadow-sm">
            <Flex className="max-w-7xl">
                {subPages().length > 0 ? (
                    <Flex justifyContent="start">
                        <Button
                            onClick={() =>
                                navigate(
                                    `${goBack(
                                        subPages().length > 1
                                            ? subPages().length
                                            : 1
                                    )}?${searchParams}`
                                )
                            }
                            variant="light"
                            className="!text-lg mr-2 hover:text-kaytu-600"
                        >
                            {mainPage()}
                        </Button>
                        {subPages().map((page, i) => (
                            <Flex
                                key={page}
                                justifyContent="start"
                                className="w-fit mr-2"
                            >
                                <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                                <Button
                                    onClick={() =>
                                        navigate(
                                            `${goBack(
                                                subPages().length - i - 1
                                            )}?${searchParams}`
                                        )
                                    }
                                    variant="light"
                                    className={`${
                                        i === subPages().length - 1
                                            ? 'text-black'
                                            : ''
                                    } opacity-100 ml-2 !text-lg`}
                                    disabled={i === subPages().length - 1}
                                >
                                    {i === subPages().length - 1 &&
                                    breadCrumb?.length
                                        ? breadCrumb
                                        : snakeCaseToLabel(page)}
                                </Button>
                            </Flex>
                        ))}
                    </Flex>
                ) : (
                    <Title className="font-semibold !text-xl whitespace-nowrap">
                        {mainPage()}
                    </Title>
                )}
                <Flex className="gap-4" justifyContent="end">
                    {children}
                    {filter && <Filter />}
                    {datePicker && <NewDatePicker />}
                </Flex>
            </Flex>
        </div>
    )
}
