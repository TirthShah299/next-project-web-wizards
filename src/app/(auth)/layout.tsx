import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Head from "next/head";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-20">
            {children}
        </div>
    );
}
