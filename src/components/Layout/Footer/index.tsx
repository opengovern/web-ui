import { Flex, Text } from '@tremor/react'

export default function Footer() {
    return (
        <Flex
            justifyContent="center"
            className="px-12 mb-16 py-3 border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 shadow-sm"
        >
            <Flex
                flexDirection="row"
                justifyContent="center"
                className="max-w-7xl w-full"
            >
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <Text>Copyright © 2024 Kaytu, Inc.</Text>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            </Flex>
        </Flex>
    )
}
