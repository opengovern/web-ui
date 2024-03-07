import { useParams } from 'react-router-dom'
import { Col, Flex, Grid } from '@tremor/react'
import Governance from './Governance'
import Spend from './Spend'
import TopHeader from '../../components/Layout/Header'
import ScoreKPIs from './ScoreKPIs'
import { defaultHomepageTime } from '../../utilities/urlstate'

export default function Overview() {
    const { ws } = useParams()
    const element = document.getElementById('myDIV')?.offsetHeight
    return (
        <>
            <TopHeader
                datePicker
                datePickerDefault={defaultHomepageTime(ws || '')}
            />
            <Grid numItems={6} className="w-full gap-4 h-fit mb-4">
                <Col numColSpan={6}>
                    <ScoreKPIs />
                </Col>
            </Grid>
            <Grid numItems={6} className="w-full gap-6 h-fit">
                <Col numColSpan={6}>
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        className="gap-4"
                        id="myDIV"
                    >
                        <Spend />
                        <Governance />
                    </Flex>
                </Col>
            </Grid>
        </>
    )
}
