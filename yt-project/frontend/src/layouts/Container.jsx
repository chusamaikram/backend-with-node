import { cn } from "@/utils/cn";

/**
 * Container — universal horizontal padding + max-width wrapper.
 * Use this on every page section so content is always centered and
 * never bleeds edge-to-edge on wide screens.
 *
 * @param {"div"|"section"|"main"|"article"|"header"} as  - semantic element
 * @param {string} className  - extra Tailwind classes
 */
function Container({ as: Tag = "div", className, children, ...props }) {
  return (
    <Tag
      className={cn(
        "w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

export default Container;
