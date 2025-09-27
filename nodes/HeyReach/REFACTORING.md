# HeyReach Node Refactoring Structure

## Overview

The HeyReach node has been refactored from a single 1800+ line file into a modular structure for better maintainability and organization.

## New Directory Structure

```
nodes/HeyReach/
├── HeyReach.node.ts           # Main node file (simplified)
├── GenericFunctions.ts        # Shared API request helpers
├── resources/                 # Resource modules
│   ├── campaign/
│   │   ├── index.ts          # Resource exports
│   │   ├── campaign.description.ts  # UI field definitions
│   │   └── campaign.methods.ts      # Operation implementations
│   ├── lead/
│   │   ├── index.ts
│   │   ├── lead.description.ts
│   │   └── lead.methods.ts
│   ├── list/
│   │   ├── index.ts
│   │   ├── list.description.ts
│   │   └── list.methods.ts
│   ├── inbox/
│   │   ├── index.ts
│   │   ├── inbox.description.ts
│   │   └── inbox.methods.ts
│   ├── linkedinAccount/
│   │   ├── index.ts
│   │   ├── linkedinAccount.description.ts
│   │   └── linkedinAccount.methods.ts
│   ├── myNetwork/
│   │   ├── index.ts
│   │   ├── myNetwork.description.ts
│   │   └── myNetwork.methods.ts
│   └── stats/
│       ├── index.ts
│       ├── stats.description.ts
│       └── stats.methods.ts
```

## Benefits of This Structure

1. **Separation of Concerns**: Each resource (Campaign, Lead, List, etc.) has its own module
2. **Maintainability**: Easy to find and modify specific functionality
3. **Scalability**: New resources can be added without modifying existing code
4. **Readability**: Smaller files are easier to understand and review
5. **Testing**: Individual modules can be tested in isolation

## Resource Module Pattern

Each resource module follows the same pattern:

### 1. Description File (`*.description.ts`)
Contains UI field definitions and operation options:
- Operations available for the resource
- Input fields for each operation
- Display conditions and validations

### 2. Methods File (`*.methods.ts`)
Contains the implementation logic:
- API call implementations
- Data transformations
- Error handling

### 3. Index File (`index.ts`)
Exports the module's public interface:
- Field descriptions for the UI
- Execute method for operations

## Example Resource Module

Here's how a resource module is structured:

```typescript
// resources/campaign/campaign.description.ts
export const campaignOperations = [/* operation definitions */];
export const campaignFields = [/* field definitions */];

// resources/campaign/campaign.methods.ts
export async function execute(this: IExecuteFunctions, operation: string, i: number) {
  switch(operation) {
    case 'getAll': return await getAll.call(this, i);
    case 'get': return await get.call(this, i);
    // ... other operations
  }
}

// resources/campaign/index.ts
export { campaignOperations, campaignFields } from './campaign.description';
export { execute } from './campaign.methods';
```

## Main Node File

The main `HeyReach.node.ts` file is now much simpler:

```typescript
import * as campaign from './resources/campaign';
import * as lead from './resources/lead';
// ... other imports

export class HeyReach implements INodeType {
  description: INodeTypeDescription = {
    // Basic node configuration
    properties: [
      resourceSelector,
      ...campaign.campaignOperations,
      ...campaign.campaignFields,
      ...lead.leadOperations,
      ...lead.leadFields,
      // ... other resources
    ]
  };

  async execute() {
    const resource = this.getNodeParameter('resource', 0);
    const operation = this.getNodeParameter('operation', 0);

    // Delegate to appropriate resource module
    switch(resource) {
      case 'campaign': return campaign.execute.call(this, operation, i);
      case 'lead': return lead.execute.call(this, operation, i);
      // ... other resources
    }
  }
}
```

## Migration Steps

To implement this structure:

1. Create the `resources` directory structure
2. Move operation definitions to `*.description.ts` files
3. Move implementation logic to `*.methods.ts` files
4. Create index files to export the public interface
5. Update the main node file to use the modules
6. Test each resource independently

## Adding New Resources

To add a new resource (e.g., webhooks):

1. Create a new directory: `resources/webhook/`
2. Add description file: `webhook.description.ts`
3. Add methods file: `webhook.methods.ts`
4. Add index file: `index.ts`
5. Import in main node file
6. Add to resource selector and properties array

This modular structure makes the HeyReach node much more maintainable and easier to extend with new functionality.