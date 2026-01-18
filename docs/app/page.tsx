import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const components = [
    {
      name: "DatePicker",
      description: "A flexible date picker component with internationalization support and customizable holidays",
      href: "/components/date-picker",
      status: "stable",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              udit-ui
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              A collection of custom shadcn/ui components for React applications
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/components/date-picker">Get Started</Link>
              </Button>
              <Button variant="outline" asChild>
                <a
                  href="https://github.com/joonheeu/udit-ui"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-1">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Components</h2>
              <div className="grid gap-4">
                {components.map((component) => (
                  <Card key={component.name} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{component.name}</CardTitle>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {component.status}
                        </span>
                      </div>
                      <CardDescription>{component.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild variant="outline">
                        <Link href={component.href}>View Documentation</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 pt-16 border-t">
            <h2 className="text-2xl font-semibold mb-6">Installation</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">1. Add registry to components.json</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{`{
  "registries": {
    "@udit-ui": "https://raw.githubusercontent.com/joonheeu/udit-ui/main/registry/new-york/{name}.json"
  }
}`}</code>
                </pre>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">2. Install component</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>pnpm dlx shadcn@latest add @udit-ui/date-picker</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
