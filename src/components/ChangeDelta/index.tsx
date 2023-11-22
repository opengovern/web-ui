import { BadgeDelta, DeltaType, Flex, Text } from '@tremor/react'
import { numberDisplay } from '../../utilities/numericDisplay'

interface IChangeDelta {
    deltaType: DeltaType | undefined
    change: string | number | undefined
    isDelta?: boolean
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

export default function ChangeDelta({
    deltaType,
    change,
    isDelta,
}: IChangeDelta) {
    return (
        <Flex className="w-fit min-w-fit gap-1 h-full">
            <BadgeDelta size="sm" deltaType={deltaType} />
            <Text color={changeColor(deltaType)}>{`${numberDisplay(
                change,
                isDelta ? 0 : 2
            )} ${isDelta ? '' : '%'}`}</Text>
        </Flex>
    )
}
