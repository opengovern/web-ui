import { Col, Flex, Grid, Title } from '@tremor/react'
import QuickNav from './QuickNav'
import Integration from './Integration'
import Governance from './Governance'
import Query from './Query'
import Spend from './Spend'
import TopHeader from '../../components/Layout/Header'

export default function Home() {
    const element = document.getElementById('myDIV')?.offsetHeight
    return (
        <>
            <TopHeader datePicker />
            <Grid numItems={6} className="w-full gap-4 h-fit">
                <Col numColSpan={4}>
                    <Title className="font-semibold mb-4">
                        Quick navigation
                    </Title>
                    <Flex flexDirection="col" alignItems="start" id="myDIV">
                        <QuickNav />
                        <Grid numItems={3} className="w-full gap-4 mb-4">
                            <Integration />
                            <Col numColSpan={2} className="h-full">
                                <Spend />
                            </Col>
                        </Grid>
                        <Governance />
                    </Flex>
                </Col>
                <Col numColSpan={2}>
                    <Query height={element} />
                </Col>
            </Grid>
        </>
    )
}
