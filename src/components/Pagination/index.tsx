import {
    ArrowLongLeftIcon,
    ArrowLongRightIcon,
} from '@heroicons/react/20/solid'

type IpProps = {
    onClickNext?: any
    onClickPrevious?: any
    pageCount?: any
    currentPage?: any
    setCurrentPage?: any
}

export default function Pagination({
    onClickNext,
    onClickPrevious,
    pageCount,
    currentPage,
    setCurrentPage,
}: IpProps) {
    return (
        <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
            <div className="-mt-px flex w-0 flex-1">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,react/button-has-type */}
                <button
                    onClick={onClickPrevious}
                    className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                    <ArrowLongLeftIcon className="mr-3 h-5 w-5 text-gray-400" />
                    Previous
                </button>
            </div>
            <div className="hidden md:-mt-px md:flex">
                {/* /!* eslint-disable-next-line jsx-a11y/anchor-is-valid *!/ */}
                {/* <a */}
                {/*    href="#" */}
                {/*    className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                {/* > */}
                {/*    1 */}
                {/* </a> */}
                {/* /!* Current: "border-indigo-500 text-indigo-600", Default: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" *!/ */}
                {/* /!* eslint-disable-next-line jsx-a11y/anchor-is-valid *!/ */}
                {/* <a */}
                {/*    href="#" */}
                {/*    className="inline-flex items-center border-t-2 border-indigo-500 px-4 pt-4 text-sm font-medium text-indigo-600" */}
                {/*    aria-current="page" */}
                {/* > */}
                {/*    2 */}
                {/* </a> */}
                {/* /!* eslint-disable-next-line jsx-a11y/anchor-is-valid *!/ */}
                {/* <a */}
                {/*    href="#" */}
                {/*    className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                {/* > */}
                {/*    3 */}
                {/* </a> */}
                {/* <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500"> */}
                {/*    ... */}
                {/* </span> */}
                {/* /!* eslint-disable-next-line jsx-a11y/anchor-is-valid *!/ */}
                {/* <a */}
                {/*    href="#" */}
                {/*    className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                {/* > */}
                {/*    8 */}
                {/* </a> */}
                {/* /!* eslint-disable-next-line jsx-a11y/anchor-is-valid *!/ */}
                {/* <a */}
                {/*    href="#" */}
                {/*    className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                {/* > */}
                {/*    9 */}
                {/* </a> */}
                {/* /!* eslint-disable-next-line jsx-a11y/anchor-is-valid *!/ */}
                {/* <a */}
                {/*    href="#" */}
                {/*    className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                {/* > */}
                {/*    10 */}
                {/* </a> */}
                <div>
                    page {currentPage} of {pageCount}
                </div>
            </div>
            <div className="-mt-px flex w-0 flex-1 justify-end">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,react/button-has-type */}
                <button
                    onClick={onClickNext}
                    className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                    Next
                    <ArrowLongRightIcon className="ml-3 h-5 w-5 text-gray-400" />
                </button>
            </div>
        </nav>
    )
}
