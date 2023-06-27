import { Card, Flex, Grid, Icon, Text } from '@tremor/react'
import { ReactComponent as AWSIcon } from '../../../assets/icons/elements-supplemental-provider-logo-aws-original.svg'
import { ReactComponent as CloudIcon } from '../../../assets/icons/icon-cloud.svg'
import { ReactComponent as AzureIcon } from '../../../assets/icons/elements-supplemental-provider-logo-azure-new.svg'

interface IInsightDescriptionCard {
    metric: any
}

const getProviderIcon = (provider: string) => {
    switch (true) {
        case provider === 'AWS':
            return (
                <Icon icon={AWSIcon} size="lg" color="orange" variant="solid" />
            )
        case provider === 'Azure':
            return <Icon icon={AzureIcon} size="lg" variant="solid" />

        default:
            return <Icon icon={CloudIcon} size="lg" variant="solid" />
    }
}

export default function InsightDescriptionCard({
    metric,
}: IInsightDescriptionCard) {
    return (
        <Card className="h-full">
            <Flex flexDirection="row">
                {getProviderIcon(metric?.connector)}
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    justifyContent="between"
                    className="ml-3"
                >
                    <Text>
                        {metric?.description
                            ? metric?.description
                            : 'No description'}
                    </Text>
                    {metric?.links && metric?.links.length > 0 && (
                        <Flex
                            flexDirection="col"
                            className="divide-y divide-solid"
                        >
                            <Text>Links</Text>
                            <Grid>
                                {metric.links.map(
                                    (link: string, index: number) => (
                                        <a href={link}>Doc {index + 1}</a>
                                    )
                                )}
                            </Grid>
                        </Flex>
                    )}
                </Flex>
            </Flex>
        </Card>
    )
}
