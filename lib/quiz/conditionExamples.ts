// Example usage of the new conditional rendering system
// This file demonstrates how to use the new database-driven conditional logic

import type { RenderCondition } from '~/types/intake-form/form';

// Example 1: Simple condition - show step only if user is female
const femaleOnlyStep: RenderCondition = {
  conditions: [
    {
      field: 'gender',
      operator: 'equals',
      value: 'Female'
    }
  ],
  logicalOperator: 'AND'
};

// Example 2: Complex condition - show step if user is female AND has tried GLP-1 before
const complexCondition: RenderCondition = {
  conditions: [
    {
      field: 'gender',
      operator: 'equals',
      value: 'Female'
    },
    {
      field: 'triedGlp1Before',
      operator: 'equals',
      value: 'Yes'
    }
  ],
  logicalOperator: 'AND'
};

// Example 3: OR condition - show step if user is either male OR has BMI > 30
const orCondition: RenderCondition = {
  conditions: [
    {
      field: 'gender',
      operator: 'equals',
      value: 'Male'
    },
    {
      field: 'bmi',
      operator: 'greaterThan',
      value: 30
    }
  ],
  logicalOperator: 'OR'
};

// Example 4: Numeric condition - show step if age is less than 65
const ageCondition: RenderCondition = {
  conditions: [
    {
      field: 'age',
      operator: 'lessThan',
      value: 65
    }
  ],
  logicalOperator: 'AND'
};

// Example 5: Negation condition - show step if user has NOT tried Ozempic
const negationCondition: RenderCondition = {
  conditions: [
    {
      field: 'triedOzempic',
      operator: 'notEquals',
      value: 'Yes'
    }
  ],
  logicalOperator: 'AND'
};

export {
  femaleOnlyStep,
  complexCondition,
  orCondition,
  ageCondition,
  negationCondition
};