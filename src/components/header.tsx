"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Moon, Sun, Globe, Coffee, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/i18n/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";

interface HeaderProps {
  onModeChange?: (mode: "classic" | "ai") => void;
}

export function Header({ onModeChange }: HeaderProps) {
  const { setTheme, theme } = useTheme();
  const t = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1];
  const [modelReady, setModelReady] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      try {
        // await your model loading logic here
        setModelReady(true);
      } catch (error) {
        console.error("Failed to load model:", error);
      }
    };

    loadModel();
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    router.push(`/${newLocale}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link
          href={`/${currentLocale}`}
          className="flex items-center gap-2 hover:opacity-80"
        >
          <Image
            src="/images/logo.svg"
            alt={t("header.logo")}
            width={32}
            height={32}
          />
          <span className="font-bold text-xl">{t("header.title")}</span>
        </Link>

        <div className="flex items-center gap-4">
          <Tabs
            defaultValue="classic"
            onValueChange={(value) => onModeChange?.(value as "classic" | "ai")}
          >
            <TabsList className="ml-4">
              <TabsTrigger value="classic">{t("tabs.classicMode")}</TabsTrigger>
              <TabsTrigger
                value="ai"
                disabled={!modelReady}
                className="relative"
              >
                {t("tabs.aiMode")}
                {!modelReady && (
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-9 h-9">
                <Globe className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
                {t("header.languages.english")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange("zh")}>
                {t("header.languages.chinese")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            <span className="sr-only">{t("header.themeToggle")}</span>
          </Button>

          <Button variant="ghost" size="icon" className="w-9 h-9" asChild>
            <Link
              href="https://buymeacoffee.com/dingdongnav"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Coffee className="h-[1.2rem] w-[1.2rem]" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
