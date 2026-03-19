import Link from "next/link";
import { ArrowRight, Brain, Sparkles, Mail, Phone } from "lucide-react";

import Logo from "@/components/lib/logo/page";
import { Button } from "@/components/button";

const footerLinks = [
    { href: "/workspace", label: "Workspace" },
    { href: "/feedback", label: "Progress" },
    { href: "/register", label: "Register" },
    // { href: "/#features", label: "Features" },
];

const footerHighlights = [
    { icon: Brain, label: "AI-led interviews" },
    { icon: Sparkles, label: "Smart progress insights" },
    { icon: Mail, label: "Support when you need it" },
];

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer id="contact" className="relative mt-20 overflow-hidden border-t border-white/20 bg-slate-950 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.2),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_24%),linear-gradient(180deg,_rgba(15,23,42,0.94),_rgba(2,6,23,1))]" />
            <div className="absolute left-10 top-8 h-32 w-32 rounded-full bg-sky-500/20 blur-3xl" />
            <div className="absolute bottom-0 right-10 h-40 w-40 rounded-full bg-blue-600/20 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="rounded-[2rem] border border-white/15 bg-white/8 p-8 shadow-[0_25px_80px_rgba(14,165,233,0.18)] backdrop-blur-xl sm:p-10">
                    <div className="grid gap-10 lg:grid-cols-[1.3fr_0.8fr_0.9fr]">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Logo />
                                <div>
                                    <p className="text-xl font-semibold tracking-tight text-white">Interview AI</p>
                                    <p className="text-sm text-slate-300">Sharper practice. Clearer growth.</p>
                                </div>
                            </div>

                            <p className="max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                                Practice interviews with a product that feels fast, visual, and intelligent. Train with AI,
                                review your progress, and keep improving with focused feedback.
                            </p>

                            <div className="flex flex-wrap gap-3">
                                {footerHighlights.map(({ icon: Icon, label }) => (
                                    <div
                                        key={label}
                                        className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm text-sky-100"
                                    >
                                        <Icon className="h-4 w-4 text-sky-300" />
                                        <span>{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">Explore</p>
                            <nav className="grid gap-3 text-sm sm:text-base">
                                {footerLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="group inline-flex w-fit items-center gap-2 text-slate-200 transition-all duration-200 hover:translate-x-1 hover:text-white"
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full bg-sky-400 transition-all duration-200 group-hover:shadow-[0_0_12px_rgba(56,189,248,0.9)]" />
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        <div className="space-y-5 rounded-[1.5rem] border border-white/10 bg-slate-900/60 p-6 shadow-inner shadow-sky-500/10">
                            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">Start Now</p>
                            <h3 className="text-2xl font-semibold tracking-tight text-white">Ready for your next interview round?</h3>
                            <p className="text-sm leading-7 text-slate-300">
                                Open your workspace, launch a practice session, and track how your answers improve over time.
                            </p>
                            <Button size="lg" className="w-full bg-sky-500 text-white hover:bg-sky-600" asChild>
                                <Link href="/workspace">
                                    Start Interview
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">

                        <p>© {year} Interview AI. Built for confident interview preparation.</p>

                        {/* Contact Info */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span>1-888-280-xxxx</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span>mitanshuagrawal5@gmail.com</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Link href="/register" className="transition-colors hover:text-white">
                                Create account
                            </Link>

                            <Link href="/feedback" className="transition-colors hover:text-white">
                                View progress
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </footer>
    );
}
