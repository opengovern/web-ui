import { TrashIcon } from '@heroicons/react/24/outline'
import { Radio } from 'pretty-checkbox-react'
import { Button, Card, Flex, Icon, Text } from '@tremor/react'
import DefaultConditionSelector, {
    SelectorOptions,
} from '../ConditionSelector/DefaultConditionSelector'

export interface IRadioSelector {
    title: string
    values: RadioItem[]
    selectedValue: string | undefined
    supportedConditions: SelectorOptions[]
    selectedCondition: SelectorOptions
    onValueSelected: (value: RadioItem) => void
    onConditionChange: (condiiton: SelectorOptions) => void
    onRemove?: () => void
    onReset?: () => void
}

const defaultSelectorOption: SelectorOptions[] = ['is']

export interface RadioItem {
    title: string
    icon?: any
    iconAlt?: any
    value: string
}

export default function RadioSelector({
    title,
    values,
    selectedValue,
    supportedConditions,
    selectedCondition,
    onValueSelected,
    onConditionChange,
    onRemove,
    onReset,
}: IRadioSelector) {
    return (
        <Card className="mt-2 py-4 px-6 min-w-[200px] w-fit rounded-xl">
            <Flex>
                <Flex
                    justifyContent="start"
                    alignItems="baseline"
                    className="gap-2"
                >
                    <Text>{title}</Text>

                    <DefaultConditionSelector
                        supportedConditions={supportedConditions}
                        selectedCondition={selectedCondition}
                        onConditionChange={(i) => onConditionChange(i)}
                    />
                </Flex>
                {onRemove && (
                    <TrashIcon
                        className="hover:cursor-pointer w-4 text-gray-400"
                        onClick={() => onRemove()}
                    />
                )}
            </Flex>

            <Flex flexDirection="col" alignItems="start" className="gap-2 my-4">
                {values &&
                    values.map((i) => (
                        <Radio
                            name={title}
                            key={`${title}-${i.title}`}
                            checked={selectedValue === i.title}
                            onClick={() => onValueSelected(i)}
                        >
                            <Flex>
                                {i.icon && <Icon icon={i.icon} />}
                                {i.iconAlt}

                                <Text>{i.title}</Text>
                            </Flex>
                        </Radio>
                    ))}
            </Flex>

            {onReset && (
                <Button variant="light" onClick={() => onReset()}>
                    Reset
                </Button>
            )}
        </Card>
    )
}
