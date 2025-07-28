"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme()

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-white group-[.toaster]:text-black group-[.toaster]:border-neutral-300 group-[.toaster]:shadow-lg",
                    description: "group-[.toast]:text-black",
                    actionButton:
                        "group-[.toast]:bg-primary group-[.toast]:text-black",
                    cancelButton:
                        "group-[.toast]:bg-muted group-[.toast]:text-black",
                },
            }}
            {...props}
        />
    )
}

export { Toaster }

