'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface BackButtonType {
    href: string;
    label: string;
}

export const BackButton = ({ href, label }: BackButtonType) => {
    return (
        <div className="flex flex-col items-center w-full gap-4">
            <Button variant={"link"} className="flex w-full gap-4 font-medium" asChild>
                <Link aria-label={label} href={href}>
                    {label}
                </Link>
            </Button>
        </div>
    );
};
