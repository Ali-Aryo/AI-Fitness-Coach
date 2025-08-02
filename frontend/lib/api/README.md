# API Best Practices Guide

## 🏗️ **Why This Structure?**

### **Benefits of API Services:**

1. **🧹 Clean Code** - Separate concerns (UI vs Data)
2. **♻️ Reusability** - Use same API calls across components
3. **🔧 Maintainability** - Update endpoints in one place
4. **🧪 Testability** - Easy to mock and test
5. **🛡️ Error Handling** - Centralized error management
6. **📊 Type Safety** - TypeScript interfaces for all API calls

## 📁 **File Structure**

```
lib/
├── api/
│   ├── client.ts          # Base API client (fetch wrapper)
│   ├── ai.ts              # AI/Coach API calls
│   ├── auth.ts            # Authentication API calls
│   └── workouts.ts        # Workout-related API calls
└── utils/
    └── constants.ts       # API URLs, error messages, etc.
```

## 🚀 **How to Use**

### **1. In Components (Before - Bad Practice):**
```typescript
// ❌ DON'T DO THIS - Direct fetch in component
const sendMessage = async () => {
  const response = await fetch('http://localhost:3001/api/ai/fitness-advice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: userMessage.text })
  });
  const data = await response.json();
};
```

### **2. In Components (After - Good Practice):**
```typescript
// ✅ DO THIS - Use API service
import { aiApi } from '../../lib/api/ai';

const sendMessage = async () => {
  try {
    const response = await aiApi.getFitnessAdvice({
      question: userMessage.text,
      context: 'User asking for advice'
    });
    // Handle response
  } catch (error) {
    // Handle error
  }
};
```

## 🔧 **Adding New API Endpoints**

### **Step 1: Add to constants.ts**
```typescript
export const API_ENDPOINTS = {
  AI: {
    // ... existing endpoints
    NEW_FEATURE: '/api/ai/new-feature',
  },
};
```

### **Step 2: Add types to ai.ts**
```typescript
export interface NewFeatureRequest {
  // Define request structure
}

export interface NewFeatureResponse {
  // Define response structure
}
```

### **Step 3: Add function to ai.ts**
```typescript
export const aiApi = {
  // ... existing functions
  
  async newFeature(request: NewFeatureRequest): Promise<ApiResponse<NewFeatureResponse>> {
    return apiClient.post<NewFeatureResponse>('/api/ai/new-feature', request);
  },
};
```

### **Step 4: Use in component**
```typescript
import { aiApi } from '../../lib/api/ai';

const handleNewFeature = async () => {
  try {
    const response = await aiApi.newFeature({
      // your data
    });
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

## 🛡️ **Error Handling**

### **Built-in Error Handling:**
- Network errors → "Network error - please check your connection"
- Server errors → "Server error - please try again later"
- Validation errors → "Please check your input and try again"

### **Custom Error Handling:**
```typescript
try {
  const response = await aiApi.getFitnessAdvice(request);
  // Success
} catch (error) {
  if (error.message.includes('Network')) {
    // Handle network error
  } else if (error.message.includes('401')) {
    // Handle unauthorized
  } else {
    // Handle other errors
  }
}
```

## 🔄 **Environment Configuration**

### **Development vs Production:**
```typescript
// In client.ts
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';
```

### **Environment Variables:**
```bash
# .env
EXPO_PUBLIC_API_URL=http://localhost:3001

# .env.production
EXPO_PUBLIC_API_URL=https://your-api.com
```

## 🧪 **Testing**

### **Mock API for Testing:**
```typescript
// In your test file
jest.mock('../../lib/api/ai', () => ({
  aiApi: {
    getFitnessAdvice: jest.fn().mockResolvedValue({
      success: true,
      data: { advice: 'Test advice' }
    })
  }
}));
```

## 📊 **Best Practices Summary**

### **✅ DO:**
- Use API services for all network calls
- Define TypeScript interfaces for requests/responses
- Handle errors gracefully
- Use environment variables for URLs
- Keep API logic separate from UI logic

### **❌ DON'T:**
- Make direct fetch calls in components
- Hardcode API URLs
- Ignore error handling
- Mix UI logic with API calls
- Repeat API call logic across components

## 🎯 **Next Steps**

1. **Update existing components** to use API services
2. **Add more API endpoints** as needed
3. **Create auth.ts** for authentication calls
4. **Create workouts.ts** for workout-related calls
5. **Add loading states** and error handling to all API calls

This structure will make your app more maintainable, testable, and scalable! 🚀 