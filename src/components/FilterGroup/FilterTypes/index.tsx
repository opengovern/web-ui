import { StopIcon } from '@heroicons/react/20/solid'
import {
    CheckCircleIcon,
    XCircleIcon,
    CloudIcon,
    CalendarIcon,
} from '@heroicons/react/24/outline'
import {
    CloudConnect,
    Compliance,
    Control,
    Id,
    Lifecycle,
    Resources,
    SeverityIcon,
} from '../../../icons/icons'
import CheckboxSelector, { CheckboxItem } from '../CheckboxSelector'
import RadioSelector, { RadioItem } from '../RadioSelector'
import { DateRange, useUrlDateRangeState } from '../../../utilities/urlstate'
import DateSelector, { renderDateText } from '../DateSelector'

export function ConformanceFilter(
    selectedValues: string,
    onValueSelected: (sv: RadioItem) => void,
    onReset: () => void,
    onConditionChange: (i: any) => void
) {
    const conformanceValues: RadioItem[] = [
        { title: 'All', value: 'all' },
        {
            title: 'Failed',
            iconAlt: <XCircleIcon className="text-rose-500 w-5 mr-1" />,
            value: 'failed',
        },
        {
            title: 'Passed',
            iconAlt: <CheckCircleIcon className="text-emerald-500 w-5 mr-1" />,
            value: 'passed',
        },
    ]

    return {
        title: 'Conformance Status',
        icon: CheckCircleIcon,
        values: [selectedValues],
        isValueChanged: true,
        selector: (
            <RadioSelector
                title="Conformance Status"
                values={conformanceValues}
                selectedValue={selectedValues}
                onValueSelected={onValueSelected}
                supportedConditions={['is']}
                selectedCondition="is"
                onReset={onReset}
                onConditionChange={onConditionChange}
            />
        ),
    }
}

export function ConnectorFilter(
    selectedValues: string,
    isValueChanged: boolean,
    onValueSelected: (sv: RadioItem) => void,
    onRemove: () => void,
    onReset: () => void,
    onConditionChange: (i: any) => void
) {
    const connectorValues: RadioItem[] = [
        { title: 'All', value: 'all' },
        { title: 'AWS', value: 'aws' },
        { title: 'Azure', value: 'azure' },
    ]

    return {
        title: 'Connector',
        icon: CloudConnect,
        values: [selectedValues],
        isValueChanged,
        selector: (
            <RadioSelector
                title="Connector"
                values={connectorValues}
                selectedValue={selectedValues}
                onValueSelected={onValueSelected}
                supportedConditions={['is', 'isNot']}
                selectedCondition="is"
                onRemove={onRemove}
                onReset={onReset}
                onConditionChange={onConditionChange}
            />
        ),
    }
}

export function LifecycleFilter(
    selectedValues: string,
    isValueChanged: boolean,
    onValueSelected: (sv: RadioItem) => void,
    onRemove: () => void,
    onReset: () => void,
    onConditionChange: (i: any) => void
) {
    const lifecycleValues: RadioItem[] = [
        { title: 'All', value: 'all' },
        { title: 'Active', value: 'active' },
        { title: 'Archived', value: 'archived' },
    ]

    return {
        title: 'Lifecycle',
        icon: Lifecycle,
        values: [selectedValues],
        isValueChanged,
        selector: (
            <RadioSelector
                title="Lifecycle"
                values={lifecycleValues}
                selectedValue={selectedValues}
                onValueSelected={onValueSelected}
                supportedConditions={['is']}
                selectedCondition="is"
                onRemove={onRemove}
                onReset={onReset}
                onConditionChange={onConditionChange}
            />
        ),
    }
}

export function SeverityFilter(
    selectedValues: string[],
    isValueChanged: boolean,
    onValueSelected: (sv: CheckboxItem) => void,
    onRemove: () => void,
    onReset: () => void,
    onConditionChange: (i: any) => void
) {
    const severityValues: CheckboxItem[] = [
        {
            title: 'Critical',
            iconAlt: (
                <div
                    className="h-4 w-2 rounded-sm mr-1.5"
                    style={{ backgroundColor: '#6E120B' }}
                />
            ),
            value: 'critical',
        },
        {
            title: 'High',
            iconAlt: (
                <div
                    className="h-4 w-2 rounded-sm mr-1.5"
                    style={{ backgroundColor: '#CA2B1D' }}
                />
            ),
            value: 'high',
        },
        {
            title: 'Medium',
            iconAlt: (
                <div
                    className="h-4 w-2 rounded-sm mr-1.5"
                    style={{ backgroundColor: '#EE9235' }}
                />
            ),
            value: 'medium',
        },
        {
            title: 'Low',
            iconAlt: (
                <div
                    className="h-4 w-2 rounded-sm mr-1.5"
                    style={{ backgroundColor: '#F4C744' }}
                />
            ),
            value: 'low',
        },
        {
            title: 'None',
            iconAlt: (
                <div
                    className="h-4 w-2 rounded-sm mr-1.5"
                    style={{ backgroundColor: '#9BA2AE' }}
                />
            ),
            value: 'none',
        },
    ]

    return {
        title: 'Severity',
        icon: SeverityIcon,
        values: selectedValues,
        isValueChanged,
        selector: (
            <CheckboxSelector
                title="Severity"
                values={severityValues}
                selectedValues={selectedValues}
                onValueSelected={onValueSelected}
                supportedConditions={['is', 'isNot']}
                selectedCondition="is"
                onRemove={onRemove}
                onReset={onReset}
                onConditionChange={onConditionChange}
            />
        ),
    }
}

export function CloudAccountFilter(
    values: CheckboxItem[],
    selectedValues: string[],
    isValueChanged: boolean,
    onValueSelected: (sv: CheckboxItem) => void,
    onRemove: () => void,
    onReset: () => void,
    onConditionChange: (i: any) => void,
    onSearch: (i: any) => void
) {
    return {
        title: 'Cloud Account',
        icon: CloudIcon,
        values: selectedValues,
        isValueChanged,
        selector: (
            <CheckboxSelector
                title="Cloud Account"
                values={values}
                selectedValues={selectedValues}
                onValueSelected={onValueSelected}
                supportedConditions={['is', 'isNot']}
                selectedCondition="is"
                onRemove={onRemove}
                onReset={onReset}
                onConditionChange={onConditionChange}
                onSearch={onSearch}
            />
        ),
    }
}

export function DateFilter(
    value: DateRange,
    onValueSelected: (sv: DateRange) => void,
    onConditionChange: (i: any) => void
) {
    const { value: activeTimeRange, setValue: setActiveTimeRange } =
        useUrlDateRangeState(value)

    return {
        title: 'Date',
        icon: CalendarIcon,
        values: [renderDateText(activeTimeRange.start, activeTimeRange.end)],
        isValueChanged: true,
        selector: (
            <DateSelector
                title="Date"
                defaultDate={value}
                supportedConditions={['isBetween', 'isRelative']}
                selectedCondition="isBetween"
                onValueChanged={onValueSelected}
                onConditionChange={onConditionChange}
            />
        ),
    }
}
