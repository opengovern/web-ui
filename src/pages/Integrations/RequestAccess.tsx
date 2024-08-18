import { Text } from '@tremor/react'
import TopHeader from '../../components/Layout/Header'

export default function RequestAccess() {
    return (
        <>
            <TopHeader />
            <Text>
                In order to get access to Enterprise features, please send an
                email to hello@kaytu.io.
            </Text>
        </>
    )
}
