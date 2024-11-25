'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BackButtonType {
    href: string,
    label: string
}

export const BackButton = ({href, label} : BackButtonType) => {
    return (
        <div>
            <Button variant="outline">
                <Link aria-label={label} href={href}>
                    {label}
                </Link>
            </Button>
        </div>
    );
}
