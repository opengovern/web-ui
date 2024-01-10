import { Card, Col, Flex, Grid, Icon, Title } from '@tremor/react'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'
import Compliance from './Compliance'
import Findings from './Findings'

export default function Governance() {
    return (
        <Card>
            <Flex justifyContent="start" className="mb-4">
                <Icon
                    icon={ShieldCheckIcon}
                    className="bg-gray-50 rounded mr-2"
                />
                <Title>Governance</Title>
            </Flex>
            <Grid numItems={3} className="w-full gap-4">
                <Compliance />
                <Col numColSpan={2}>
                    <Findings />
                </Col>
            </Grid>
        </Card>
    )
}
