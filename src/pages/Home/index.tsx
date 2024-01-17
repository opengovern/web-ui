import { Col, Flex, Grid } from '@tremor/react'
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
            <Grid numItems={6} className="w-full gap-4 h-fit mb-4">
                <Col numColSpan={6}>
                    <QuickNav />
                </Col>
                {/* <Col numColSpan={2}> */}
                {/*     <Integration /> */}
                {/* </Col> */}
            </Grid>
            <Grid numItems={6} className="w-full gap-4 h-fit">
                <Col numColSpan={4}>
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
                <Col numColSpan={2}>
                    <Query height={element} />
                </Col>
            </Grid>
        </>
    )
}
