import {
    Card,
    Flex,
    Grid,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    Title,
} from '@tremor/react'
import ReactJson from '@microlink/react-json-view'
import { useEffect, useState } from 'react'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiFindingEvent } from '../../../../../api/api'
import { getConnectorIcon } from '../../../../../components/Cards/ConnectorCard'
import DrawerPanel from '../../../../../components/DrawerPanel'
import SummaryCard from '../../../../../components/Cards/SummaryCard'
import { dateTimeDisplay } from '../../../../../utilities/dateDisplay'
import { severityBadge, statusBadge } from '../../../Controls'
import FindingDetail from '../../FindingsWithFailure/Detail'
import { useComplianceApiV1FindingsSingleDetail } from '../../../../../api/compliance.gen'

interface IFindingDetail {
    event: GithubComKaytuIoKaytuEnginePkgComplianceApiFindingEvent | undefined
    open: boolean
    onClose: () => void
}

export default function EventDetail({ event, open, onClose }: IFindingDetail) {
    const [openFinding, setOpenFinding] = useState(false)
    const { response: finding, sendNow } =
        useComplianceApiV1FindingsSingleDetail(
            event?.findingID || '',
            {},
            false
        )
    useEffect(() => {
        if (event) {
            sendNow()
        }
    }, [event])
    return (
        <DrawerPanel
            open={open}
            onClose={onClose}
            title={
                <Flex justifyContent="start">
                    {getConnectorIcon(event?.connector)}
                    <Title className="text-lg font-semibold ml-2 my-1">
                        {event?.providerConnectionName}
                    </Title>
                </Flex>
            }
        >
            <Grid className="w-full gap-4 mb-6" numItems={2}>
                <SummaryCard
                    title="Account ID"
                    metric={event?.providerConnectionID}
                    isString
                />
                <SummaryCard
                    title="Account Name"
                    metric={event?.providerConnectionName}
                    isString
                />
                <SummaryCard
                    title="Resource ID"
                    metric={event?.resourceID}
                    isString
                />
                <SummaryCard
                    title="Resource Type"
                    metric={event?.resourceType}
                    isString
                />
            </Grid>
            <TabGroup>
                <TabList>
                    <Tab>Summary</Tab>
                    <Tab>Resource Details</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Grid className="w-full gap-4" numItems={2}>
                            <SummaryCard
                                title="Event ID"
                                metric={event?.id}
                                isString
                            />
                            <SummaryCard
                                title="Date"
                                metric={dateTimeDisplay(event?.evaluatedAt)}
                                isString
                            />
                            <SummaryCard
                                title="Finding"
                                metric=""
                                onClick={() => setOpenFinding(true)}
                                isString
                            />
                            <SummaryCard
                                title="Severity"
                                metric={severityBadge(event?.severity)}
                                isString
                            />
                            <SummaryCard
                                title="State"
                                metric={statusBadge(event?.conformanceStatus)}
                                isString
                            />
                            <SummaryCard
                                title="Control ID"
                                metric={event?.controlID}
                                isString
                            />
                        </Grid>
                    </TabPanel>
                    <TabPanel>
                        <Title className="mb-2">JSON</Title>
                        <Card className="px-1.5 py-3 mb-2">
                            <ReactJson src={event || {}} />
                        </Card>
                    </TabPanel>
                </TabPanels>
            </TabGroup>
            <FindingDetail
                finding={finding}
                type="finding"
                open={openFinding}
                onClose={() => setOpenFinding(false)}
            />
        </DrawerPanel>
    )
}
