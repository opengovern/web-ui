import {
    Bold,
    Button,
    Card,
    Flex,
    List,
    ListItem,
    Tab,
    TabGroup,
    TabList,
    Text,
    Title,
} from '@tremor/react'
import { ArrowLongRightIcon } from '@heroicons/react/24/solid'
import {
    JSXElementConstructor,
    Key,
    ReactElement,
    ReactNode,
    useEffect,
    useState,
} from 'react'
import { useInventoryApiV1ResourcesTopRegionsList } from '../../../api/inventory.gen'
import { numericDisplay } from '../../../utilities/numericDisplay'
import { REGIONS } from '../../../utilities/regions'
import Spinner from '../../Spinner'

type IProps = {
    // count?: any
    // provider?: any
    // connections?: any
    title?: any
    tabs?: any
    data?: any
    loading?: boolean
    listTitle?: string
}

export default function CardWithList({
    title = '',
    tabs = [],
    data = {},
    loading = false,
    listTitle = '',
}: IProps) {
    const [selectedIndex, setSelectedIndex] = useState(0)

    // eslint-disable-next-line consistent-return
    const tabDetails = (tab: string) => {
        try {
            return data[tab].map(
                (item: {
                    name:
                        | boolean
                        | Key
                        | ReactElement<any, string | JSXElementConstructor<any>>
                        | Iterable<ReactNode>
                        | null
                        | undefined
                    value: string | number | undefined
                }) => (
                    <ListItem>
                        <Text>{item.name}</Text>
                        {item.value && (
                            <Flex justifyContent="end" className="space-x-2">
                                <Text>{numericDisplay(item.value)}</Text>
                            </Flex>
                        )}
                    </ListItem>
                )
            )
        } catch (e) {
            console.log(e)
            return null
        }
    }

    const render = () => (
        <Card>
            <Flex alignItems="start">
                <Title>{title}</Title>
            </Flex>
            <TabGroup
                index={selectedIndex}
                onIndexChange={setSelectedIndex}
                className="mt-6"
            >
                <TabList>
                    {/* {formattedData && */}
                    {/*    tabs.map((item) => <Tab key={item}>{item}</Tab>)} */}
                    {tabs.map((item: any) => (
                        <Tab key={item}>{item}</Tab>
                    ))}
                </TabList>
            </TabGroup>
            <List className="mt-4">
                <Flex className="mt-8" justifyContent="between">
                    <Bold>{listTitle}</Bold>
                </Flex>
                {tabDetails(tabs[selectedIndex])}
            </List>
        </Card>
    )

    return loading ? (
        <Card>
            <div className="flex items-center justify-center h-96">
                <Spinner />
            </div>
        </Card>
    ) : (
        render()
    )
}
