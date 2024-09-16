import {
    Badge,
    Button,
    Card,
    Flex,
    Icon,
    Subtitle,
    Text,
    Title,
} from '@tremor/react'
import { ChevronRightIcon, LinkIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { numericDisplay } from '../../../utilities/numericDisplay'
import { AWSAzureIcon, AWSIcon, AzureIcon } from '../../../icons/icons'
import {
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityTier,
    SourceType,
} from '../../../api/api'
import { searchAtom } from '../../../utilities/urlstate'

interface IConnectorCard {
    connector: string | undefined
    title: string | undefined
    status: string | undefined
    count: number | undefined
    description: string | undefined
    tier?: GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityTier
    logo?: string
}
export const getConnectorsIcon = (connector: SourceType[], className = '') => {
    if (connector?.length >= 2) {
        return (
            <img
                src={AWSAzureIcon}
                alt="connector"
                className="min-w-[36px] w-9 h-9 rounded-full"
            />
        )
    }

    const connectorIcon = () => {
        if (connector[0] === SourceType.CloudAzure) {
            return AzureIcon
        }
        if (connector[0] === SourceType.CloudAWS) {
            return AWSIcon
        }
        return undefined
    }

    return (
        <Flex className={`w-9 h-9 gap-1 ${className}`}>
            <img
                src={connectorIcon()}
                alt="connector"
                className="min-w-[36px] w-9 h-9 rounded-full"
            />
        </Flex>
    )
}

export const getConnectorIcon = (
    connector: string | SourceType[] | SourceType | undefined | string[],
    className = ''
) => {
    const connectorIcon = () => {
        if (String(connector).toLowerCase() === 'azure') {
            return AzureIcon
        }
        if (String(connector).toLowerCase() === 'aws') {
            return AWSIcon
        }
        if(connector?.length && connector?.length > 0) {
             if (String(connector[0]).toLowerCase() === 'azure') {
                 return AzureIcon
             }
             if (String(connector[0]).toLowerCase() === 'aws') {
                 return AWSIcon
             }

        }
        return undefined
    }

    return (
        <Flex className={`w-9 h-9 gap-1 ${className}`}>
            <img
                src={connectorIcon()}
                alt="connector"
                className="min-w-[36px] w-9 h-9 rounded-full"
            />
        </Flex>
    )
}

const getBadgeColor = (status: string | undefined) => {
    if (status === 'enabled') {
        return 'emerald'
    }
    return 'rose'
}

const getTierBadgeColor = (
    tier?: GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityTier
) => {
    if (
        tier ===
        GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityTier.TierCommunity
    ) {
        return 'emerald'
    }
    return 'violet'
}
export default function ConnectorCard({
    connector,
    title,
    status,
    count,
    description,
    tier,
    logo,
}: IConnectorCard) {
    const navigate = useNavigate()
    const searchParams = useAtomValue(searchAtom)

    const button = () => {
        if (status === 'enabled' && (count || 0) > 0) {
            return <Button className="w-full mt-10">Manage</Button>
        }
        if (
            tier ===
            GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityTier.TierCommunity
        ) {
            return <Button className="w-full mt-10">Connect</Button>
        }
        return <Button className="w-full mt-10">Install</Button>
    }

    const onClick = () => {
        if (status === 'enabled' && (count || 0) > 0) {
            navigate(`${connector}?${searchParams}`)
            return
        }
        if (
            tier ===
            GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityTier.TierCommunity
        ) {
            navigate(`${connector}?${searchParams}`)
            return
        }
        navigate(`${connector}/../../request-access?connector=${connector}`) // it's a hack!
    }

    return (
        <Card
            key={connector}
            className="cursor-pointer"
            onClick={() => onClick()}
        >
            <Flex flexDirection="row" className="mb-3">
                {logo === undefined || logo === '' ? (
                    <LinkIcon className="w-9 h-9 gap-1" />
                ) : (
                    <Flex className="w-9 h-9 gap-1">
                        <img
                            src={logo}
                            alt="Connector Logo"
                            className="min-w-[36px] w-9 h-9 rounded-full"
                        />
                    </Flex>
                )}
                <Badge color={getTierBadgeColor(tier)}>
                    {tier ===
                    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityTier.TierCommunity ? (
                        <Text color="emerald">Community</Text>
                    ) : (
                        <Text color="violet">Enterprise</Text>
                    )}
                </Badge>
                {/* <Badge color={getTierBadgeColor(tier)}>
                    {tier ===
                    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityTier.TierCommunity ? (
                        <Text color="emerald">Community</Text>
                    ) : (
                        <Text color="emerald">Enterprise</Text>
                    )}
                </Badge>
                <Badge color={getBadgeColor(status)}>
                    {status === 'enabled' ? (
                        <Text color="emerald">Active</Text>
                    ) : (
                        <Text color="rose">InActive</Text>
                    )}
                </Badge> */}
            </Flex>
            <Flex flexDirection="row" className="mb-1">
                <Title className="font-semibold">{title}</Title>
                {(count || 0) !== 0 && (
                    <Title className="font-semibold">
                        {numericDisplay(count)}
                    </Title>
                )}
            </Flex>
            <Subtitle>{description}</Subtitle>
            <Flex flexDirection="row" justifyContent="end">
                {button()}
            </Flex>
        </Card>
    )
}
