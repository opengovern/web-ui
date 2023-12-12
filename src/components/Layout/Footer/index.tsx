import { Flex, Text } from '@tremor/react'

export default function Footer() {
    return (
        <Flex
            justifyContent="center"
            className="px-12 mb-16 py-3 border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 shadow-sm"
        >
            <Flex
                flexDirection="row"
                justifyContent="between"
                className="max-w-8xl w-full"
            >
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href="#">
                    <Text>Terms of Use</Text>
                </a>
                <Text>Copyright © 2023 Kaytu, Inc. All rights reserved.</Text>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href="#">
                    <Text>Service Status</Text>
                </a>
            </Flex>
        </Flex>
    )
}
