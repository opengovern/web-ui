import { Button, Divider, Flex, Select, SelectItem, Text } from '@tremor/react'
import { useState } from 'react'
import {
    useComplianceApiV1BenchmarksControlsDetail,
    useComplianceApiV1BenchmarksSummaryList,
} from '../../../../../api/compliance.gen'
import { benchmarkList } from '../../../../Governance/Compliance'
import Spinner from '../../../../../components/Spinner'
import {
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkControlSummary,
    GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary,
} from '../../../../../api/api'

interface IStep {
    onNext: (event: string, benchmark: string, control: string) => void
    onBack: () => void
}

export default function StepOne({ onNext, onBack }: IStep) {
    const [event, setEvent] = useState('')
    const setEventValue = (s: string) => {
        if (s !== 'compliance') {
            return
        }
        setEvent(s)
    }
    const [benchmarkID, setBenchmarkID] = useState('')
    const [controlID, setControlID] = useState('')

    const { response: benchmarks, isLoading: benchmarkIsLoading } =
        useComplianceApiV1BenchmarksSummaryList()

    const { response: controls, isLoading: controlIsLoading } =
        useComplianceApiV1BenchmarksControlsDetail(benchmarkID)

    const allControls = (
        b: GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkControlSummary
    ) => {
        const benchmarkControls = b.control || []
        const childrenControls =
            b?.children?.flatMap((bc) => allControls(bc)) || []

        const resp: GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary[] =
            [...benchmarkControls, ...childrenControls]
        return resp
    }

    const renderBenchmarkOption = () => {
        switch (event) {
            case 'compliance':
                return benchmarkIsLoading ? (
                    <>
                        <Divider />
                        <Spinner />
                    </>
                ) : (
                    <>
                        <Divider />
                        <Text className="mb-6">
                            Choose your benchmark and press next
                        </Text>
                        <Flex flexDirection="row" justifyContent="between">
                            <Text className="text-gray-800">Benchmark</Text>
                            <div className="w-2/3">
                                <Select
                                    enableClear={false}
                                    value={benchmarkID}
                                    onValueChange={setBenchmarkID}
                                >
                                    {benchmarkList(
                                        benchmarks?.benchmarkSummary
                                    ).connected.map((b) => (
                                        <SelectItem key={b.id} value={b.id}>
                                            <Text>{b.title}</Text>
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                        </Flex>
                    </>
                )
            default:
                return <div />
        }
    }

    const renderControlOption = () => {
        switch (controlID) {
            case '':
                return <div />

            default:
                return controlIsLoading ? (
                    <>
                        <Divider />
                        <Spinner />
                    </>
                ) : (
                    <>
                        <Divider />
                        <Text className="mb-6">
                            Choose your control (optional)
                        </Text>
                        <Flex flexDirection="row" justifyContent="between">
                            <Text className="text-gray-800">Control</Text>
                            <div className="w-2/3">
                                <Select
                                    enableClear={false}
                                    value={controlID}
                                    onValueChange={setControlID}
                                >
                                    {allControls(controls || {}).map((c) => (
                                        <SelectItem
                                            key={c.control?.id || ''}
                                            value={c.control?.id || ''}
                                        >
                                            <Text>{c.control?.title}</Text>
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                        </Flex>
                    </>
                )
        }
    }

    return (
        <Flex flexDirection="col" style={{ height: 'calc(100% - 60px)' }}>
            <Flex flexDirection="col" alignItems="start">
                <Flex justifyContent="start" className="gap-1 mb-6">
                    <Text>1/4.</Text>
                    <Text className="text-gray-800 font-semibold">Trigger</Text>
                </Flex>
                <Flex
                    flexDirection="row"
                    className="w-full"
                    justifyContent="between"
                >
                    <Text className="text-gray-800">Event on</Text>
                    <div className="w-2/3">
                        <Select
                            enableClear={false}
                            value={event}
                            onValueChange={setEventValue}
                        >
                            <SelectItem value="compliance">
                                <Text>Compliance evaluation</Text>
                            </SelectItem>
                            <SelectItem value="spend">
                                <Flex className="relative w-full">
                                    <div className="absolute w-full h-full top-0 left-0 z-10" />
                                    <Flex
                                        justifyContent="start"
                                        className="gap-1"
                                    >
                                        <Text>Spend</Text>
                                        <Text color="blue">Coming soon</Text>
                                    </Flex>
                                </Flex>
                            </SelectItem>
                            <SelectItem value="insight">
                                <Flex className="relative">
                                    <div className="absolute w-full h-full top-0 left-0 z-10" />
                                    <Flex
                                        justifyContent="start"
                                        className="gap-1"
                                    >
                                        <Text>Insight evaluation</Text>
                                        <Text color="blue">Coming soon</Text>
                                    </Flex>
                                </Flex>
                            </SelectItem>
                            <SelectItem value="discovery">
                                <Flex className="relative">
                                    <div className="absolute w-full h-full top-0 left-0 z-10" />
                                    <Flex
                                        justifyContent="start"
                                        className="gap-1"
                                    >
                                        <Text>Discovery</Text>
                                        <Text color="blue">Coming soon</Text>
                                    </Flex>
                                </Flex>
                            </SelectItem>
                            <SelectItem value="asset">
                                <Flex className="relative">
                                    <div className="absolute w-full h-full top-0 left-0 z-10" />
                                    <Flex
                                        justifyContent="start"
                                        className="gap-1"
                                    >
                                        <Text>Asset analytics</Text>
                                        <Text color="blue">Coming soon</Text>
                                    </Flex>
                                </Flex>
                            </SelectItem>
                        </Select>
                    </div>
                </Flex>
                {event.length > 0 && renderBenchmarkOption()}
                {renderControlOption()}
            </Flex>
            <Flex justifyContent="end" className="gap-4">
                <Button variant="secondary" onClick={onBack}>
                    Close
                </Button>
                <Button
                    disabled={event.length < 1 || benchmarkID.length < 1}
                    onClick={() => onNext(event, benchmarkID, controlID)}
                >
                    Next
                </Button>
            </Flex>
        </Flex>
    )
}
