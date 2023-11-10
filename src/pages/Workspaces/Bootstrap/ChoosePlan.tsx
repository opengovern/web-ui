import { Bold, Button, Card, Flex, Text } from '@tremor/react'
import {
    CheckCircleIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/20/solid'

interface IPlan {
    selected: boolean
    onClick: () => void
    name: string
    description: string
    price: string
    priceDescription: string
    features: string[]
    notFeatures: string[]
}
function Plan({
    selected,
    onClick,
    name,
    description,
    price,
    priceDescription,
    features,
    notFeatures,
}: IPlan) {
    return (
        <Card
            className={`mx-3 w-1/3 cursor-pointer ${
                selected ? 'ring-kaytu-500' : ''
            }`}
            onClick={onClick}
        >
            <Text
                className={`text-base font-bold ${
                    selected ? 'text-kaytu-500' : 'text-gray-800'
                }`}
            >
                {name}
            </Text>
            <Text className="text-sm font-medium text-gray-800">
                {description}
            </Text>
            <div className="pt-4">
                <Bold className="text-2xl font-bold text-gray-800">
                    {price}
                </Bold>
            </div>
            <Text className="text-sm font-normal text-gray-400 border-b border-b-gray-200 pb-6 mb-6">
                {priceDescription}
            </Text>
            {features.map((feature) => {
                return (
                    <Flex flexDirection="row" justifyContent="start">
                        <CheckCircleIconSolid className="text-emerald-400 w-4 mr-2" />
                        <Text className="text-gray-600 text-sm font-normal">
                            {feature}
                        </Text>
                    </Flex>
                )
            })}
            {notFeatures.map((notFeature) => {
                return (
                    <Flex flexDirection="row" justifyContent="start">
                        <CheckCircleIconSolid className="text-gray-300 w-4 mr-2" />
                        <Text className="text-gray-600 text-sm font-normal">
                            {notFeature}
                        </Text>
                    </Flex>
                )
            })}
        </Card>
    )
}

interface IChooseYourPlan {
    open: boolean
    tier: string
    setTier: (tier: string) => void
    done: boolean
    onDone: () => void
}
export function ChooseYourPlan({
    open,
    tier,
    setTier,
    done,
    onDone,
}: IChooseYourPlan) {
    return (
        <div className="p-6 border-b border-b-gray-200">
            <Flex justifyContent="between">
                <Flex alignItems="start" justifyContent="start">
                    <CheckCircleIcon
                        height={20}
                        className={done ? 'text-emerald-500' : 'text-gray-500'}
                    />
                    <Text className="ml-2 text-sm text-gray-800">
                        1. Choose your plan
                    </Text>
                </Flex>
                <div>
                    {open ? (
                        <ChevronUpIcon height={20} color="text-blue-500" />
                    ) : (
                        <ChevronDownIcon height={20} color="text-blue-500" />
                    )}
                </div>
            </Flex>
            {open && (
                <div className="m-6">
                    <Flex justifyContent="start">
                        <Plan
                            name="Trial"
                            description="Basic Kaytu plan"
                            price="Free"
                            priceDescription="7 Days"
                            selected={tier === 'FREE'}
                            onClick={() => setTier('FREE')}
                            features={['We run it on the cloud for you']}
                            notFeatures={[]}
                        />
                        <Plan
                            name="Enterprise"
                            description="Access to full features"
                            price="8$"
                            priceDescription="Per host, per month *"
                            selected={tier === 'ENTERPRISE'}
                            onClick={() => setTier('ENTERPRISE')}
                            features={['We run it on the cloud for you']}
                            notFeatures={[]}
                        />
                    </Flex>
                    <Flex justifyContent="start" className="m-3">
                        <Button onClick={onDone}>Next</Button>
                    </Flex>
                </div>
            )}
        </div>
    )
}
