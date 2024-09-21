import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    Button,
    Card,
    Flex,
    Icon,
    Select,
    SelectItem,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    Text,
    TextInput,
} from '@tremor/react'
import {
    ChevronDoubleLeftIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    CommandLineIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    PlayCircleIcon,
} from '@heroicons/react/24/outline'
import { Fragment, useEffect, useMemo, useState } from 'react' // eslint-disable-next-line import/no-extraneous-dependencies
import { highlight, languages } from 'prismjs' // eslint-disable-next-line import/no-extraneous-dependencies
import 'prismjs/components/prism-sql' // eslint-disable-next-line import/no-extraneous-dependencies
import 'prismjs/themes/prism.css'
import Editor from 'react-simple-code-editor'
import { RowClickedEvent, ValueFormatterParams } from 'ag-grid-community'
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/solid'
import { Transition } from '@headlessui/react'
import { useAtom, useAtomValue } from 'jotai'
import {
    useInventoryApiV1QueryList,
    useInventoryApiV1QueryRunCreate,
    useInventoryApiV2AnalyticsCategoriesList,
} from '../../api/inventory.gen'
import Spinner from '../../components/Spinner'
import { getErrorMessage } from '../../types/apierror'
import DrawerPanel from '../../components/DrawerPanel'
import { RenderObject } from '../../components/RenderObject'
import Table, { IColumn } from '../../components/Table'
import {
    GithubComKaytuIoKaytuEnginePkgInventoryApiRunQueryResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiSmartQueryItem,
} from '../../api/api'
import { isDemoAtom, queryAtom, runQueryAtom } from '../../store'
import { snakeCaseToLabel } from '../../utilities/labelMaker'
import { numberDisplay } from '../../utilities/numericDisplay'
import TopHeader from '../../components/Layout/Header'
import AllQueries from './All Query'
import Query from './Query'
import { useParams, useSearchParams } from 'react-router-dom'
import { useURLParam } from '../../utilities/urlstate'
import { URLSearchParams } from 'url'


export default function Search() {
    const [tab,setTab] = useState<number>(0);
    // find query params for tabs
    const [searchParams, setSearchParams] = useSearchParams()
    useEffect(() => {
       const tab_id = searchParams.get('tab_id')
        switch (tab_id) {
            case '1':
                setTab(1)
                break
            default:
                setTab(0)
                break
        }
    }, [searchParams])

    return (
        <>
            <TopHeader />
            <TabGroup
                index={tab}
                onIndexChange={(index) => {
                    setTab(index)
                }}
            >
                <TabList>
                    <Tab
                        value={0}
                        onClick={() => {
                            setTab(0)
                        }}
                    >
                        All Queries
                    </Tab>
                    <Tab
                        value={1}
                        onClick={() => {
                            setTab(1)
                        }}
                    >
                        Queries
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        {tab == 0 && (
                            <>
                                <AllQueries setTab={setTab} />
                            </>
                        )}
                    </TabPanel>
                    <TabPanel>
                        {tab == 1 && (
                            <>
                                <Query />
                            </>
                        )}
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </>
    )
}
