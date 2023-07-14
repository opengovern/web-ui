import { Card, Flex, Grid, Title } from '@tremor/react'
import SummaryCard from '../../../../../components/Cards/SummaryCard'
import CardWithList from '../../../../../components/Cards/CardWithList'
import Chart from '../../../../../components/Charts'

export default function Summary() {
    return (
        <Flex flexDirection="col">
            <Grid numItems={2} numItemsMd={4} className="w-full gap-3 mb-3">
                <SummaryCard title="Number of active alarms" metric={10} />
                <SummaryCard title="Resources with alarms" metric={10} />
                <SummaryCard title="Resources with alarms" metric={10} />
                <SummaryCard title="Coverage" metric={10} />
            </Grid>
            <Grid numItems={1} numItemsMd={2} className="w-full gap-3 mb-3">
                <CardWithList
                    title="Top Services"
                    tabs={['Resources', 'Resource Type', 'Services']}
                    data={{}}
                />
                <Card>
                    <Title>Summary</Title>
                </Card>
            </Grid>
            <Card>
                <Title>Compliance Trend Growth</Title>
                <Chart
                    index="date"
                    type="line"
                    categories={['count']}
                    data={[]}
                />
            </Card>
        </Flex>
    )
}
