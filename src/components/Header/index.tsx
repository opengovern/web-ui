import { Button, Flex, Title } from '@tremor/react'
import { ReactNode } from 'react'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { useNavigate } from 'react-router-dom'
import DateRangePicker from '../DateRangePicker'
import Filter from '../Filter'
import { kebabCaseToLabel } from '../../utilities/labelMaker'

interface IHeader {
    filter?: boolean
    datePicker?: boolean
    children?: ReactNode
    breadCrumb?: (string | undefined)[]
}

export default function Header({
    filter = false,
    datePicker = false,
    children,
    breadCrumb,
}: IHeader) {
    const navigate = useNavigate()
    const url = window.location.pathname.split('/')

    const mainPage = () => {
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
        <Flex className="mb-6 h-[38px]">
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
                        className="text-lg mr-2 hover:text-kaytu-600"
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
                                onClick={() => navigate(goBack(i + 1))}
                                variant="light"
                                className={`${
                                    i === subPages().length - 1
                                        ? 'text-black'
                                        : ''
                                } opacity-100 ml-2 text-lg`}
                                disabled={i === subPages().length - 1}
                            >
                                {i === subPages().length - 1 &&
                                breadCrumb?.length
                                    ? breadCrumb
                                    : page}
                            </Button>
                        </Flex>
                    ))}
                </Flex>
            ) : (
                <Title className="font-semibold whitespace-nowrap">
                    {mainPage()}
                </Title>
            )}
            <Flex justifyContent="end" alignItems="start">
                {children}
                {datePicker && <DateRangePicker />}
                {filter && <Filter />}
            </Flex>
        </Flex>
    )
}
