import { Card, Col, Flex, Grid, Icon, Title } from '@tremor/react'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'
import Compliance from './Compliance'
import Findings from './Findings'

export default function Governance() {
    return (
        <Card className="border-0 ring-0 !shadow-sm">
            {/* <Flex justifyContent="start" className="gap-2 mb-4">
                <Icon icon={ShieldCheckIcon} className="p-0" />
                <Title className="font-semibold">Security</Title>
            </Flex> */}
            <Grid numItems={2} className="w-full gap-10 px-2">
                <Compliance />
                <Col numColSpan={1}>
                    <Findings />
                </Col>
            </Grid>
        </Card>
    )
}
