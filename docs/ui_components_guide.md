# UI Components Guide

This guide provides information about working with UI components in the Gitlify project, with a focus on Shadcn UI integration.

## Shadcn UI

Gitlify uses [Shadcn UI](https://ui.shadcn.com/) for its component library. Shadcn UI provides a collection of reusable, accessible components that are styled using Tailwind CSS.

### Installing Shadcn UI Components

To add a new Shadcn UI component to the project:

```bash
npx shadcn@latest add <component>
```

For example, to add the Dialog component:

```bash
npx shadcn@latest add dialog
```

This command will:

- Add the component to the `components/ui/` directory
- Install any necessary dependencies
- Configure the component to work with our project's styling

### Available Components

Some commonly used Shadcn UI components in Gitlify:

- `button`: Primary, secondary, and outline buttons
- `dialog`: Modal dialogs for interactions
- `card`: Content containers
- `form`: Form components with validation
- `alert`: Contextual feedback messages
- `toast`: Notification system
- `tabs`: Tabbed interface components

For a full list of available components, refer to the [Shadcn UI documentation](https://ui.shadcn.com/docs/components).

### Usage Guidelines

When using Shadcn UI components:

1. **Import from the UI directory**:

   ```tsx
   import { Button } from '@/app/components/ui/button';
   ```

2. **Use provided variants and sizes**:

   ```tsx
   <Button variant="outline" size="sm">
     Click Me
   </Button>
   ```

3. **Customize with Tailwind classes** when needed:

   ```tsx
   <Button className="mt-4 w-full">Submit</Button>
   ```

4. **Composition**: Compose complex UI by combining multiple components:
   ```tsx
   <Card>
     <CardHeader>
       <CardTitle>Title</CardTitle>
     </CardHeader>
     <CardContent>Content here</CardContent>
     <CardFooter>
       <Button>Action</Button>
     </CardFooter>
   </Card>
   ```

## Accessibility

Always ensure components are accessible:

- Use proper ARIA attributes when building custom components
- Maintain appropriate color contrast
- Ensure keyboard navigation works correctly
- Test with screen readers

## Icons

Use Lucide icons through the Shadcn UI integration:

```tsx
import { Github, Star, Settings } from 'lucide-react';

// Usage
<Button>
  <Github className="mr-2 h-4 w-4" />
  GitHub
</Button>;
```

## Theme Customization

Gitlify supports both light and dark modes via TailwindCSS. The theme is configured in `app/theme`.

When creating new components, ensure they work properly in both light and dark modes by using Tailwind's dark mode classes:

```tsx
<div className="bg-white dark:bg-gray-900">
  <p className="text-gray-800 dark:text-gray-200">Content</p>
</div>
```

## Form Elements

For form elements, use the Shadcn UI form components:

```tsx
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';

// Usage
<div className="space-y-2">
  <Label htmlFor="name">Name</Label>
  <Input id="name" placeholder="Enter your name" />
</div>;
```

## Custom Component Creation

When creating custom components:

1. Follow the existing pattern in the codebase
2. Place shared components in the appropriate directory under `app/components/`
3. Use TypeScript for type safety
4. Document props with JSDoc comments
5. Consider accessibility from the start
