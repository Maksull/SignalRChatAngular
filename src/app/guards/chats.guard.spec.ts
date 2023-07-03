import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { chatsGuard } from './chats.guard';

describe('chatsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => chatsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
