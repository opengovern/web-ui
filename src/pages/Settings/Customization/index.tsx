import { useEffect, useState } from 'react'
import {
    Button,
    Card,
    Divider,
    Flex,
    List,
    ListItem,
    NumberInput,
    Tab,
    TabGroup,
    TabList,
    Text,
    Title,
} from '@tremor/react'
import { useAtom } from 'jotai'
import {
    useMetadataApiV1MetadataCreate,
    useMetadataApiV1MetadataDetail,
} from '../../../api/metadata.gen'
import Spinner from '../../../components/Spinner'
import { getErrorMessage } from '../../../types/apierror'
import { isDemoAtom } from '../../../store'

interface IMetric {
    title: string
    metricId: string
    min: number
    max: number
}

function Metric({ title, metricId, min, max }: IMetric) {
    const [value, setValue] = useState<string>('')
    const [timer, setTimer] = useState<any>()

    const {
        response,
        isLoading,
        isExecuted,
        sendNow: refresh,
    } = useMetadataApiV1MetadataDetail(metricId)

    const {
        isLoading: setIsLoading,
        isExecuted: setIsExecuted,
        error,
        sendNow: sendSet,
    } = useMetadataApiV1MetadataCreate(
        {
            key: metricId,
            value,
        },
        {},
        false
    )

    useEffect(() => {
        if (isExecuted && !isLoading) {
            setValue(response?.value || '')
        }
    }, [isLoading])

    useEffect(() => {
        if (setIsExecuted && !setIsLoading) {
            refresh()
        }
    }, [setIsLoading])

    useEffect(() => {
        try {
            const valueInt = parseInt(value, 10)
            if (valueInt < min || valueInt > max) {
                return
            }
        } catch (e) {
            return
        }

        if (value === '' || value === response?.value) {
            return
        }

        if (timer !== undefined && timer !== null) {
            clearTimeout(timer)
        }

        const t = setTimeout(() => {
            sendSet()
        }, 1000)

        setTimer(t)
    }, [value])

    return (
        <ListItem key={metricId} className="my-1">
            <Flex justifyContent="start" className="truncate space-x-4 ">
                <div className="truncate">
                    <Text className="truncate text-sm">{title}:</Text>
                </div>
            </Flex>

            <NumberInput
                value={value}
                min={min}
                max={max}
                onValueChange={(e) => setValue(String(e))}
                error={error !== undefined}
                errorMessage={getErrorMessage(error)}
                icon={isLoading ? Spinner : undefined}
                disabled={isLoading}
            />
        </ListItem>
    )
}

export default function SettingsCustomization() {
    const [isDemo, setIsDemo] = useAtom(isDemoAtom)
    const [selectedMode, setSelectedMode] = useState(isDemo ? 1 : 0)
    useEffect(() => {
        switch (selectedMode) {
            case 0:
                localStorage.demoMode = 'false'
                setIsDemo(false)
                break
            case 1:
                localStorage.demoMode = 'true'
                setIsDemo(true)
                break
            default:
                localStorage.demoMode = 'false'
                setIsDemo(false)
        }
    }, [selectedMode])

    return (
        <Card key="summary" className="top-6">
            <Title className="font-semibold">Customization</Title>
            <Divider />

            <Title className="font-semibold">
                Jobs interval configurations
            </Title>

            <List className="mt-4">
                <Metric
                    metricId="describe_job_interval"
                    title="Fast Discovery Interval (Hours)"
                    min={8}
                    max={120}
                />
                <Metric
                    metricId="full_discovery_job_interval"
                    title="Full Discovery Interval (Hours)"
                    min={24}
                    max={120}
                />
                <Metric
                    metricId="cost_discovery_job_interval"
                    title="Spend Discovery Interval (Hours)"
                    min={24}
                    max={120}
                />
                <Metric
                    metricId="insight_job_interval"
                    title="Insight Job Interval (Hours)"
                    min={4}
                    max={120}
                />
                <Metric
                    metricId="metrics_job_interval"
                    title="Metrics Job Interval (Hours)"
                    min={4}
                    max={120}
                />
                <Metric
                    metricId="compliance_job_interval"
                    title="Compliance Job Interval (Hours)"
                    min={24}
                    max={120}
                />
            </List>
            <Divider />
            <Title className="font-semibold">Demo Mode</Title>
            <TabGroup
                index={selectedMode}
                onIndexChange={setSelectedMode}
                className="mt-4"
            >
                <TabList className="border border-gray-200" variant="solid">
                    <Tab>App mode</Tab>
                    <Tab>Demo mode</Tab>
                </TabList>
            </TabGroup>
        </Card>
    )
}
