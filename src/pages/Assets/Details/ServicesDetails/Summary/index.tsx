import {
    Bold,
    Card,
    Flex,
    List,
    ListItem,
    Metric,
    Text,
    Title,
} from '@tremor/react'
import { useAtom } from 'jotai'
import dayjs from 'dayjs'
import { numericDisplay } from '../../../../../utilities/numericDisplay'
import { useInventoryApiV2ServicesMetricList } from '../../../../../api/inventory.gen'
import { filterAtom, timeAtom } from '../../../../../store'
import Spinner from '../../../../../components/Spinner'

type IProps = {
    totalServices?: number
    totalServicesLoading: boolean
}
export default function Summary({
    totalServices,
    totalServicesLoading,
}: IProps) {
    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)
    const [selectedConnections, setSelectedConnections] = useAtom(filterAtom)

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

    return (
        <div className="gap-y-10 mt-[24px]">
            <div className="flex flex-row justify-between">
                <Metric>Services</Metric>
                <div className="flex flex-row items-baseline">
                    <Metric className="mr-2">
                        {totalServicesLoading ? (
                            <Spinner />
                        ) : (
                            numericDisplay(totalServices)
                        )}
                    </Metric>
                    <Text>Total Services</Text>
                </div>
            </div>
            <div className="flex flex-row gap-x-10 mt-4">
                <Card key="TopXServices" className="h-fit">
                    <Flex justifyContent="start" className="space-x-4">
                        <Title className="truncate">Popular Services</Title>
                    </Flex>
                    {topServicesLoading ? (
                        <Spinner className="py-20" />
                    ) : (
                        <List className="mt-2 mb-2">
                            {topServices?.services?.map((thing: any) => (
                                <ListItem key={thing.service_label}>
                                    <Text>{thing.service_label}</Text>
                                    <Text>
                                        <Bold>
                                            {numericDisplay(
                                                thing.resource_count
                                            )}
                                        </Bold>{' '}
                                    </Text>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Card>
                <Card key="TopXFastest" className="h-fit">
                    <Flex justifyContent="start" className="space-x-4">
                        <Title className="truncate">
                            Top Fast-Growing Services
                        </Title>
                    </Flex>
                    {topFastestServicesLoading ? (
                        <Spinner className="py-20" />
                    ) : (
                        <List className="mt-2 mb-2">
                            {topFastestServices?.services?.map((thing: any) => (
                                <ListItem key={thing.service_label}>
                                    <Text>{thing.service_label}</Text>
                                    <Text>
                                        <Bold>
                                            {numericDisplay(
                                                thing.resource_count
                                            )}
                                        </Bold>{' '}
                                    </Text>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Card>
            </div>
        </div>
    )
}
