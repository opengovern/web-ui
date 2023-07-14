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
    title?: any
    tabs?: any
    data?: any
    loading?: boolean
    listTitle?: string
    isPercentage?: boolean
    valueIsPrice?: boolean
}

type Item = {
    name:
        | boolean
        | Key
        | ReactElement<any, string | JSXElementConstructor<any>>
        | Iterable<ReactNode>
        | null
        | undefined
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
            return data[tab]?.map((item: Item) => (
                <ListItem>
                    <Text className="w-4/5 truncate">{item.name}</Text>
                    {item.value && <Text>{value(item)}</Text>}
                </ListItem>
            ))
        } catch (e) {
            console.log(e)
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
            <Title>{title}</Title>
            <TabGroup
                index={selectedIndex}
                onIndexChange={setSelectedIndex}
                className="mt-3"
            >
                <TabList>
                    {tabs.map((item: any) => (
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