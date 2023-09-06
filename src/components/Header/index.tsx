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
        return kebabCaseToLabel(url[2])
    }

    const subPages = () => {
        const pages = []
        for (let i = 3; i < url.length; i += 1) {
            pages.push(kebabCaseToLabel(url[i]))
        }
        return pages
    }

    return (
        <Flex className="mb-6 h-[38px]">
            {subPages().length > 0 ? (
                <Flex justifyContent="start">
                    <Button
                        onClick={() => navigate('./..')}
                        variant="light"
                        className="text-lg mr-2 hover:text-kaytu-600"
                    >
                        {mainPage()}
                    </Button>
                    {subPages().map((page, i) => (
                        <Flex key={page} justifyContent="start">
                            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                            <Button
                                onClick={() => navigate('./..')}
                                variant="light"
                                className="text-black opacity-100 ml-2 text-lg"
                                disabled={i === subPages().length - 1}
                            >
                                {Number(page) ? breadCrumb : page}
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
