import { TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Checkbox } from 'pretty-checkbox-react'
import { Button, Card, Flex, Icon, Text, TextInput } from '@tremor/react'
import DefaultConditionSelector, {
    SelectorOptions,
} from '../ConditionSelector/DefaultConditionSelector'

export interface ICheckboxSelector {
    title: string
    checkboxItems: CheckboxItem[]
    selectedValues: string[] | undefined
    onItemSelected: (item: CheckboxItem) => void
    supportedConditions: SelectorOptions[]
    selectedCondition: SelectorOptions
    onConditionChange: (condition: SelectorOptions) => void
    onRemove?: () => void
    onReset?: () => void
    onSearch?: (value: string) => void
}

export interface CheckboxItem {
    title: string
    icon?: any
    iconAlt?: any
    value: string
}

export default function CheckboxSelector({
    title,
    checkboxItems,
    selectedValues,
    supportedConditions,
    selectedCondition,
    onItemSelected,
    onConditionChange,
    onRemove,
    onReset,
    onSearch,
}: ICheckboxSelector) {
    return (
        <Card className="mt-2 py-4 px-6 min-w-[240px] rounded-xl">
            <Flex>
                <Flex
                    justifyContent="start"
                    alignItems="baseline"
                    className="gap-2"
                >
                    <Text>{title}</Text>
                    {/* TODO */}
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
            {onSearch && (
                <TextInput
                    icon={MagnifyingGlassIcon}
                    placeholder="Search..."
                    onChange={(i) => onSearch(i.target.value)}
                    className="my-4 -mx-0.5"
                />
            )}

            <Flex
                flexDirection="col"
                alignItems="start"
                className="gap-2 pr-6 my-4 max-h-[180px] overflow-auto"
            >
                {checkboxItems.map((i) => (
                    <Checkbox
                        name={title}
                        key={`${title}-${i.value}`}
                        checked={selectedValues?.includes(i.value)}
                        onClick={() => onItemSelected(i)}
                    >
                        <Flex className="w-fit">
                            {i.icon && <Icon icon={i.icon} />}
                            {i.iconAlt}
                            <Text className="whitespace-nowrap">{i.title}</Text>
                        </Flex>
                    </Checkbox>
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
