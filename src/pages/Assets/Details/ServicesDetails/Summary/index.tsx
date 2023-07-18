import {
    BadgeDelta,
    Bold,
    Card,
    Flex,
    Grid,
    List,
    ListItem,
    Metric,
    Text,
    Title,
} from '@tremor/react'
import { useAtomValue } from 'jotai'
import dayjs from 'dayjs'
import { numericDisplay } from '../../../../../utilities/numericDisplay'
import { useInventoryApiV2ServicesMetricList } from '../../../../../api/inventory.gen'
import { filterAtom, timeAtom } from '../../../../../store'
import Spinner from '../../../../../components/Spinner'
import {
    badgeTypeByDelta,
    percentageByChange,
} from '../../../../../utilities/deltaType'

type IProps = {
    totalServices?: number
    totalServicesLoading: boolean
}
export default function Summary({
    totalServices,
    totalServicesLoading,
}: IProps) {
    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const { response: topServices, isLoading: topServicesLoading } =
        useInventoryApiV2ServicesMetricList({
            connector: [selectedConnections?.provider],
            connectionId: selectedConnections?.connections,
            pageSize: 5,
            pageNumber: 1,
            endTime: String(dayjs(activeTimeRange.end.toString()).unix()),
            sortBy: 'count',
        })
    const {
        response: topFastestServices,
        isLoading: topFastestServicesLoading,
    } = useInventoryApiV2ServicesMetricList({
        connector: [selectedConnections?.provider],
        connectionId: selectedConnections?.connections,
        pageSize: 5,
        pageNumber: 1,
        endTime: String(dayjs(activeTimeRange.end.toString()).unix()),
        sortBy: 'growth_rate',
    })
    console.log(topFastestServices)

    return (
        <Flex flexDirection="col" className="mt-6">
            <Flex>
                <Metric>Services</Metric>
                <Flex justifyContent="end" alignItems="end">
                    <Metric className="mr-2">
                        {totalServicesLoading ? (
                            <Spinner />
                        ) : (
                            numericDisplay(totalServices)
                        )}
                    </Metric>
                    <Text>Total Services</Text>
                </Flex>
            </Flex>
            <Grid numItems={1} numItemsMd={2} className="w-full gap-4 mt-3">
                <Card key="TopXServices" className="h-fit">
                    <Flex justifyContent="start" className="space-x-4">
                        <Title className="truncate">Popular Services</Title>
                    </Flex>
                    {topServicesLoading ? (
                        <Spinner className="py-24" />
                    ) : (
                        <List className="mt-2 h-full">
                            {topServices?.services?.map((thing: any) => (
                                <ListItem
                                    key={thing.service_label}
                                    className="py-3"
                                >
                                    <Text>{thing.service_label}</Text>
                                    <Bold>
                                        {numericDisplay(thing.resource_count)}
                                    </Bold>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Card>
                <Card key="TopXFastest" className="h-fit">
                    <Title className="truncate">
                        Top Fast-Growing Services
                    </Title>
                    {topFastestServicesLoading ? (
                        <Spinner className="py-24" />
                    ) : (
                        <List className="mt-2 h-full">
                            {topFastestServices?.services?.map((thing: any) => (
                                <ListItem key={thing.service_label}>
                                    <Text>{thing.service_label}</Text>
                                    <Flex justifyContent="end">
                                        <Bold>
                                            {numericDisplay(
                                                thing.resource_count
                                            )}
                                        </Bold>
                                        <BadgeDelta
                                            className="ml-3"
                                            deltaType={badgeTypeByDelta(
                                                thing.old_resource_count,
                                                thing.resource_count
                                            )}
                                        >
                                            {`${percentageByChange(
                                                thing.old_resource_count,
                                                thing.resource_count
                                            )}%`}
                                        </BadgeDelta>
                                    </Flex>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Card>
            </Grid>
        </Flex>
    )
}
