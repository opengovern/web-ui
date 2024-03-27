import {
    CheckCircleIcon,
    XCircleIcon,
    CloudIcon,
    CalendarIcon,
} from '@heroicons/react/24/outline'
import { CloudConnect, Lifecycle, SeverityIcon } from '../../../icons/icons'
import CheckboxSelector, { CheckboxItem } from '../CheckboxSelector'
import RadioSelector, { RadioItem } from '../RadioSelector'
import { DateRange } from '../../../utilities/urlstate'
import DateSelector, { renderDateText } from '../DateSelector'
import { DateSelectorOptions } from '../ConditionSelector/DateConditionSelector'

export function ConformanceFilter(
    selectedValue: string,
    onValueSelected: (sv: string) => void,
    onReset: () => void
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
        values: [selectedValue],
        isValueChanged: true,
        selector: (
            <RadioSelector
                title="Conformance Status"
                radioItems={conformanceValues}
                selectedValue={selectedValue}
                onItemSelected={(t) => onValueSelected(t.value)}
                supportedConditions={['is']}
                selectedCondition="is"
                onReset={onReset}
                onConditionChange={() => ''}
            />
        ),
    }
}

export function ConnectorFilter(
    selectedValue: string,
    isValueChanged: boolean,
    onValueSelected: (sv: string) => void,
    onRemove: () => void,
    onReset: () => void
) {
    const connectorValues: RadioItem[] = [
        { title: 'All', value: '' },
        { title: 'AWS', value: 'AWS' },
        { title: 'Azure', value: 'Azure' },
    ]

    return {
        title: 'Connector',
        icon: CloudConnect,
        values: [selectedValue],
        isValueChanged,
        selector: (
            <RadioSelector
                title="Connector"
                radioItems={connectorValues}
                selectedValue={selectedValue}
                onItemSelected={(t) => onValueSelected(t.value)}
                supportedConditions={['is']}
                selectedCondition="is"
                onRemove={onRemove}
                onReset={onReset}
                onConditionChange={() => ''}
            />
        ),
    }
}

export function LifecycleFilter(
    selectedValue: string,
    isValueChanged: boolean,
    onValueSelected: (sv: string) => void,
    onRemove: () => void,
    onReset: () => void
) {
    const lifecycleValues: RadioItem[] = [
        { title: 'All', value: 'all' },
        { title: 'Active', value: 'active' },
        { title: 'Archived', value: 'archived' },
    ]

    return {
        title: 'Lifecycle',
        icon: Lifecycle,
        values: [selectedValue],
        isValueChanged,
        selector: (
            <RadioSelector
                title="Lifecycle"
                radioItems={lifecycleValues}
                selectedValue={selectedValue}
                onItemSelected={(t) => onValueSelected(t.value)}
                supportedConditions={['is']}
                selectedCondition="is"
                onRemove={onRemove}
                onReset={onReset}
                onConditionChange={() => ''}
            />
        ),
    }
}

export function SeverityFilter(
    selectedValues: string[],
    isValueChanged: boolean,
    onValueSelected: (sv: string) => void,
    onRemove: () => void,
    onReset: () => void
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
                checkboxItems={severityValues}
                selectedValues={selectedValues}
                onItemSelected={(t) => onValueSelected(t.value)}
                supportedConditions={['is']}
                selectedCondition="is"
                onRemove={onRemove}
                onReset={onReset}
                onConditionChange={() => ''}
            />
        ),
    }
}

export function CloudAccountFilter(
    items: CheckboxItem[],
    onValueSelected: (sv: string) => void,
    selectedValues: string[],
    isValueChanged: boolean,
    onRemove: () => void,
    onReset: () => void,
    onSearch: (i: string) => void
) {
    return {
        title: 'Cloud Account',
        icon: CloudIcon,
        values: items
            .filter((item) => selectedValues.includes(item.value))
            .map((item) => item.title),
        isValueChanged,
        selector: (
            <CheckboxSelector
                title="Cloud Account"
                checkboxItems={items}
                selectedValues={selectedValues}
                onItemSelected={(t) => onValueSelected(t.value)}
                supportedConditions={['is']}
                selectedCondition="is"
                onRemove={onRemove}
                onReset={onReset}
                onConditionChange={() => ''}
                onSearch={onSearch}
            />
        ),
    }
}

export function DateFilter(
    value: DateRange,
    onValueChange: (i: DateRange) => void,
    selectedCondition: DateSelectorOptions,
    onConditionChange: (i: DateSelectorOptions) => void
) {
    return {
        title: 'Date',
        icon: CalendarIcon,
        values: [renderDateText(value.start, value.end)],
        isValueChanged: true,
        selector: (
            <DateSelector
                title="Date"
                value={value}
                supportedConditions={['isBetween', 'isRelative']}
                selectedCondition={selectedCondition}
                onValueChanged={onValueChange}
                onConditionChange={onConditionChange}
            />
        ),
    }
}
