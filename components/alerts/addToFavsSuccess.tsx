import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { Dispatch, SetStateAction } from 'react'

export default function Alert(
    { msg, setFavErrorMsg }: { msg: string, setFavErrorMsg: Dispatch<SetStateAction<string | undefined>> }
) {
    return (
        <div className="border-l-4 border-green-400 bg-green-50 p-2 ">
            <div className="flex">
                <div className="flex-shrink-0 self-center">
                    <ExclamationTriangleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3 self-center">
                    <p className="text-sm text-green-700">
                        {msg}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setFavErrorMsg('')}
                    className="inline-flex ml-auto rounded-md bg-green-50 p-1.5 text-green-400 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                >
                    <span className="sr-only">Dismiss</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
            </div>
        </div>
    )
}
