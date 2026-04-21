import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  AlertCircle,
  CheckCircle,
  Info,
  TriangleAlert,
  Download,
  Play,
  Settings,
  Star,
  Trash2,
} from 'lucide-react';

import {
  Button,
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction,
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
  Input,
  Label,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel,
  Textarea,
  Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Alert, AlertTitle, AlertDescription,
  Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
  Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis,
  Calendar,
  Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField,
} from '@sgx/ui';

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-4 pb-2 border-b border-border">
      <h2 className="text-lg font-semibold text-[var(--sgx-blue)]">{title}</h2>
    </div>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return <div className="mb-10">{children}</div>;
}

const tableData = [
  { id: 1, index: 'SGX Blue Chip', weight: '40%', price: '3,280.50', change: '+1.2%' },
  { id: 2, index: 'SGX Tech 100', weight: '25%', price: '1,540.75', change: '-0.5%' },
  { id: 3, index: 'SGX Green Fund', weight: '20%', price: '980.20', change: '+2.8%' },
  { id: 4, index: 'SGX Dividend', weight: '15%', price: '2,100.00', change: '+0.3%' },
];

type FormValues = { username: string; email: string; notes: string };

export default function PackagesUiPage() {
  const [date, setDate] = useState<Date | undefined>();
  const [page, setPage] = useState(3);
  const [isRunning, setIsRunning] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: { username: '', email: '', notes: '' },
  });

  return (
    <TooltipProvider>
      <div className="max-w-5xl mx-auto py-8 px-4 space-y-2">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">UI Component Library</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            All available components from <code className="bg-muted px-1 rounded">@sgx/ui</code>
          </p>
        </div>

        {/* ── BUTTON ── */}
        <Section>
          <SectionHeader title="Button" />
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium">Variants</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="success">Success</Button>
                <Button variant="warning">Warning</Button>
                <Button variant="lightblue">Light Blue</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="white">White</Button>
                <Button variant="neutral">Neutral</Button>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium">Sizes</p>
              <div className="flex items-center gap-2">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium">With icons & loading</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary" startContent={<Play size={16} />}>Run</Button>
                <Button variant="success" endContent={<Download size={16} />}>Export</Button>
                <Button variant="primary" isLoading spinnerPlacement="start" onClick={() => setIsRunning(!isRunning)}>
                  Loading
                </Button>
                <Button variant="danger" disabled>Disabled</Button>
                <Button variant="primary" fullWidth startContent={<Star size={16} />}>Full Width</Button>
              </div>
            </div>
          </div>
        </Section>

        {/* ── CARD ── */}
        <Section>
          <SectionHeader title="Card" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card variant="default">
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>Standard border card</CardDescription>
                <CardAction><Button variant="ghost" size="sm"><Settings size={16} /></Button></CardAction>
              </CardHeader>
              <CardContent>Content goes here with padding applied.</CardContent>
              <CardFooter><Button variant="primary" size="sm">Action</Button></CardFooter>
            </Card>
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
                <CardDescription>Shadow, no border</CardDescription>
              </CardHeader>
              <CardContent>Elevated with shadow styling.</CardContent>
            </Card>
            <Card variant="outlined">
              <CardHeader>
                <CardTitle>Outlined Card</CardTitle>
                <CardDescription>SGX blue border</CardDescription>
              </CardHeader>
              <CardContent>Prominent outlined style.</CardContent>
            </Card>
            <Card variant="ghost">
              <CardHeader>
                <CardTitle>Ghost Card</CardTitle>
                <CardDescription>No background, no border</CardDescription>
              </CardHeader>
              <CardContent>Minimal transparent style.</CardContent>
            </Card>
          </div>
        </Section>

        {/* ── ACCORDION ── */}
        <Section>
          <SectionHeader title="Accordion" />
          <div className="space-y-6">
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium">Default</p>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="a1" variant="default">
                  <AccordionTrigger variant="default">What is SGX?</AccordionTrigger>
                  <AccordionContent>SGX is the Singapore Exchange — a leading multi-asset exchange.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="a2" variant="default">
                  <AccordionTrigger variant="default">How does backtesting work?</AccordionTrigger>
                  <AccordionContent>Backtesting evaluates a strategy using historical market data.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium">Bordered</p>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="b1" variant="bordered">
                  <AccordionTrigger variant="bordered">Index Composition</AccordionTrigger>
                  <AccordionContent>The index is composed of the top 50 blue-chip stocks.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="b2" variant="bordered">
                  <AccordionTrigger variant="bordered">Rebalancing Frequency</AccordionTrigger>
                  <AccordionContent>Rebalancing occurs quarterly based on market capitalisation.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </Section>

        {/* ── INPUT ── */}
        <Section>
          <SectionHeader title="Input" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label>Default</Label>
              <Input variant="default" placeholder="Search indices..." />
            </div>
            <div className="space-y-1">
              <Label>Outlined</Label>
              <Input variant="outlined" placeholder="SGX blue outline..." />
            </div>
            <div className="space-y-1">
              <Label>Ghost</Label>
              <Input variant="ghost" placeholder="Ghost input..." />
            </div>
            <div className="space-y-1">
              <Label>Small</Label>
              <Input size="sm" placeholder="Small size" />
            </div>
            <div className="space-y-1">
              <Label>Medium (default)</Label>
              <Input size="md" placeholder="Medium size" />
            </div>
            <div className="space-y-1">
              <Label>Large</Label>
              <Input size="lg" placeholder="Large size" />
            </div>
            <div className="space-y-1">
              <Label>Disabled</Label>
              <Input disabled placeholder="Disabled input" />
            </div>
          </div>
        </Section>

        {/* ── LABEL ── */}
        <Section>
          <SectionHeader title="Label" />
          <div className="flex flex-wrap gap-4">
            <Label variant="default">Default Label</Label>
            <Label variant="muted">Muted Label</Label>
            <Label variant="primary">Primary (SGX Blue)</Label>
            <Label variant="destructive">Destructive Label</Label>
            <Label size="sm">Small Label</Label>
            <Label size="md">Medium Label</Label>
            <Label size="lg">Large Label</Label>
          </div>
        </Section>

        {/* ── SELECT ── */}
        <Section>
          <SectionHeader title="Select" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label>Default</Label>
              <Select>
                <SelectTrigger variant="default">
                  <SelectValue placeholder="Select index..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>SGX Indices</SelectLabel>
                    <SelectItem value="blue-chip">SGX Blue Chip</SelectItem>
                    <SelectItem value="tech">SGX Tech 100</SelectItem>
                    <SelectItem value="green">SGX Green Fund</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Outlined</Label>
              <Select>
                <SelectTrigger variant="outlined">
                  <SelectValue placeholder="Outlined style..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 Month</SelectItem>
                  <SelectItem value="3m">3 Months</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Small</Label>
              <Select>
                <SelectTrigger size="sm">
                  <SelectValue placeholder="Small trigger..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Section>

        {/* ── TEXTAREA ── */}
        <Section>
          <SectionHeader title="Textarea" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Default</Label>
              <Textarea variant="default" placeholder="Enter strategy notes..." />
            </div>
            <div className="space-y-1">
              <Label>Outlined</Label>
              <Textarea variant="outlined" placeholder="SGX blue outline..." />
            </div>
            <div className="space-y-1">
              <Label>Resizable</Label>
              <Textarea variant="resizable" placeholder="Drag to resize..." />
            </div>
            <div className="space-y-1">
              <Label>Ghost</Label>
              <Textarea variant="ghost" placeholder="Ghost style..." />
            </div>
          </div>
        </Section>

        {/* ── TABLE ── */}
        <Section>
          <SectionHeader title="Table" />
          <div className="space-y-6">
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium">Default</p>
              <Table size="md">
                <TableHeader>
                  <TableRow>
                    <TableHead variant="primary">Index Name</TableHead>
                    <TableHead variant="primary">Weight</TableHead>
                    <TableHead variant="primary">Price</TableHead>
                    <TableHead variant="primary">Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row) => (
                    <TableRow key={row.id} variant="default">
                      <TableCell>{row.index}</TableCell>
                      <TableCell>{row.weight}</TableCell>
                      <TableCell>{row.price}</TableCell>
                      <TableCell className={row.change.startsWith('+') ? 'text-[var(--sgx-green)]' : 'text-destructive'}>
                        {row.change}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell>100%</TableCell>
                  </TableRow>
                </TableFooter>
                <TableCaption>SGX Index Portfolio — Q1 2026</TableCaption>
              </Table>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium">Striped rows</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Index</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row) => (
                    <TableRow key={row.id} variant="striped">
                      <TableCell>{row.index}</TableCell>
                      <TableCell>{row.price}</TableCell>
                      <TableCell>{row.change}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Section>

        {/* ── TABS ── */}
        <Section>
          <SectionHeader title="Tabs" />
          <div className="space-y-6">
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium">Default (pill-card)</p>
              <Tabs defaultValue="overview">
                <TabsList variant="default">
                  <TabsTrigger variant="default" value="overview">Overview</TabsTrigger>
                  <TabsTrigger variant="default" value="performance">Performance</TabsTrigger>
                  <TabsTrigger variant="default" value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="overview"><p className="pt-3 text-sm text-muted-foreground">Overview content panel.</p></TabsContent>
                <TabsContent value="performance"><p className="pt-3 text-sm text-muted-foreground">Performance metrics panel.</p></TabsContent>
                <TabsContent value="settings"><p className="pt-3 text-sm text-muted-foreground">Settings configuration panel.</p></TabsContent>
              </Tabs>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium">Underline</p>
              <Tabs defaultValue="tab1">
                <TabsList variant="underline">
                  <TabsTrigger variant="underline" value="tab1">Backtest</TabsTrigger>
                  <TabsTrigger variant="underline" value="tab2">Parameters</TabsTrigger>
                  <TabsTrigger variant="underline" value="tab3">Results</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1"><p className="pt-3 text-sm text-muted-foreground">Backtest configuration.</p></TabsContent>
                <TabsContent value="tab2"><p className="pt-3 text-sm text-muted-foreground">Parameter tuning.</p></TabsContent>
                <TabsContent value="tab3"><p className="pt-3 text-sm text-muted-foreground">Results analysis.</p></TabsContent>
              </Tabs>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium">Pills</p>
              <Tabs defaultValue="p1">
                <TabsList variant="pills">
                  <TabsTrigger variant="pills" value="p1">Daily</TabsTrigger>
                  <TabsTrigger variant="pills" value="p2">Weekly</TabsTrigger>
                  <TabsTrigger variant="pills" value="p3">Monthly</TabsTrigger>
                </TabsList>
                <TabsContent value="p1"><p className="pt-3 text-sm text-muted-foreground">Daily view data.</p></TabsContent>
                <TabsContent value="p2"><p className="pt-3 text-sm text-muted-foreground">Weekly aggregated view.</p></TabsContent>
                <TabsContent value="p3"><p className="pt-3 text-sm text-muted-foreground">Monthly summary view.</p></TabsContent>
              </Tabs>
            </div>
          </div>
        </Section>

        {/* ── ALERT ── */}
        <Section>
          <SectionHeader title="Alert" />
          <div className="space-y-3">
            <Alert variant="default">
              <Info className="size-4" />
              <AlertTitle>Default Alert</AlertTitle>
              <AlertDescription>This is a standard informational alert.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Backtest failed due to insufficient data range.</AlertDescription>
            </Alert>
            <Alert variant="success">
              <CheckCircle className="size-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Strategy saved and queued for execution.</AlertDescription>
            </Alert>
            <Alert variant="warning">
              <TriangleAlert className="size-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>Data for selected period is incomplete.</AlertDescription>
            </Alert>
            <Alert variant="info">
              <Info className="size-4" />
              <AlertTitle>Info</AlertTitle>
              <AlertDescription>Index rebalancing scheduled for next Monday.</AlertDescription>
            </Alert>
          </div>
        </Section>

        {/* ── TOOLTIP ── */}
        <Section>
          <SectionHeader title="Tooltip" />
          <div className="flex flex-wrap gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="primary">Default Tooltip</Button>
              </TooltipTrigger>
              <TooltipContent variant="default">Default style tooltip</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost">Dark Tooltip</Button>
              </TooltipTrigger>
              <TooltipContent variant="dark">SGX blue dark tooltip</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Light Tooltip</Button>
              </TooltipTrigger>
              <TooltipContent variant="light">Light themed tooltip</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="danger">Error Tooltip</Button>
              </TooltipTrigger>
              <TooltipContent variant="destructive">Destructive tooltip</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="sm">Small Tooltip</Button>
              </TooltipTrigger>
              <TooltipContent size="sm">Compact tooltip</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="success" size="lg">Large Tooltip</Button>
              </TooltipTrigger>
              <TooltipContent size="lg">Larger tooltip text</TooltipContent>
            </Tooltip>
          </div>
        </Section>

        {/* ── PAGINATION ── */}
        <Section>
          <SectionHeader title="Pagination" />
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }} />
              </PaginationItem>
              {[1, 2, 3, 4, 5].map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    isActive={page === p}
                    onClick={(e) => { e.preventDefault(); setPage(p); }}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(10, p + 1)); }} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <p className="text-center text-xs text-muted-foreground mt-2">Current page: {page}</p>
        </Section>

        {/* ── CALENDAR ── */}
        <Section>
          <SectionHeader title="Calendar" />
          <div className="flex flex-wrap gap-8">
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium">Default</p>
              <Card variant="default" className="w-fit">
                <CardContent className="p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    size="md"
                  />
                </CardContent>
              </Card>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium">Primary (SGX Blue)</p>
              <Card variant="outlined" className="w-fit">
                <CardContent className="p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    variant="primary"
                    size="md"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
          {date && (
            <p className="text-sm text-muted-foreground mt-3">
              Selected: <span className="font-medium text-foreground">{date.toDateString()}</span>
            </p>
          )}
        </Section>

        {/* ── FORM ── */}
        <Section>
          <SectionHeader title="Form (react-hook-form)" />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})} className="space-y-4 max-w-md">
              <FormField
                control={form.control}
                name="username"
                rules={{ required: 'Username is required' }}
                render={({ field }) => (
                  <FormItem gap="md">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter username" {...field} />
                    </FormControl>
                    <FormDescription>Your display name within SGX.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/, message: 'Invalid email address' },
                }}
                render={({ field }) => (
                  <FormItem gap="md">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@sgx.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem gap="md">
                    <FormLabel>Strategy Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your strategy..." {...field} />
                    </FormControl>
                    <FormDescription>Optional notes for this backtest strategy.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 pt-2">
                <Button type="submit" variant="primary">Submit</Button>
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        </Section>
      </div>
    </TooltipProvider>
  );
}
