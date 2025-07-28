import { useTabBar } from "~/lib/hooks/useTabBar";
import { cn } from "~/utils/cn";

type TabBarProps<T> = {
    tabs: Array<{
        value: T;
        label: string;
    }>;
    onChange?: (value: T) => void;
};

export const TabBar = ({ tabs, onChange }: TabBarProps<string>) => {
    const { indicatorRef, setRef, setActive, activeValue } = useTabBar<
        HTMLLabelElement,
        HTMLDivElement
    >(tabs[0].value);

    return (
        <div
            className="rounded-lg p-1 overflow-clip relative mr-auto border border-neutral-300 bg-white"
        >
            <div className="flex flex-row first:ml-0 gap-x-1">
                {tabs.map((tab, index) => (
                    <label
                        key={tab.value}
                        ref={(tabRef) => setRef(tabs[index].value, tabRef!)}
                        onClick={() => {
                            setActive(tab.value);
                            onChange && onChange(tabs[index]?.value);
                        }}
                        className={cn(
                            "duration-300 px-3 py-1.5 rounded-lg relative  z-10 has-[:checked]:text-secondary text-nowrap",
                            activeValue === tab.value && " text-secondary"
                        )}


                        style={{
                            boxShadow: "box-shadow: 0 0 0 99999px rgba(0, 0, 0, .8)",
                        }}
                    >
                        {tab.label}
                    </label>
                ))}
            </div>
            <div
                ref={indicatorRef}
                className="absolute top-1/2 h-8 w-16 -translate-y-1/2 rounded-lg border bg-primary-700 border-neutral-300 duration-300 ease-in-out"
            />
        </div>
    );
};
