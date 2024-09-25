import {
    ArrowTopRightOnSquareIcon,
    BanknotesIcon,
    ChevronRightIcon,
    CubeIcon,
    CursorArrowRaysIcon,
    PuzzlePieceIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { Card, Flex, Grid, Icon, Text, Title } from '@tremor/react'
import { useNavigate, useParams } from 'react-router-dom'
import Check from '../../../icons/Check.svg'
import User from '../../../icons/User.svg'
import Dollar from '../../../icons/Dollar.svg'
import Cable from '../../../icons/Cable.svg'
import Cube from '../../../icons/Cube.svg'
import Checkbox from '@cloudscape-design/components/checkbox'
import {
    Box,
    Button,
    Container,
    ExpandableSection,
    Header,
    SpaceBetween,
    KeyValuePairs,
} from '@cloudscape-design/components'
import ProgressBar from '@cloudscape-design/components/progress-bar'
import { link } from 'fs'
import { useEffect, useState } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
interface Props {
    setLoading: Function
    setActiveStepIndex: Function
}

export default function Complete({ setLoading, setActiveStepIndex }: Props) {
    const workspace = useParams<{ ws: string }>().ws
    const navigate = useNavigate()
    const [checked, setChecked] = useState(false)
    const [markdown, setMarkdown] = useState('')

    return (
        <Box margin={{ bottom: 'l' }}>
            <SpaceBetween size="xxl">
                <SpaceBetween size="xs" className="step-1-review">
                    <Header
                        variant="h3"
                        headingTagOverride="h2"
                        actions={
                            <Button
                                className="edit-step-btn"
                                onClick={() => setActiveStepIndex(0)}
                            >
                                Edit
                            </Button>
                        }
                    >
                        Step 1: Importing Metadata
                    </Header>
                    <Container
                        header={
                            <Header variant="h2" headingTagOverride="h3">
                                In progress ...
                            </Header>
                        }
                    >
                        <ProgressBar
                            value={36}
                            additionalInfo="Additional information"
                            description="Progress bar description"
                            label="Progress bar label"
                        />
                    </Container>
                </SpaceBetween>

                <SpaceBetween size="xs" className="step-3-review">
                    <Header
                        variant="h3"
                        headingTagOverride="h2"
                        actions={
                            <Button
                                className="edit-step-btn"
                                onClick={() => setActiveStepIndex(2)}
                            >
                                Edit
                            </Button>
                        }
                    >
                        Step 3: Setting up Integration
                    </Header>
                    <SpaceBetween size="l">
                        <Container
                            header={
                                <Header variant="h2" headingTagOverride="h3">
                                    Network and securitylurem ipsom
                                </Header>
                            }
                        >
                            <KeyValuePairs
                                columns={2}
                                items={[
                                    {
                                        label: 'Virtual Private Cloud (VPC)',
                                        value: 'salam',
                                    },
                                ]}
                            />
                        </Container>

                        <Container
                            header={
                                <Header variant="h2" headingTagOverride="h3">
                                    Maintenance and monitoring
                                </Header>
                            }
                        >
                            <KeyValuePairs
                                columns={2}
                                items={[
                                    {
                                        label: 'Auto minor version upgrades',
                                        value: 'salam',
                                    },
                                ]}
                            />
                        </Container>
                    </SpaceBetween>
                </SpaceBetween>
            </SpaceBetween>
        </Box>
    )
}
