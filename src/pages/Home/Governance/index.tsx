import { Card, Col, Flex, Grid, Icon, Title } from '@tremor/react'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'
import Compliance from './Compliance'
import Findings from './Findings'

export default function Governance() {
    return (
        <Card>
            <Flex justifyContent="start" className="gap-2 mb-4">
                <Icon icon={ShieldCheckIcon} className="p-0" />
                <Title className="font-semibold">Governance</Title>
            </Flex>
            <Grid numItems={3} className="w-full gap-8">
                <Col numColSpan={2}>
                    <Findings />
                </Col>
                <Compliance />
            </Grid>
        </Card>
    )
}
