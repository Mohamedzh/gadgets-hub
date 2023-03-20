import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'

export default function Alert({ setShow }: { setShow: React.Dispatch<React.SetStateAction<boolean>> }) {
    return (
        <div className="rounded-md bg-green-50 p-4 m-5">
            <div className="flex">
                <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">Phone added to comparison</p>
                    <p className='text-sm font-medium text-green-800 underline'>Go to <Link href='/compare'><a>comparison page</a></Link></p>
                </div>
                <div className="ml-auto pl-3">
                    <div className="-mx-1.5 -my-1.5">
                        <button
                            type="button"
                            onClick={() => setShow(false)}
                            className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                        >
                            <span className="sr-only">Dismiss</span>
                            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
