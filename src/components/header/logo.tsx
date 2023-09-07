"use client";

import { fontNunito, fontRubik, fontSans  } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Link from "next/link";


export default function Logo() {

  return (
    <Link href="/">
      <div className="flex flex-col items-center">
        <p className={cn("text-4xl tracking-tighter text-osom-color", fontNunito.className)}>OSOM.</p>
      </div>
    </Link>
  )
}
