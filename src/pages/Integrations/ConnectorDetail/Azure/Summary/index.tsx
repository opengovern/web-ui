import { Grid } from '@tremor/react'
import SummaryCard from '../../../../../components/Cards/SummaryCard'
import { numericDisplay } from '../../../../../utilities/numericDisplay'

interface IAzureSummary {
    account: any
    accountLoading: boolean
    credential: any
    credentialLoading: boolean
}

export default function AzureSummary({
    account,
    accountLoading,
    credential,
    credentialLoading,
}: IAzureSummary) {
    return (
        <Grid numItemsMd={2} numItemsLg={3} className="w-full gap-3 mt-6 mb-10">
            <SummaryCard
                title="Onboarded Azure Subscriptions"
                metric={String(numericDisplay(account?.connectionCount))}
                loading={accountLoading}
            />
            <SummaryCard
                title="Unhealthy Connections"
                metric={String(numericDisplay(account?.totalUnhealthyCount))}
                loading={accountLoading}
            />
            <SummaryCard
                title="Service Prencipals"
                metric={String(
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    numericDisplay(credential?.totalCredentialCount)
                )}
                loading={credentialLoading}
            />
        </Grid>
    )
}
