import { Flex } from '@tremor/react'
import LoggedInLayout from '../../components/LoggedInLayout'
import InsightCategories from './InsightCategories'

export default function Insights() {
    return (
        <LoggedInLayout>
            <Flex>
                <InsightCategories />
            </Flex>
        </LoggedInLayout>
    )
}
