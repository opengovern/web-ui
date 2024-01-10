import { Col, Grid } from '@tremor/react'
import Layout from '../../components/Layout'
import QuickNav from './QuickNav'
import TopSpend from './TopSpend'
import Integration from './Integration'
import Governance from './Governance'

export default function Home() {
    return (
        <Layout currentPage="home">
            <Grid numItems={6} className="w-full gap-4">
                <Col numColSpan={4}>
                    <QuickNav />
                    <Grid numItems={3} className="w-full gap-4 mb-4">
                        <Integration />
                    </Grid>
                    <Governance />
                </Col>
                <Col numColSpan={2}>query</Col>
            </Grid>
        </Layout>
    )
}
