import { BadgeDelta, DeltaType, Flex, Text } from '@tremor/react'

interface IChangeDelta {
    deltaType: DeltaType | undefined
    change: string | undefined
}

const changeColor = (delta: DeltaType | undefined) => {
    switch (delta) {
        case 'decrease':
        case 'moderateDecrease':
            return 'rose'
        case 'increase':
        case 'moderateIncrease':
            return 'emerald'
        case 'unchanged':
            return 'amber'
        default:
            return 'slate'
    }
}

export default function ChangeDelta({ deltaType, change }: IChangeDelta) {
    return (
        <Flex className="w-fit gap-1">
            <BadgeDelta size="sm" deltaType={deltaType} />
            <Text color={changeColor(deltaType)}>{`${change} %`}</Text>
        </Flex>
    )
}
