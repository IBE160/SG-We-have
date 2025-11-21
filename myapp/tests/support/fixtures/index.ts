import { test as base } from '@playwright/test';
import { UserFactory } from './factories/user-factory';

type TestFixtures = {
  userFactory: UserFactory;
};

export const test = base.extend<TestFixtures>({
  userFactory: async ({}, use) => {
    const factory = new UserFactory();
    await use(factory);
    await factory.cleanup(); // Auto-cleanup
  },
});

export { expect } from '@playwright/test';
