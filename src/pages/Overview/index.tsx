import { useParams } from 'react-router-dom'
import { Col, Flex, Grid } from '@tremor/react'
import Governance from './Governance'
import Spend from './Spend'
import TopHeader from '../../components/Layout/Header'
import ScoreKPIs from './ScoreKPIs'
import { defaultHomepageTime } from '../../utilities/urlstate'
import Query from './Query'
export default function Overview() {
    const { ws } = useParams()
    const element = document.getElementById('myDIV')?.offsetHeight
    return (
        <>
            <TopHeader
                supportedFilters={['Date']}
                initialFilters={['Date']}
                datePickerDefault={defaultHomepageTime(ws || '')}
            />
            <Grid numItems={6} className="w-full gap-4 h-fit mb-4">
                <Col numColSpan={6}>
                    <ScoreKPIs />
                </Col>
            </Grid>
            <Grid numItems={6} className="w-full gap-6 h-fit">
                <Col numColSpan={4}>
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        className="gap-4"
                        id="myDIV"
                    >
                        <Governance />
                        <Spend />
                    </Flex>
                </Col>
                <Col numColSpan={2}>
                    <Query height={1000} />
                </Col>
            </Grid>
        </>
    )
}
