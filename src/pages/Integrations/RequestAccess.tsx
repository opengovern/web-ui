import { Text, Title } from '@tremor/react'
import { useSearchParams } from 'react-router-dom'
import TopHeader from '../../components/Layout/Header'

export default function RequestAccess() {
    const [searchParams, setSearchParams] = useSearchParams()

    return (
        <>
            <TopHeader />
            <Title className="text-black text-2xl w-full text-center">
                {searchParams.get('connector')} and 50+ others are available for
                Enterprise Users. Get a 30-day obligation trial now.
            </Title>
            <iframe
                title="Try enterprise"
                width="100%"
                style={{ height: 'calc(100vh - 200px)' }}
                src="https://cal.com/team/kaytu-inc/try-enterprise"
            />
        </>
    )
}
