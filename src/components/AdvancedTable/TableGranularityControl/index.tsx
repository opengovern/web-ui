import { Select, SelectItem, Switch, Text } from '@tremor/react'
import { Dispatch, SetStateAction } from 'react'
import { capitalizeFirstLetter } from '../../../utilities/labelMaker'

interface IProps {
    granularityEnabled: boolean
    setGranularityEnabled: (v: boolean) => void
    selectedGranularity: 'daily' | 'monthly'
    onGranularityChange: Dispatch<SetStateAction<'monthly' | 'daily'>>
}

export default function TableGranularityControl({
    granularityEnabled,
    setGranularityEnabled,
    selectedGranularity,
    onGranularityChange,
}: IProps) {
    return (
        <>
            <Switch
                id="switch"
                name="switch"
                checked={granularityEnabled}
                onChange={(v) => {
                    setGranularityEnabled(v)
                }}
            />
            <label htmlFor="switch" className="text-sm">
                Show Granular Spend{' '}
            </label>
            <Select
                enableClear={false}
                disabled={!granularityEnabled}
                value={selectedGranularity}
                placeholder={
                    granularityEnabled
                        ? capitalizeFirstLetter(selectedGranularity)
                        : ''
                }
                onValueChange={(v) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    onGranularityChange(v)
                }}
                className="w-10"
            >
                <SelectItem value="daily">
                    <Text>Daily</Text>
                </SelectItem>
                <SelectItem value="monthly">
                    <Text>Monthly</Text>
                </SelectItem>
            </Select>
        </>
    )
}
