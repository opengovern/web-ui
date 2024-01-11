import {
    BanknotesIcon,
    ChevronRightIcon,
    CubeIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { Card, Flex, Grid, Icon, Text, Title } from '@tremor/react'
import { useNavigate, useParams } from 'react-router-dom'

const navList = [
    {
        title: 'Assets',
        description: 'Discovery and Query Cloud assets across multiple clouds',
        icon: CubeIcon,
        link: '/:ws/assets',
    },
    {
        title: 'Spend',
        description: 'Understand spend across multiple Cloud providers',
        icon: BanknotesIcon,
        link: '/:ws/spend',
    },
    {
        title: 'Governance',
        description: 'Identify Misconfigurations, Benchmark against',
        icon: ShieldCheckIcon,
        link: '/:ws/compliance',
    },
    // {
    //     title: 'Insights',
    //     description: 'Get actionable insights',
    //     icon: DocumentChartBarIcon,
    //     link: '/:ws/insights',
    // },
]

export default function QuickNav() {
    const workspace = useParams<{ ws: string }>().ws
    const navigate = useNavigate()

    return (
        <Grid numItems={3} className="w-full gap-4 mb-4">
            {navList.map((i) => (
                <Card
                    key={i.title}
                    className="cursor-pointer hover:shadow-xl"
                    onClick={() =>
                        navigate(i.link.replaceAll(':ws', workspace || ''))
                    }
                >
                    <Flex justifyContent="start" className="mb-2">
                        <Icon
                            icon={i.icon}
                            className="bg-gray-50 rounded mr-2"
                        />
                        <Title>{i.title}</Title>
                    </Flex>
                    <Text className="line-clamp-2">{i.description}</Text>
                    <Flex justifyContent="end">
                        <ChevronRightIcon className="h-4 text-kaytu-500" />
                    </Flex>
                </Card>
            ))}
        </Grid>
    )
}
