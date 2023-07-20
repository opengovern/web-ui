import { Flex, Text } from '@tremor/react'
import LoggedInLayout from '../../components/LoggedInLayout'

const navigation = [{ name: '', icon: true }]

export default function Finder() {
    return (
        <LoggedInLayout currentPage="finder">
            <Flex>
                <Flex className="w-56">
                    <ul className="space-y-1.5">
                        {navigation.map((item) => (
                            <li key={item.name}>
                                {item.name === '' ? (
                                    <div className="text-gray-500 font-semibold group flex gap-x-3 p-1">
                                        {item.icon}
                                        {item.name}
                                    </div>
                                ) : (
                                    <Text
                                        className={`
                                            (item.page === currentSubPage ||
                                            (!currentSubPage &&
                                                item.page === 'entitlement')
                                                ? 'bg-blue-100 rounded-lg text-gray-800'
                                                : 'text-gray-500',
                                            'font-medium group flex gap-x-3 py-2 px-10')
                                        `}
                                    >
                                        {item.name}
                                    </Text>
                                )}
                            </li>
                        ))}
                    </ul>
                </Flex>
            </Flex>
        </LoggedInLayout>
    )
}
