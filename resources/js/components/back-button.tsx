import { Link } from '@inertiajs/react';
import { X } from 'lucide-react';

export function BackButton({ href }: { href: string }) {
    return (
        <Link
            href={href}
            aria-label="Close"
            title="Close"
            className="group relative inline-flex size-9 items-center justify-center overflow-hidden border-2 border-black text-black duration-500 hover:border-green-500 focus-visible:ring-2 focus-visible:ring-ustp-navy focus-visible:ring-offset-2 focus-visible:outline-none dark:border-white dark:text-white"
        >
            <X className="relative z-10 size-4 transition-transform duration-500 group-hover:scale-0" />
            <span className="absolute top-9 left-0 size-full rotate-45 bg-green-500 duration-500 group-hover:top-[27px]" />
            <span className="absolute top-0 left-9 size-full rotate-45 bg-green-500 duration-500 group-hover:left-[27px]" />
            <span className="absolute top-0 right-9 size-full rotate-45 bg-green-500 duration-500 group-hover:right-[27px]" />
            <span className="absolute right-0 bottom-9 size-full rotate-45 bg-green-500 duration-500 group-hover:bottom-[27px]" />
        </Link>
    );
}
