import { useParams } from 'react-router-dom'
import { Col, Flex, Grid } from '@tremor/react'
import Governance from './Governance'
import Spend from './Spend'
import TopHeader from '../../components/Layout/Header'
import ScoreKPIs from './ScoreKPIs'
import { defaultHomepageTime } from '../../utilities/urlstate'
import Query from './Query'
import SummaryCard from '../../components/Cards/SummaryCard'
import QuickNav from './QuickNav'
import Shortcuts from './Shortcuts'
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
            {/* <Grid numItems={4} className="w-full gap-4 h-fit mb-4">
                <Col numColSpan={1}>
                    <SummaryCard
                        title="Accounts"
                        metric={100}
                        metricPrev={0}
                        loading={false}
                    />
                </Col>
                <Col numColSpan={1}>
                    <SummaryCard
                        title="Accounts"
                        metric={100}
                        metricPrev={0}
                        loading={false}
                    />
                </Col>
                <Col numColSpan={1}>
                    <SummaryCard
                        title="Accounts"
                        metric={100}
                        metricPrev={0}
                        loading={false}
                    />
                </Col>
                <Col numColSpan={1}>
                    <SummaryCard
                        title="Accounts"
                        metric={100}
                        metricPrev={0}
                        loading={false}
                    />
                </Col>
            </Grid> */}
            <Grid numItems={6} className="w-full gap-4 h-fit mb-7">
                <Col numColSpan={6}>
                    {/* <ScoreKPIs /> */}
                    {/* <QuickNav /> */}
                    <Shortcuts />
                </Col>
            </Grid>

            <Grid numItems={6} className="w-full gap-7 h-fit">
                <Col numColSpan={4}>
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        className="gap-4"
                        id="myDIV"
                    >
                        <Grid numItems={6} className="w-full gap-4 h-fit mb-4">
                            <Col numColSpan={6}>
                                <ScoreKPIs />
                                {/* <QuickNav /> */}
                            </Col>
                        </Grid>
                        <Governance />
                        {/* <Spend/> */}
                    </Flex>
                </Col>
                <Col numColSpan={2}>
                    <Query height={800} />
                </Col>
            </Grid>
            {/* <Grid numItems={6} className="w-full gap-6 h-fit mt-4">
               
                
            </Grid> */}
        </>
    )
}
