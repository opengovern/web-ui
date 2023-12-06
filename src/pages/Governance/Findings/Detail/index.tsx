import { Divider, List, ListItem, Text, Title } from '@tremor/react'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiFinding } from '../../../../api/api'
import { dateTimeDisplay } from '../../../../utilities/dateDisplay'
import DrawerPanel from '../../../../components/DrawerPanel'

interface IFindingDetail {
    finding: GithubComKaytuIoKaytuEnginePkgComplianceApiFinding | undefined
    open: boolean
    onClose: () => void
}

export default function FindingDetail({
    finding,
    open,
    onClose,
}: IFindingDetail) {
    return (
        <DrawerPanel open={open} onClose={onClose} title="Reason">
            <Title>Summary</Title>
            <List>
                <ListItem className="py-6 flex items-start">
                    <Text>Severity</Text>
                    <Text className="text-gray-800 w-3/5 whitespace-pre-wrap text-end">
                        {finding?.severity}
                    </Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>State</Text>
                    <Text className="text-gray-800 w-3/5 whitespace-pre-wrap text-end">
                        {finding?.stateActive ? 'Active' : 'Not active'}
                    </Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Policy name</Text>
                    <Text className="text-gray-800 w-3/5 whitespace-pre-wrap text-end">
                        {finding?.controlTitle}
                    </Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Reason</Text>
                    <Text className="text-gray-800 w-3/5 whitespace-pre-wrap text-end">
                        {finding?.reason}
                    </Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Last checked</Text>
                    <Text className="text-gray-800 w-3/5 whitespace-pre-wrap text-end">
                        {dateTimeDisplay(finding?.evaluatedAt)}
                    </Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Resource name</Text>
                    <Text className="text-gray-800 w-3/5 whitespace-pre-wrap text-end">
                        {finding?.resourceName}
                    </Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Resource type</Text>
                    <Text className="text-gray-800 w-3/5 whitespace-pre-wrap text-end">
                        {finding?.resourceType}
                    </Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Root benchmark</Text>
                    <Text className="text-gray-800 w-3/5 whitespace-pre-wrap text-end">
                        {finding?.parentBenchmarks
                            ? finding?.parentBenchmarks[0]
                            : ''}
                    </Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Account name</Text>
                    <Text className="text-gray-800 w-3/5 whitespace-pre-wrap text-end">
                        {finding?.providerConnectionName}
                    </Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Account ID</Text>
                    <Text className="text-gray-800 w-3/5 whitespace-pre-wrap text-end">
                        {finding?.providerConnectionID}
                    </Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Resource ID</Text>
                    <Text className="text-gray-800 w-3/5 whitespace-pre-wrap text-end">
                        {finding?.resourceID}
                    </Text>
                </ListItem>
            </List>
            <Divider />
            <Title>Policy details</Title>
            <List>
                <ListItem className="py-6 flex items-start">
                    <Text>Policy title</Text>
                    <Text className="text-gray-800 w-3/5 whitespace-pre-wrap text-end">
                        {finding?.controlTitle}
                    </Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Policy name</Text>
                    <Text className="text-gray-800 w-3/5 whitespace-pre-wrap text-end">
                        {finding?.controlID}
                    </Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Benchmark name</Text>
                    <Text className="text-gray-800 w-3/5 whitespace-pre-wrap text-end">
                        {finding?.parentBenchmarks
                            ? finding?.parentBenchmarks[
                                  // eslint-disable-next-line no-unsafe-optional-chaining
                                  finding?.parentBenchmarks.length - 1
                              ]
                            : ''}
                    </Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Benchmark title</Text>
                    <Text className="text-gray-800 w-3/5 whitespace-pre-wrap text-end">
                        {finding?.parentBenchmarkNames
                            ? finding?.parentBenchmarkNames[
                                  // eslint-disable-next-line no-unsafe-optional-chaining
                                  finding?.parentBenchmarkNames.length - 1
                              ]
                            : ''}
                    </Text>
                </ListItem>
            </List>
            <Divider />
            <Title>Hierarchy</Title>
            <List>
                {finding?.parentBenchmarks?.map((h, i) => (
                    <ListItem className="py-6 flex items-start">
                        <Text>{`Level ${i}`}</Text>
                        <Text className="text-kaytu-800 w-3/5 whitespace-pre-wrap text-end">
                            {h}
                        </Text>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <Title>Job details</Title>
            <List>
                <ListItem className="py-6 flex items-start">
                    <Text>Finding ID</Text>
                    <Text className="text-gray-800 w-3/5 whitespace-pre-wrap text-end">
                        {finding?.resourceID}
                    </Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Cloud account ID</Text>
                    <Text className="text-gray-800 w-3/5 whitespace-pre-wrap text-end">
                        {finding?.providerConnectionID}
                    </Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Connection ID</Text>
                    <Text className="text-gray-800 w-3/5 whitespace-pre-wrap text-end">
                        {finding?.connectionID}
                    </Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Compliance job ID</Text>
                    <Text className="text-gray-800 w-3/5 whitespace-pre-wrap text-end">
                        {finding?.complianceJobID}
                    </Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Resource type namespace</Text>
                    <Text className="text-gray-800 w-3/5 whitespace-pre-wrap text-end">
                        {finding?.resourceTypeName}
                    </Text>
                </ListItem>
            </List>
        </DrawerPanel>
    )
}
