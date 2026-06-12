import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  title: string;
  description: string;
  action?: { label: string; href: string };
};

export function EmptyState({ title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-[1.7rem] border border-[#F4EDE1]/10 bg-white/5 px-6 py-16 text-center light:border-[#1F4E5F]/10 light:bg-white/75">
      <span className="flex h-14 w-14 items-center justify-center rounded-[1.4rem] border border-[#2F6F73]/24 bg-[#2F6F73]/14 text-[#F4EDE1] light:text-[#2F6F73]">
        <Globe size={28} />
      </span>
      <div>
        <p className="font-medium text-[#F4EDE1] light:text-[#1F4E5F]">{title}</p>
        <p className="mt-1 text-sm leading-7 text-[#F4EDE1]/58 light:text-[#1F4E5F]/62">{description}</p>
      </div>
      {action && (
        <Link href={action.href}>
          <Button
            size="sm"
            className="rounded-2xl border border-[#2F6F73]/40 bg-[#2F6F73] text-[#F4EDE1] hover:bg-[#3B7D81]"
          >
            {action.label}
          </Button>
        </Link>
      )}
    </div>
  );
}
