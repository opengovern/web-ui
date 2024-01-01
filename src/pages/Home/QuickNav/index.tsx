import {
    BanknotesIcon,
    DocumentChartBarIcon,
    ServerStackIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { Button, Card, Col, Flex, Grid, Icon, Text, Title } from '@tremor/react'
import { useNavigate, useParams } from 'react-router-dom'

const navList = [
    {
        title: 'Assets',
        description: 'Gain visibility over your cloud assets',
        icon: ServerStackIcon,
        link: '/:ws/assets',
    },
    {
        title: 'Spend',
        description: 'Dig down into your cloud spend',
        icon: BanknotesIcon,
        link: '/:ws/spend',
    },
    {
        title: 'Compliance',
        description: 'Have control over your security',
        icon: ShieldCheckIcon,
        link: '/:ws/compliance',
    },
    {
        title: 'Insights',
        description: 'Get actionable insights',
        icon: DocumentChartBarIcon,
        link: '/:ws/insights',
    },
]

interface INavItems {
    title: string
    items: {
        title: string
        description: string
        icon: any
        link: string
    }[]
}

function NavItems({ title, items }: INavItems) {
    const workspace = useParams<{ ws: string }>().ws
    const navigate = useNavigate()
    return (
        <>
            <Title>{title}</Title>
            <Grid
                numItemsLg={4}
                numItemsMd={2}
                numItemsSm={2}
                className="w-full gap-2 mt-2"
            >
                {items.map((item) => {
                    return (
                        <Col>
                            <Flex
                                flexDirection="row"
                                alignItems="center"
                                justifyContent="center"
                                className="w-full hover:border hover:shadow-md p-2 rounded-sm h-20 cursor-pointer"
                                onClick={() =>
                                    navigate(
                                        item.link.replaceAll(
                                            ':ws',
                                            workspace || ''
                                        )
                                    )
                                }
                            >
                                <Icon
                                    variant="light"
                                    icon={item.icon}
                                    size="lg"
                                    color="blue"
                                    className="mr-2"
                                />

                                {/* <item.icon className="w-12" /> */}
                                <Flex
                                    flexDirection="col"
                                    justifyContent="start"
                                    alignItems="start"
                                    className="ml-2"
                                >
                                    <Title className="w-fit truncate">
                                        {item.title}
                                    </Title>
                                    <Text className="w-fit truncate">
                                        {item.description}
                                    </Text>
                                </Flex>
                            </Flex>
                            {/* </Button> */}
                        </Col>
                    )
                })}
            </Grid>
        </>
    )
}

export default function QuickNav() {
    return (
        <Card className="h-full mb-2">
            <Flex flexDirection="row" className="space-x-2">
                <Flex flexDirection="col" alignItems="start">
                    <NavItems title="Quick Navigation" items={navList} />
                </Flex>
            </Flex>
        </Card>
    )
}
