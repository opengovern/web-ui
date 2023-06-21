import {
    Card,
    TabList,
    Tab,
    Text,
    Flex,
    Button,
    Title,
    TabGroup,
    List,
    ListItem,
    Bold,
} from "@tremor/react";
import { ArrowLongRightIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'
import {useInventoryApiV1ResourcesTopRegionsList} from '../../../api/inventory.gen'
import {numericDisplay} from '../../../utilities/numericDisplay'
import {REGIONS} from '../../../utilities/regions'
import Spinner from '../../Spinner'

type IProps = {
    count?: any
    provider?: any
    connections?: any
}

export default function Region({
    count = 5,
    provider,
    connections,
}: IProps) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [formatedData, setFormatedData] = useState<any>(undefined)
    const [tabs, setTabs] = useState<string[]>([])
    const query = {
        count: count,
        ...(provider && {connector: provider}),
        ...(connections && {connectionId: connections})
    }
    const {response, isLoading} = useInventoryApiV1ResourcesTopRegionsList(query)
    const formatData = (data: any[] | undefined) => {
        let output = Object.create(null)
        if (!data) {
            return {
                location: 'No data',
                value: 0,
                resources: [],
            }
        }
        data.map(item => {
            const location = REGIONS[item.location as keyof typeof REGIONS]
            if (output[location.country as keyof typeof output]) {
                output[location.country as keyof typeof output].total += item.resourceCount
                output[location.country as keyof typeof output].resources.push({
                    location: item.location,
                    value: item.resourceCount,
                })
            } else {
                output[location.country as keyof typeof output] = {
                    total: item.resourceCount,
                    resources: [{
                        location: item.location,
                        value: item.resourceCount,
                    }],
                }
            }
        })
        return output
    }

    useEffect(() => {
        try {
            const newData = formatData(response)
            setFormatedData(newData)
            setTabs(Object.keys(newData))
        }
        catch (e) {
            console.log(e)
        }
    }, [response])

    const tabDetails = (tab: string) => {
        const data = formatedData[tab]
        try {
            return (
                data.resources.map((resource: any) => (
                    <ListItem key={resource.location}>
                        <Text>{resource.location}</Text>
                        <Flex justifyContent="end" className="space-x-2">
                            <Text>{numericDisplay(resource.value)}</Text>
                        </Flex>
                    </ListItem>
                ))
            )
        }
        catch (e) {
            console.log(e)
        }
    }

    const render = () => (
        <Card>
            <Flex alignItems="start">
                <Title>Top {count} Locations</Title>
            </Flex>
            <TabGroup index={selectedIndex} onIndexChange={setSelectedIndex} className="mt-6">
                <TabList>
                    {formatedData && tabs.map((item) => (
                        <Tab key={item}>{item}</Tab>
                    ))}
                </TabList>
            </TabGroup>
            <List className="mt-4">
                <Flex className="mt-8" justifyContent="between">
                    <Bold>Total Resources</Bold>
                    <Bold>{numericDisplay(formatedData[tabs[selectedIndex]].total)}</Bold>
                </Flex>
                {tabDetails(tabs[selectedIndex])}
            </List>

            <Flex className="mt-6 pt-4 border-t">
                <Button size="xs" variant="light" icon={ArrowLongRightIcon} iconPosition="right">
                    View more
                </Button>
            </Flex>
        </Card>
    )

    return (
            isLoading ? (
                    <Card>
                        <div className="flex items-center justify-center h-96">
                            <Spinner />
                        </div>
                    </Card>
            ) :
                render()
    )
}