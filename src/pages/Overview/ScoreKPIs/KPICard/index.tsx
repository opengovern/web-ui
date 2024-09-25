import {
    Flex,
    Text,
    Title,
    ProgressCircle,
    Button,
    Grid,
    Subtitle,
} from '@tremor/react'
import { useSetAtom } from 'jotai'
import { useEffect } from 'react'
interface Props {
    name: string
    number?: number
    percentage: number;

}

export default function KPICard({name,number,percentage} : Props) {
  
   

    return (
        <>
            <div key={name} className="flex items-center justify-between px-4">
                <div>
                    <p className="text-xl text-gray-900 dark:text-gray-50">
                        {name}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-50">
                        {number}
                        <span className="text-xs font-normal text-gray-700 dark:text-gray-300">
                            {' Issues '}
                        </span>
                        <span className="text-xs font-normal text-gray-700 dark:text-gray-300">
                            ({Math.floor(percentage)} &#37;)
                        </span>
                    </p>
                </div>
                <ProgressCircle
                    value={percentage}
                    radius={20}
                    strokeWidth={4.5}
                    // variant="neutral"
                    color={'gray'}
                />
            </div>
        </>
    )
}
