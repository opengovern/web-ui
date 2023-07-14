import { Grid } from '@tremor/react'
import SummaryCard from '../../../components/Cards/SummaryCard'

export default function Summary() {
    // const { response: metrics } = useComplianceApiV1FindingsMetricsList()
    // console.log(metrics)
    return (
        <Grid
            numItems={1}
            numItemsMd={2}
            numItemsLg={3}
            className="w-full gap-3 my-6"
        >
            <SummaryCard title="Number of active alarms" metric="600" />
            <SummaryCard title="Accounts" metric="450" />
            <SummaryCard title="Coverage" metric="10%" />
        </Grid>
    )
}
