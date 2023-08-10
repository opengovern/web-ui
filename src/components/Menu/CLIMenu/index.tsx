import { Fragment, useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import {
    ChevronDownIcon,
    PhoneIcon,
    PlayCircleIcon,
} from '@heroicons/react/20/solid'
import {
    ArrowPathIcon,
    ChartPieIcon,
    CommandLineIcon,
    CursorArrowRaysIcon,
    DocumentDuplicateIcon,
    FingerPrintIcon,
    SquaresPlusIcon,
} from '@heroicons/react/24/outline'
import { Button, Card, Flex, Icon, Text } from '@tremor/react'
import clipboardCopy from 'clipboard-copy'
import { ReactComponent as AppleIcon } from '../../../icons/Apple.svg'
import { ReactComponent as LinuxIcon } from '../../../icons/Vector.svg'
import { ReactComponent as WindowsIcon } from '../../../icons/windows-174-svgrepo-com 1.svg'

const tabs = [
    {
        name: 'macOS',
        href: 'https://github.com/kaytu-io/cli/releases',
        icon: <AppleIcon className="w-6 h-6 m-1" />,
        commands: (
            <div>
                $ brew tap kaytu-io/cli-tap <br /> $ brew install kaytu
            </div>
        ),
        clipboard: 'brew tap kaytu-io/cli-tap && brew install kaytu',
    },
    {
        name: 'Linux',
        href: 'https://github.com/kaytu-io/cli/releases',
        icon: <LinuxIcon className="w-5 h-5 m-1" />,
        commands: '$ snap install kaytu',
        clipboard: 'snap install kaytu',
    },
    {
        name: 'Windows',
        href: 'https://github.com/kaytu-io/cli/releases',
        icon: <WindowsIcon className="w-6 h-6 m-1" />,
    },
]

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function CLIMenu() {
    const [currentTab, setCurrentTab] = useState<number>(0)
    const [showCopied, setShowCopied] = useState<boolean>(false)

    const getCurrentTab = () => {
        return tabs.at(currentTab)
    }

    return (
        <Popover className="relative isolate z-50 border-0">
            <Popover.Button
                className="-mx-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                id="CLI"
            >
                <span className="sr-only">CLI</span>
                <CommandLineIcon className="h-6 w-6" />
            </Popover.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
            >
                <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                    <div className="w-screen max-w-md flex-auto overflow-hidden rounded-lg bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                        <div>
                            <nav className="isolate flex divide-x divide-gray-200 rounded-lg shadow">
                                {tabs.map((tab, tabIdx) => (
                                    <Flex
                                        flexDirection="row"
                                        justifyContent="center"
                                        className={classNames(
                                            currentTab === tabIdx
                                                ? 'bg-blue-50 text-blue-800 fill-blue-600'
                                                : 'bg-gray-50 text-gray-600 fill-gray-600 hover:text-gray-700',
                                            tabIdx === 0 ? 'rounded-l-lg' : '',
                                            tabIdx === tabs.length - 1
                                                ? 'rounded-r-lg'
                                                : '',
                                            'group cursor-pointer relative min-w-0 flex-1 overflow-hidden py-4 px-4 text-center text-sm font-medium focus:z-10'
                                        )}
                                        onClick={() => setCurrentTab(tabIdx)}
                                    >
                                        {tab.icon}
                                        <span>{tab.name}</span>
                                        <span
                                            aria-hidden="true"
                                            className={classNames(
                                                'bg-transparent',
                                                'absolute inset-x-0 bottom-0 h-0.5'
                                            )}
                                        />
                                    </Flex>
                                ))}
                            </nav>
                        </div>
                        <Flex flexDirection="col" justifyContent="start">
                            <a
                                href={getCurrentTab()?.href}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Button className="my-8 bg-blue-600">
                                    Download for {getCurrentTab()?.name}
                                </Button>
                            </a>

                            {getCurrentTab()?.commands && (
                                <Card
                                    className="w-2/3 text-gray-800 font-mono cursor-pointer p-2.5"
                                    onClick={() => {
                                        setShowCopied(true)
                                        setTimeout(() => {
                                            setShowCopied(false)
                                        }, 2000)
                                        clipboardCopy(
                                            getCurrentTab()?.clipboard || ''
                                        )
                                    }}
                                >
                                    <Flex flexDirection="row">
                                        <Text className="px-1.5 text-gray-800">
                                            {getCurrentTab()?.commands}
                                        </Text>
                                        <Flex
                                            flexDirection="col"
                                            className="h-5 w-5"
                                        >
                                            <DocumentDuplicateIcon className="h-5 w-5 text-blue-600 cursor-pointer" />
                                            <Text
                                                className={`${
                                                    showCopied ? '' : 'hidden'
                                                } absolute -bottom-4 bg-blue-600 text-white rounded-md p-1`}
                                            >
                                                Copied!
                                            </Text>
                                        </Flex>
                                    </Flex>
                                </Card>
                            )}

                            <Text className="mt-3 mb-8 text-gray-400" />
                        </Flex>
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    )
}
