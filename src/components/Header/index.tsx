import { Flex, Title } from '@tremor/react'
import { ReactNode } from 'react'
import DateRangePicker from '../DateRangePicker'
import ConnectionList from '../ConnectionList'

interface IHeader {
    title: string
    connectionFilter?: boolean
    datePicker?: boolean
    children?: ReactNode
}

export default function Header({
    title,
    connectionFilter = false,
    datePicker = false,
    children,
}: IHeader) {
    return (
        <Flex className="mb-6 h-[38px]">
            <Title className="font-semibold whitespace-nowrap">{title}</Title>
            <Flex justifyContent="end" alignItems="start">
                {children}
                {datePicker && <DateRangePicker />}
                {connectionFilter && <ConnectionList />}
            </Flex>
        </Flex>
    )
}
