import { Grid } from '@tremor/react'
import SummaryCard from '../../../../../components/Cards/SummaryCard'
import { numericDisplay } from '../../../../../utilities/numericDisplay'

interface IAWSSummary {
    account: any
    accountLoading: boolean
    credential: any
    credentialLoading: boolean
}

export default function AWSSummary({
    account,
    accountLoading,
    credential,
    credentialLoading,
}: IAWSSummary) {
    return (
        <Grid numItemsMd={2} numItemsLg={3} className="w-full gap-3 mt-6 mb-10">
            <SummaryCard
                title="Onboarded AWS Accounts"
                metric={String(numericDisplay(account?.connectionCount))}
                loading={accountLoading}
            />
            <SummaryCard
                title="Unhealthy Accounts"
                metric={String(numericDisplay(account?.totalUnhealthyCount))}
                loading={accountLoading}
            />
            <SummaryCard
                title="Organization Count"
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
