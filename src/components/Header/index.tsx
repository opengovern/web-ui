import { Button, Flex, Title } from '@tremor/react'
import { ReactNode } from 'react'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { useNavigate } from 'react-router-dom'
import DateRangePicker from '../DateRangePicker'
import Filter from '../Filter'

interface IHeader {
    title: string
    filter?: boolean
    datePicker?: boolean
    children?: ReactNode
    breadCrumb?: (string | undefined)[]
}

export default function Header({
    title,
    filter = false,
    datePicker = false,
    children,
    breadCrumb,
}: IHeader) {
    const navigate = useNavigate()
    return (
        <Flex className="mb-6 h-[38px]">
            {breadCrumb ? (
                <Flex justifyContent="start">
                    <Button
                        onClick={() => navigate('./..')}
                        variant="light"
                        className="text-lg mr-2 hover:text-kaytu-600"
                    >
                        {title}
                    </Button>
                    {breadCrumb.map((page) => (
                        <Flex key={page} justifyContent="start">
                            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                            <Button
                                onClick={() => navigate('./..')}
                                variant="light"
                                className="text-black opacity-100 ml-2 text-lg"
                                disabled
                            >
                                {page}
                            </Button>
                        </Flex>
                    ))}
                </Flex>
            ) : (
                <Title className="font-semibold whitespace-nowrap">
                    {title}
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
