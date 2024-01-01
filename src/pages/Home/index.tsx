import { Col, Grid } from '@tremor/react'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import QuickNav from './QuickNav'
import Query from './Query'
import TopSpend from './TopSpend'
import Insight from './Insights'
import Integration from './Integration'
import Compliance from './Compliance'
import Findings from './Findings'

export default function Home() {
    return (
        <Layout currentPage="home">
            <Header />
            <QuickNav />
            <Grid
                numItemsLg={3}
                numItemsMd={2}
                numItemsSm={1}
                className="gap-2"
            >
                <Col numColSpan={1}>
                    <div className="space-y-2">
                        <Integration />
                        <Query id="smartquery-238" />
                    </div>
                </Col>
                <Col numColSpan={1}>
                    <div className="space-y-2">
                        <Compliance />
                        <Findings />
                    </div>
                </Col>
                <Col numColSpan={1}>
                    <div className="space-y-2">
                        <TopSpend />
                        <Insight />
                    </div>
                </Col>
            </Grid>
        </Layout>
    )
}
