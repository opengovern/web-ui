import { Button, Flex, Title } from '@tremor/react'
import { ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import {
    kebabCaseToLabel,
    snakeCaseToLabel,
} from '../../../utilities/labelMaker'
import DateRangePicker from '../../DateRangePicker'
import Filter from '../../Filter'

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

    return (
        <div className="px-12 z-10 absolute top-2 w-full flex h-16 items-center justify-center gap-x-4 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 shadow-sm rounded-tl-2xl">
            <Flex className="max-w-7xl">
                {subPages().length > 0 ? (
                    <Flex justifyContent="start">
                        <Button
                            onClick={() =>
                                navigate(
                                    goBack(
                                        subPages().length > 1
                                            ? subPages().length
                                            : 1
                                    )
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
                                            goBack(subPages().length - i - 1)
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
                <Flex justifyContent="end">
                    {children}
                    {datePicker && <DateRangePicker />}
                    {filter && <Filter />}
                </Flex>
            </Flex>
        </div>
    )
}
