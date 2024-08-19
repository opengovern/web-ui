import { Text } from '@tremor/react'
import { useSearchParams } from 'react-router-dom'
import TopHeader from '../../components/Layout/Header'

export default function RequestAccess() {
    const [searchParams, setSearchParams] = useSearchParams()

    return (
        <>
            <TopHeader />
            <Text>
                {searchParams.get('connector')} and 50+ others are available for
                Enterprise Users. Get a 30-day obligation trial now.
            </Text>
            <iframe
                title="Try enterprise"
                src="https://cal.com/team/kaytu-inc/try-enterprise"
            />
        </>
    )
}
