"use client"

import { useEffect } from "react"

export function HydrationAttributeFix() {
  useEffect(() => {
    document.body.removeAttribute("cz-shortcut-listen")
  }, [])

  return null
}
