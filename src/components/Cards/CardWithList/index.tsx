import {
    Bold,
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
import {
    JSXElementConstructor,
    Key,
    ReactElement,
    ReactNode,
    useState,
} from 'react'
import {
    exactPriceDisplay,
    numericDisplay,
} from '../../../utilities/numericDisplay'
import Spinner from '../../Spinner'

type IProps = {
    title?: string
    tabs?: string[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any
    loading?: boolean
    listTitle?: string
    isPercentage?: boolean
    valueIsPrice?: boolean
}

type Item = {
    name: any
    value: string | number | undefined
}

export default function CardWithList({
    title = '',
    tabs = [],
    data = {},
    loading = false,
    listTitle = '',
    isPercentage = false,
    valueIsPrice = false,
}: IProps) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const value = (item: Item) => {
        if (isPercentage) {
            return item.value
        }
        if (valueIsPrice) {
            return exactPriceDisplay(item.value)
        }
        return numericDisplay(item.value)
    }

    // eslint-disable-next-line consistent-return
    const tabDetails = (tab: string) => {
        try {
            return data[tab]?.map((item: Item, i: number) => (
                <ListItem className={`${i === 0 && 'pt-4'}`}>
                    <Text className="w-4/5 truncate">{item.name}</Text>
                    {item.value && <Text>{value(item)}</Text>}
                </ListItem>
            ))
        } catch (e) {
            return null
        }
    }

    return loading ? (
        <Card>
            <Flex className="h-56">
                <Spinner />
            </Flex>
        </Card>
    ) : (
        <Card>
            <Title className="font-semibold">{title}</Title>
            <TabGroup
                index={selectedIndex}
                onIndexChange={setSelectedIndex}
                className="mt-3"
            >
                <TabList>
                    {tabs.map((item) => (
                        <Tab key={item}>{item}</Tab>
                    ))}
                </TabList>
            </TabGroup>
            <List>
                <Flex justifyContent="between">
                    <Bold>{listTitle}</Bold>
                </Flex>
                {tabDetails(tabs[selectedIndex])}
            </List>
        </Card>
    )
}
