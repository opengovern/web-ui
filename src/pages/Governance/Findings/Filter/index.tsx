import { Button, Card, Col, Flex, Grid, Icon, Text } from '@tremor/react'
import { Popover, Transition } from '@headlessui/react'
import {
    CalendarIcon,
    CheckCircleIcon,
    ChevronDownIcon,
    CloudIcon,
    PlusIcon,
    TrashIcon,
} from '@heroicons/react/24/outline'
import { Fragment, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { useParams } from 'react-router-dom'
import Provider from './Provider'
import {
    GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus,
    SourceType,
    TypesFindingSeverity,
} from '../../../../api/api'
import ConformanceStatus from './ConformanceStatus'
import { useComplianceApiV1FindingsFiltersCreate } from '../../../../api/compliance.gen'
import Others from './Others'
import FindingLifecycle from './FindingLifecycle'
import { compareArrays } from '../../../../components/Layout/Header/Filter'
import ConditionDropdown from '../../../../components/ConditionDropdown'

import {
    CloudConnect,
    Compliance,
    Control,
    Id,
    Lifecycle,
    Resources,
    SeverityIcon,
} from '../../../../icons/icons'
import Severity from './Severity'
import Datepicker, { IDate } from './Datepicker'
import {
    DateRange,
    defaultEventTime,
    defaultFindingsTime,
    useURLParam,
    useUrlDateRangeState,
} from '../../../../utilities/urlstate'
import { renderDateText } from '../../../../components/Layout/Header/DatePicker'
import LimitHealthy from './LimitHealthy'

interface IFilters {
    onApply: (obj: {
        connector: SourceType
        conformanceStatus:
            | GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus[]
            | undefined
        severity: TypesFindingSeverity[] | undefined
        connectionID: string[] | undefined
        controlID: string[] | undefined
        benchmarkID: string[] | undefined
        resourceTypeID: string[] | undefined
        lifecycle: boolean[] | undefined
        activeTimeRange: DateRange | undefined
        eventTimeRange: DateRange | undefined
    }) => void
    type: 'findings' | 'resources' | 'controls' | 'accounts' | 'events'
}

export default function Filter({ onApply, type }: IFilters) {
    const { ws } = useParams()
    const defConnector = SourceType.Nil
    const [connector, setConnector] = useState<SourceType>(defConnector)

    const defConformanceStatus = [
        GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus.ConformanceStatusFailed,
        GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus.ConformanceStatusPassed,
    ]
    const [conformanceStatus, setConformanceStatus] = useState<
        | GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus[]
        | undefined
    >([
        GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus.ConformanceStatusFailed,
    ])

    const defLifecycle = [true, false]
    const [lifecycle, setLifecycle] = useState<boolean[]>(defLifecycle)

    const defSeverity = [
        TypesFindingSeverity.FindingSeverityCritical,
        TypesFindingSeverity.FindingSeverityHigh,
        TypesFindingSeverity.FindingSeverityMedium,
        TypesFindingSeverity.FindingSeverityLow,
        TypesFindingSeverity.FindingSeverityNone,
    ]
    const [severity, setSeverity] = useState<
        TypesFindingSeverity[] | undefined
    >(defSeverity)
    const [severityCon, setSeverityCon] = useState('is')

    const [connectionID, setConnectionID] = useState<string[] | undefined>([])
    const [connectionCon, setConnectionCon] = useState('is')
    const [controlID, setControlID] = useState<string[] | undefined>([])
    const [controlCon, setControlCon] = useState('is')
    const [benchmarkID, setBenchmarkID] = useState<string[] | undefined>([])
    const [benchmarkCon, setBenchmarkCon] = useState('is')
    const [resourceTypeID, setResourceTypeID] = useState<string[] | undefined>(
        []
    )
    const [resourceCon, setResourceCon] = useState('is')
    const [dateCon, setDateCon] = useState('isBetween')
    const [eventDateCon, setEventDateCon] = useState('isBetween')
     const today = new Date()
     const lastWeek = new Date(
         today.getFullYear(),
         today.getMonth(),
         today.getDate() - 7
     )
    const [ activeTimeRange, setActiveTimeRange ] =useState({
        start: dayjs(lastWeek),
        end: dayjs(today)
    })
      
    // const { value: eventTimeRange, setValue: setEventTimeRange } =
    //     useUrlDateRangeState(
    //         defaultEventTime(ws || ''),
    //         'eventStartDate',
    //         'eventEndDate'
    //     )
    const [selectedFilters, setSelectedFilters] = useState<string[]>([
        'conformance_status',
        'provider',
        'lifecycle',
        'severity',
        'limit_healthy',
        'connection',
        'control',
        'benchmark',
        'resource',
        'date',
        'eventDate',
    ])

    useEffect(() => {
        // @ts-ignore
        onApply({
            connector,
            conformanceStatus,
            severity,
            connectionID,
            controlID,
            benchmarkID,
            resourceTypeID,
            lifecycle,
            activeTimeRange: selectedFilters.includes('date')
                ? activeTimeRange
                : undefined,
            // eventTimeRange: selectedFilters.includes('eventDate')
            //     ? eventTimeRange
            //     : undefined,
        })
    }, [
        connector,
        conformanceStatus,
        severity,
        connectionID,
        controlID,
        benchmarkID,
        resourceTypeID,
        lifecycle,
        activeTimeRange,
        // eventTimeRange,
    ])

    const { response: filters } = useComplianceApiV1FindingsFiltersCreate({})

    const filterOptions = [
        {
            id: 'conformance_status',
            name: 'Conformance Status',
            icon: CheckCircleIcon,
            component: (
                <ConformanceStatus
                    value={conformanceStatus}
                    defaultValue={defConformanceStatus}
                    onChange={(c) => setConformanceStatus(c)}
                />
            ),
            conditions: ['is'],
            setCondition: (c: string) => console.log(c),
            value: conformanceStatus,
            defaultValue: defConformanceStatus,
            onDelete: undefined,
            types: ['findings', 'resources', 'events'],
        },

        // {
        //     id: 'provider',
        //     name: 'Connector',
        //     icon: CloudConnect,
        //     component: (
        //         <Provider
        //             value={connector}
        //             defaultValue={defConnector}
        //             onChange={(p) => setConnector(p)}
        //         />
        //     ),
        //     conditions: ['is'],
        //     setCondition: (c: string) => undefined,
        //     value: [connector],
        //     defaultValue: [defConnector],
        //     onDelete: () => setConnector(defConnector),
        //     types: ['findings', 'resources', 'events', 'controls', 'accounts'],
        // },
        // {
        //     id: 'lifecycle',
        //     name: 'Lifecycle',
        //     icon: Lifecycle,
        //     component: (
        //         <FindingLifecycle
        //             value={lifecycle}
        //             defaultValue={defLifecycle}
        //             onChange={(l) => setLifecycle(l)}
        //         />
        //     ),
        //     conditions: ['is'],
        //     setCondition: (c: string) => console.log(c),
        //     value: lifecycle,
        //     defaultValue: defLifecycle,
        //     onDelete: () => setLifecycle(defLifecycle),
        //     types: ['findings', 'resources', 'events'],
        // },
        {
            id: 'severity',
            name: 'Severity',
            icon: SeverityIcon,
            component: (
                <Severity
                    value={severity}
                    defaultValue={defSeverity}
                    condition={severityCon}
                    onChange={(s) => setSeverity(s)}
                />
            ),
            conditions: ['is', 'isNot'],
            setCondition: (c: string) => setSeverityCon(c),
            value: severity,
            defaultValue: defSeverity,
            onDelete: () => setSeverity(defSeverity),
            types: ['findings', 'resources', 'events'],
        },
        {
            id: 'limit_healthy',
            name: 'Limit Healthy',
            icon: CheckCircleIcon,
            component: (
                <LimitHealthy
                    value={undefined}
                    defaultValue={undefined}
                    onChange={(c) => {}}
                />
            ),
            conditions: ['is'],
            setCondition: (c: string) => console.log(c),
            value: conformanceStatus,
            defaultValue: defConformanceStatus,
            onDelete: undefined,
            types: ['findings', 'resources', 'events'],
        },
        {
            id: 'connection',
            name: 'Cloud Account',
            icon: Id,
            component: (
                <Others
                    value={connectionID}
                    defaultValue={[]}
                    data={filters}
                    condition={connectionCon}
                    type="connectionID"
                    onChange={(o) => setConnectionID(o)}
                    name={'Integration'}
                />
            ),
            conditions: ['is', 'isNot'],
            setCondition: (c: string) => setConnectionCon(c),
            value: connectionID,
            defaultValue: [],
            onDelete: () => setConnectionID([]),
            data: filters?.connectionID,
            types: ['findings', 'resources', 'events', 'controls', 'accounts'],
        },
        {
            id: 'control',
            name: 'Control',
            icon: Control,
            component: (
                <Others
                    value={controlID}
                    defaultValue={[]}
                    data={filters}
                    condition={controlCon}
                    type="controlID"
                    name={'Control'}
                    onChange={(o) => setControlID(o)}
                />
            ),
            conditions: ['is', 'isNot'],
            setCondition: (c: string) => setControlCon(c),
            value: controlID,
            defaultValue: [],
            onDelete: () => setControlID([]),
            data: filters?.controlID,
            types: ['findings', 'resources', 'events'],
        },
        {
            id: 'benchmark',
            name: 'Benchmark',
            icon: Compliance,
            component: (
                <Others
                    value={benchmarkID}
                    defaultValue={[]}
                    data={filters}
                    condition={benchmarkCon}
                    type="benchmarkID"
                    onChange={(o) => setBenchmarkID(o)}
                    name={'Frameworks'}
                />
            ),
            conditions: ['is'],
            setCondition: (c: string) => setBenchmarkCon(c),
            value: benchmarkID,
            defaultValue: [],
            onDelete: () => setBenchmarkID([]),
            data: filters?.benchmarkID,
            types: ['findings', 'resources', 'events', 'controls', 'accounts'],
        },
        {
            id: 'resource',
            name: 'Resource Type',
            icon: Resources,
            component: (
                <Others
                    value={resourceTypeID}
                    defaultValue={[]}
                    data={filters}
                    condition={resourceCon}
                    type="resourceTypeID"
                    onChange={(o) => setResourceTypeID(o)}
                    name={'Resource Type'}
                />
            ),
            conditions: ['is', 'isNot'],
            setCondition: (c: string) => setResourceCon(c),
            value: resourceTypeID,
            defaultValue: [],
            onDelete: () => setResourceTypeID([]),
            data: filters?.resourceTypeID,
            types: ['findings', 'resources', 'events'],
        },
        {
            id: 'date',
            name: type === 'events' ? 'Audit Period' : 'Last Updated',
            icon: CalendarIcon,
            component: (
                <Datepicker
                    condition={dateCon}
                    activeTimeRange={activeTimeRange}
                    setActiveTimeRange={(v) => setActiveTimeRange(v)}
                    name={type === 'events' ? 'Audit Period' : 'Last Updated'}
                />
            ),
            conditions: ['isBetween', 'isRelative'],
            setCondition: (c: string) => setDateCon(c),
            value: activeTimeRange,
            defaultValue: { start: dayjs.utc(), end: dayjs.utc() },
            onDelete: () =>
                setActiveTimeRange({ start: dayjs.utc(), end: dayjs.utc() }),
            types: ['findings', 'events'],
        },
        // {
        //     id: 'eventDate',
        //     name: 'Last Event',
        //     icon: CalendarIcon,
        //     component: (
        //         <Datepicker
        //             condition={eventDateCon}
        //             activeTimeRange={eventTimeRange}
        //             setActiveTimeRange={(v) => setEventTimeRange(v)}
        //         />
        //     ),
        //     conditions: ['isBetween', 'isRelative'],
        //     setCondition: (c: string) => setEventDateCon(c),
        //     value: eventTimeRange,
        //     defaultValue: { start: dayjs.utc(), end: dayjs.utc() },
        //     onDelete: () =>
        //         setEventTimeRange({ start: dayjs.utc(), end: dayjs.utc() }),
        //     types: ['findings'],
        // },
    ]

    const renderFilters = selectedFilters.map((sf) => {
        const f = filterOptions.find((o) => o.id === sf)
        return (
            f?.types.includes(type) && (
                <>
                    {f.id == 'date' ? (
                        <>
                            <Col numColSpan={4}>{f.component}</Col>
                        </>
                    ) : (
                        <>
                            <Col numColSpan={2}>{f.component}</Col>
                        </>
                    )}
                </>
            )
        )
    })

    return (
        <Grid numItems={10}  className="mt-4 gap-2  z-10">
            {renderFilters}
        </Grid>
    )
}
