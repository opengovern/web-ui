import {
    ArrowTopRightOnSquareIcon,
    BanknotesIcon,
    ChevronRightIcon,
    CubeIcon,
    CursorArrowRaysIcon,
    PuzzlePieceIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { Card, Flex, Grid, Icon, Text, Title } from '@tremor/react'
import { useNavigate, useParams } from 'react-router-dom'
import Check from '../../../icons/Check.svg'
import User from '../../../icons/User.svg'
import Dollar from '../../../icons/Dollar.svg'
import Cable from '../../../icons/Cable.svg'
import Cube from '../../../icons/Cube.svg'
import { link } from 'fs'
import { useEffect } from 'react'

const navList = [
    {
        title: 'Connect',
        description: 'Setup an integration',
        icon: Cable,
        link: 'integrations',
        new: false,
    },
    {
        title: 'Invite',
        description: 'Invite Users',
        icon: User,
        link: 'settings/authentication?action=invite',
        new: false,
    },
    {
        title: 'Audit',
        description: 'Review',
        icon: Check,
        link: 'compliance',
        new: true,
    },
    {
        title: 'Inventory',
        description:
            'From Code to cloud, see all everything across your landscape',
        icon: Cube,
        link: 'dashboard/infrastructure',
        new: true,
    },
    {
        title: 'Spend',
        description: 'See Cloud Spend across clouds, regions, and accounts',
        icon: Dollar,
        new: false,
        link: 'dashboard/spend-accounts',
    },

    // {
    //     title: 'Insights',
    //     description: 'Get actionable insights',
    //     icon: DocumentChartBarIcon,
    //     link: '/:ws/insights',
    // },
]

// const SvgToComponent = (item: any) => {
//     return item.icon
// }

export default function Shortcuts() {
    const workspace = useParams<{ ws: string }>().ws
    const navigate = useNavigate()

    return (
        <Card>
            <Flex justifyContent="start" className="gap-2 mb-4">
                <Icon icon={CursorArrowRaysIcon} className="p-0" />
                <Title className="font-semibold">Shortcuts</Title>
            </Flex>
            <Grid numItems={5} className="w-full mb-4 gap-4">
                {navList.map((nav, i) => (
                    <>
                        <a
                            href={`/ws/${workspace}/${nav.link}`}
                            target={nav.new ? '_blank' : '_self'}
                        >
                            <Card className=" bg-[#F6F8FC] cursor-pointer h-40">
                                <Flex
                                    flexDirection="col"
                                    justifyContent="start"
                                    alignItems="start"
                                    className="gap-2"
                                >
                                    <img src={nav.icon} />
                                    <Text className="font-semibold flex flex-row items-center">
                                        {nav.title}
                                        <ChevronRightIcon className="p-0 w-3 h-3" />
                                    </Text>
                                    <Text className="text-sm">
                                        {nav.description}
                                    </Text>
                                </Flex>
                            </Card>
                        </a>
                    </>
                ))}
            </Grid>
        </Card>
    )
}
