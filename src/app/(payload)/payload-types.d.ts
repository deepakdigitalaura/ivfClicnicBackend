declare module '@payloadcms/next/layouts' {
  import type { ImportMap, SanitizedConfig, ServerFunctionClient, ServerFunctionHandler } from 'payload';
  import React from 'react';

  export const metadata: { description: string; title: string };

  export const RootLayout: (props: {
    children: React.ReactNode;
    config: Promise<SanitizedConfig>;
    htmlProps?: React.HtmlHTMLAttributes<HTMLHtmlElement>;
    importMap: ImportMap;
    serverFunction: ServerFunctionClient;
  }) => React.JSX.Element;

  export const handleServerFunctions: ServerFunctionHandler;
}

declare module 'react-day-picker' {
  import React from 'react';

  export interface DayPickerFormatters {
    formatMonthDropdown?: (date: Date) => string;
    [key: string]: ((date: Date) => string) | undefined;
  }

  export interface DayPickerProps {
    showOutsideDays?: boolean;
    captionLayout?: string;
    className?: string;
    classNames?: Record<string, string>;
    formatters?: DayPickerFormatters;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    components?: Record<string, React.ComponentType<any>>;
    [key: string]: unknown;
  }

  export interface DayModifiers {
    selected?: boolean;
    focused?: boolean;
    range_start?: boolean;
    range_end?: boolean;
    range_middle?: boolean;
    [key: string]: unknown;
  }

  export interface CalendarDay {
    date: Date;
    [key: string]: unknown;
  }

  export interface DayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    day: CalendarDay;
    modifiers: DayModifiers;
  }

  export function DayPicker(props: DayPickerProps): React.JSX.Element;
  export function DayButton(props: DayButtonProps): React.JSX.Element;
  export function getDefaultClassNames(): Record<string, string>;
}

declare module '@payloadcms/next/views' {
  export function generatePageMetadata(args: {
    config: unknown;
    params: Promise<{ segments: string[] }>;
    searchParams: Promise<{ [key: string]: string | string[] }>;
  }): Promise<import('next').Metadata>;

  export function NotFoundPage(args: {
    config: unknown;
    params: Promise<{ segments: string[] }>;
    searchParams: Promise<{ [key: string]: string | string[] }>;
    importMap: unknown;
  }): import('react').ReactElement;

  export function RootPage(args: {
    config: unknown;
    params: Promise<{ segments: string[] }>;
    searchParams: Promise<{ [key: string]: string | string[] }>;
    importMap: unknown;
  }): import('react').ReactElement;
}

declare module '@payloadcms/next/routes' {
  export const REST_GET: (config: unknown) => (req: unknown) => Promise<Response>;
  export const REST_POST: (config: unknown) => (req: unknown) => Promise<Response>;
  export const REST_PUT: (config: unknown) => (req: unknown) => Promise<Response>;
  export const REST_PATCH: (config: unknown) => (req: unknown) => Promise<Response>;
  export const REST_DELETE: (config: unknown) => (req: unknown) => Promise<Response>;
  export const REST_OPTIONS: (config: unknown) => (req: unknown) => Promise<Response>;
  export const GRAPHQL_POST: (config: unknown) => (req: unknown) => Promise<Response>;
  export const GRAPHQL_PLAYGROUND_GET: (config: unknown) => (req: unknown) => Promise<Response>;
}