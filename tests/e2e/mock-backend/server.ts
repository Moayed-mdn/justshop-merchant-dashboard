import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';

type OnboardingStep =
  | 'pending_verification'
  | 'create_store'
  | 'store_creation_in_progress'
  | 'store_created'
  | 'store_configured'
  | 'completed';

type StoreStatus =
  | 'pending_setup'
  | 'provisioning'
  | 'active'
  | 'disabled'
  | 'suspended'
  | 'archived'
  | 'deleted_pending';

type ProvisioningLifecycleStatus = 'pending' | 'running' | 'completed' | 'failed';
type ProvisioningMode = 'auto-complete' | 'manual' | 'failed' | 'timed_out' | 'stuck';

interface MockProvisioningState {
  mode: ProvisioningMode;
  status: ProvisioningLifecycleStatus;
  progress: number;
  currentStep: string | null;
  message: string | null;
  retryable: boolean;
  pollCount: number;
}

interface MockStore {
  id: number;
  name: string;
  slug: string;
  domain: string | null;
  currency: string;
  timezone: string;
  role: string;
  status: StoreStatus;
  isActive: boolean;
  createdAt: string;
  statusChangedAt: string | null;
  permissions: string[];
  provisioning: MockProvisioningState;
}

interface MockUser {
  id: number;
  name: string;
  email: string;
  password: string;
  emailVerifiedAt: string | null;
  onboardingStep: OnboardingStep;
  onboardingCompleted: boolean;
  onboardingStoreId: string | null;
  stores: MockStore[];
  activeStoreId: number | null;
  lastActiveStoreId: number | null;
  disabled: boolean;
}

interface MockSession {
  id: string;
  userId: number;
  expired: boolean;
  createdAt: string;
}

interface MockState {
  nextUserId: number;
  nextStoreId: number;
  users: Map<number, MockUser>;
  sessions: Map<string, MockSession>;
  nextCreatedStoreProvisioningMode: ProvisioningMode | null;
}

const PORT = Number(process.env.MOCK_BACKEND_PORT ?? 4100);
const SESSION_COOKIE_NAME = 'ecommerce_session';
const XSRF_COOKIE_NAME = 'XSRF-TOKEN';

let state = createInitialState();

function nowIso(): string {
  return new Date().toISOString();
}

function createProvisioningState(
  mode: ProvisioningMode,
  overrides: Partial<MockProvisioningState> = {}
): MockProvisioningState {
  const defaults: Record<ProvisioningMode, Omit<MockProvisioningState, 'mode' | 'pollCount'>> = {
    'auto-complete': {
      status: 'pending',
      progress: 0,
      currentStep: 'initializing_store',
      message: 'Preparing your store.',
      retryable: false,
    },
    manual: {
      status: 'pending',
      progress: 0,
      currentStep: 'initializing_store',
      message: 'Preparing your store.',
      retryable: false,
    },
    failed: {
      status: 'failed',
      progress: 40,
      currentStep: 'bootstrap_failed',
      message: 'Store provisioning failed. Retry provisioning to continue setup.',
      retryable: true,
    },
    timed_out: {
      status: 'failed',
      progress: 65,
      currentStep: 'bootstrap_timed_out',
      message: 'Store provisioning timed out. Retry provisioning to continue setup.',
      retryable: true,
    },
    stuck: {
      status: 'running',
      progress: 70,
      currentStep: 'creating_database',
      message: 'Provisioning is still running.',
      retryable: false,
    },
  };

  return {
    mode,
    pollCount: 0,
    ...defaults[mode],
    ...overrides,
  };
}

function createStoreRecord(input: {
  id: number;
  name: string;
  slug: string;
  status: StoreStatus;
  isActive: boolean;
  permissions: string[];
  role?: string;
  provisioning?: MockProvisioningState;
}): MockStore {
  return {
    id: input.id,
    name: input.name,
    slug: input.slug,
    domain: `${input.slug}.test`,
    currency: 'USD',
    timezone: 'UTC',
    role: input.role ?? 'store_admin',
    status: input.status,
    isActive: input.isActive,
    createdAt: nowIso(),
    statusChangedAt: input.status === 'active' ? null : nowIso(),
    permissions: input.permissions,
    provisioning:
      input.provisioning ??
      createProvisioningState(input.status === 'active' ? 'manual' : 'auto-complete', {
        status: input.status === 'active' ? 'completed' : 'pending',
        progress: input.status === 'active' ? 100 : 0,
        currentStep: input.status === 'active' ? 'completed' : 'initializing_store',
        message: input.status === 'active' ? 'Store is ready.' : 'Preparing your store.',
        retryable: false,
      }),
  };
}

function createInitialState(): MockState {
  const seededUsers = new Map<number, MockUser>();

  const merchantStores = [
    createStoreRecord({
      id: 101,
      name: 'Northwind Store',
      slug: 'northwind-store',
      status: 'active',
      isActive: true,
      permissions: ['dashboard.view', 'product.view', 'order.view'],
    }),
    createStoreRecord({
      id: 102,
      name: 'Northwind Plus',
      slug: 'northwind-plus',
      status: 'active',
      isActive: true,
      permissions: [
        'dashboard.view',
        'product.view',
        'order.view',
        'user.view',
        'category.view',
        'brand.view',
        'tag.view',
      ],
    }),
  ];

  seededUsers.set(1, {
    id: 1,
    name: 'Northwind Merchant',
    email: 'merchant@example.com',
    password: 'password123',
    emailVerifiedAt: nowIso(),
    onboardingStep: 'completed',
    onboardingCompleted: true,
    onboardingStoreId: null,
    stores: merchantStores,
    activeStoreId: 101,
    lastActiveStoreId: 101,
    disabled: false,
  });

  seededUsers.set(2, {
    id: 2,
    name: 'No Store Merchant',
    email: 'nostore@example.com',
    password: 'password123',
    emailVerifiedAt: nowIso(),
    onboardingStep: 'create_store',
    onboardingCompleted: false,
    onboardingStoreId: null,
    stores: [],
    activeStoreId: null,
    lastActiveStoreId: null,
    disabled: false,
  });

  seededUsers.set(3, {
    id: 3,
    name: 'Verify First Merchant',
    email: 'verify@example.com',
    password: 'password123',
    emailVerifiedAt: null,
    onboardingStep: 'pending_verification',
    onboardingCompleted: false,
    onboardingStoreId: null,
    stores: [],
    activeStoreId: null,
    lastActiveStoreId: null,
    disabled: false,
  });

  return {
    nextUserId: 10,
    nextStoreId: 201,
    users: seededUsers,
    sessions: new Map<string, MockSession>(),
    nextCreatedStoreProvisioningMode: null,
  };
}

function parseCookies(request: IncomingMessage): Record<string, string> {
  const header = request.headers.cookie;
  if (!header) {
    return {};
  }

  return Object.fromEntries(
    header.split(';').map((part) => {
      const index = part.indexOf('=');
      const key = part.slice(0, index).trim();
      const value = part.slice(index + 1).trim();
      return [key, decodeURIComponent(value)];
    })
  );
}

async function readJsonBody<T>(request: IncomingMessage): Promise<T | null> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return null;
  }

  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) {
    return null;
  }

  return JSON.parse(raw) as T;
}

function sendJson(
  response: ServerResponse,
  status: number,
  payload: unknown,
  headers: Record<string, string | string[]> = {}
): void {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json');
  Object.entries(headers).forEach(([key, value]) => {
    response.setHeader(key, value);
  });
  response.end(JSON.stringify(payload));
}

function sendNoContent(
  response: ServerResponse,
  headers: Record<string, string | string[]> = {}
): void {
  response.statusCode = 204;
  Object.entries(headers).forEach(([key, value]) => {
    response.setHeader(key, value);
  });
  response.end();
}

function setCookies(response: ServerResponse, values: string[]): void {
  if (values.length > 0) {
    response.setHeader('Set-Cookie', values);
  }
}

function createSession(userId: number): MockSession {
  const session: MockSession = {
    id: randomUUID(),
    userId,
    expired: false,
    createdAt: nowIso(),
  };
  state.sessions.set(session.id, session);
  return session;
}

function resolveSession(request: IncomingMessage): MockSession | null {
  const cookies = parseCookies(request);
  const sessionId = cookies[SESSION_COOKIE_NAME];
  if (!sessionId) {
    return null;
  }

  const session = state.sessions.get(sessionId);
  if (!session || session.expired) {
    return null;
  }

  return session;
}

function resolveUserFromRequest(request: IncomingMessage): MockUser | null {
  const session = resolveSession(request);
  if (!session) {
    return null;
  }

  return state.users.get(session.userId) ?? null;
}

function resolveActiveStore(user: MockUser): MockStore | null {
  const targetId = user.activeStoreId ?? user.lastActiveStoreId ?? user.stores[0]?.id ?? null;
  if (targetId === null) {
    return null;
  }

  return user.stores.find((store) => store.id === targetId) ?? null;
}

function toBootstrapStore(store: MockStore) {
  return {
    id: store.id,
    name: store.name,
    slug: store.slug,
    domain: store.domain,
    currency: store.currency,
    role: store.role,
    status: store.status,
    is_active: store.isActive,
    status_changed_at: store.statusChangedAt,
    created_at: store.createdAt,
    permissions: store.permissions,
  };
}

function buildSessionMeta(sessionId: string | null) {
  return {
    id: sessionId,
    ip_address: '127.0.0.1',
    user_agent: 'Playwright',
    last_active_at: nowIso(),
    is_current: true,
    auth_domain: 'merchant',
    actor_type: 'merchant',
    route_domain: 'merchant_users',
    onboarding_applicable: true,
    future_guard_hint: 'merchant_guard',
  };
}

function buildBootstrap(user: MockUser, sessionId: string | null) {
  const activeStore = resolveActiveStore(user);
  const stores = user.stores.map(toBootstrapStore);

  return {
    success: true,
    message: 'Bootstrap loaded successfully.',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: null,
        is_email_verified: Boolean(user.emailVerifiedAt),
        email_verified_at: user.emailVerifiedAt,
      },
      email_verified: Boolean(user.emailVerifiedAt),
      stores,
      active_store: activeStore ? toBootstrapStore(activeStore) : null,
      active_store_id: activeStore?.id ?? null,
      onboarding: {
        step: user.onboardingStep,
        completed_steps:
          user.onboardingStep === 'completed'
            ? [
                'pending_verification',
                'create_store',
                'store_creation_in_progress',
                'store_created',
                'store_configured',
              ]
            : [],
        can_resume: true,
        store_id: user.onboardingStoreId,
        is_completed: user.onboardingCompleted,
      },
      permissions: activeStore?.permissions ?? [],
      capabilities: [],
      session: buildSessionMeta(sessionId),
      features: {
        'platform.authority.enabled': true,
      },
      config: {
        supported_locales: ['en', 'ar'],
        default_currency: 'USD',
        timezone: 'UTC',
      },
      localization: {
        supported_locales: ['en', 'ar'],
        default_currency: 'USD',
        timezone: 'UTC',
      },
      actor_context: 'merchant',
    },
    meta: {
      session: buildSessionMeta(sessionId),
    },
  };
}

function buildAuthTransportUser(user: MockUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: null,
    avatar: null,
    email_verified_at: user.emailVerifiedAt,
    onboarding_step: user.onboardingStep,
    has_password: true,
    has_google_linked: false,
    created_at: nowIso(),
    updated_at: nowIso(),
  };
}

function findUserByEmail(email: string): MockUser | undefined {
  return Array.from(state.users.values()).find((user) => user.email === email.toLowerCase());
}

function findStoreById(storeId: number): { user: MockUser; store: MockStore } | null {
  for (const user of state.users.values()) {
    const store = user.stores.find((candidate) => candidate.id === storeId);
    if (store) {
      return { user, store };
    }
  }

  return null;
}

function updateProvisioningState(store: MockStore, owner: MockUser): MockProvisioningState {
  const provisioning = store.provisioning;
  provisioning.pollCount += 1;

  if (provisioning.mode === 'auto-complete') {
    if (provisioning.pollCount === 1) {
      provisioning.status = 'pending';
      provisioning.progress = 10;
      provisioning.currentStep = 'initializing_store';
      provisioning.message = 'Preparing your store.';
    } else if (provisioning.pollCount === 2) {
      provisioning.status = 'running';
      provisioning.progress = 55;
      provisioning.currentStep = 'creating_database';
      provisioning.message = 'Setting up your store database';
    } else {
      provisioning.status = 'completed';
      provisioning.progress = 100;
      provisioning.currentStep = 'completed';
      provisioning.message = 'Store provisioning completed.';
      store.status = 'active';
      store.isActive = true;
      store.statusChangedAt = null;
      owner.activeStoreId = store.id;
      owner.lastActiveStoreId = store.id;
      owner.onboardingStep = 'completed';
      owner.onboardingCompleted = true;
      owner.onboardingStoreId = String(store.id);
    }
  }

  if (provisioning.mode === 'failed') {
    provisioning.status = 'failed';
    provisioning.progress = 40;
    provisioning.currentStep = 'bootstrap_failed';
    provisioning.message = 'Store provisioning failed. Retry provisioning to continue setup.';
    provisioning.retryable = true;
  }

  if (provisioning.mode === 'timed_out') {
    provisioning.status = 'failed';
    provisioning.progress = 65;
    provisioning.currentStep = 'bootstrap_timed_out';
    provisioning.message = 'Store provisioning timed out. Retry provisioning to continue setup.';
    provisioning.retryable = true;
  }

  if (provisioning.mode === 'stuck') {
    provisioning.status = 'running';
    provisioning.progress = Math.max(provisioning.progress, 70);
    provisioning.currentStep = 'creating_database';
    provisioning.message = 'Provisioning is still running.';
    provisioning.retryable = false;
  }

  return provisioning;
}

function ensureAuthenticated(request: IncomingMessage, response: ServerResponse): MockUser | null {
  const user = resolveUserFromRequest(request);
  if (!user) {
    sendJson(response, 401, {
      success: false,
      code: 'AUTH_002',
      message: 'Unauthenticated.',
      errors: {},
    });
    return null;
  }

  return user;
}

async function handleControlRoute(request: IncomingMessage, response: ServerResponse): Promise<void> {
  if (request.method === 'GET') {
    sendJson(response, 200, { ok: true });
    return;
  }

  const body = (await readJsonBody<{
    action?: string;
    email?: string;
    storeId?: number;
    mode?: ProvisioningMode;
    status?: ProvisioningLifecycleStatus;
    progress?: number;
    currentStep?: string | null;
    message?: string | null;
    retryable?: boolean;
  }>(request)) ?? { action: undefined };

  switch (body.action) {
    case 'reset':
      state = createInitialState();
      sendJson(response, 200, { ok: true });
      return;

    case 'verify-user': {
      const email = body.email?.toLowerCase();
      const user = email ? findUserByEmail(email) : undefined;
      if (!user) {
        sendJson(response, 404, { ok: false, message: 'User not found' });
        return;
      }

      user.emailVerifiedAt = nowIso();
      if (user.stores.length === 0) {
        user.onboardingStep = 'create_store';
        user.onboardingCompleted = false;
      }
      sendJson(response, 200, { ok: true });
      return;
    }

    case 'set-next-created-store-provisioning':
      state.nextCreatedStoreProvisioningMode = body.mode ?? null;
      sendJson(response, 200, { ok: true });
      return;

    case 'expire-session': {
      const cookies = parseCookies(request);
      const sessionId = cookies[SESSION_COOKIE_NAME];
      if (sessionId) {
        const session = state.sessions.get(sessionId);
        if (session) {
          session.expired = true;
        }
      }
      sendJson(response, 200, { ok: true });
      return;
    }

    case 'set-store-provisioning': {
      if (typeof body.storeId !== 'number') {
        sendJson(response, 422, { ok: false, message: 'storeId is required' });
        return;
      }

      const match = findStoreById(body.storeId);
      if (!match) {
        sendJson(response, 404, { ok: false, message: 'Store not found' });
        return;
      }

      const { store } = match;
      if (body.mode) {
        store.provisioning = createProvisioningState(body.mode, {
          status: body.status,
          progress: body.progress,
          currentStep: body.currentStep ?? undefined,
          message: body.message ?? undefined,
          retryable: body.retryable,
        });
      } else {
        store.provisioning = {
          ...store.provisioning,
          ...(body.status ? { status: body.status } : {}),
          ...(typeof body.progress === 'number' ? { progress: body.progress } : {}),
          ...(body.currentStep !== undefined ? { currentStep: body.currentStep } : {}),
          ...(body.message !== undefined ? { message: body.message } : {}),
          ...(typeof body.retryable === 'boolean' ? { retryable: body.retryable } : {}),
        };
      }

      if (store.provisioning.status !== 'completed') {
        store.status = 'pending_setup';
        store.isActive = false;
        store.statusChangedAt = nowIso();
      }

      sendJson(response, 200, { ok: true });
      return;
    }

    default:
      sendJson(response, 400, { ok: false, message: 'Unknown control action' });
  }
}

async function handler(request: IncomingMessage, response: ServerResponse): Promise<void> {
  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? '127.0.0.1'}`);
  const pathname = url.pathname;
  const method = request.method ?? 'GET';

  if (pathname === '/__test/health') {
    sendJson(response, 200, { ok: true });
    return;
  }

  if (pathname === '/__test/command') {
    await handleControlRoute(request, response);
    return;
  }

  if (pathname === '/api/sanctum/csrf-cookie' || pathname === '/sanctum/csrf-cookie') {
    setCookies(response, [`${XSRF_COOKIE_NAME}=mock-xsrf-token; Path=/; SameSite=Lax`]);
    sendNoContent(response);
    return;
  }

  if (pathname === '/api/v1/users/auth/register' && method === 'POST') {
    const body = (await readJsonBody<{
      name?: string;
      email?: string;
      password?: string;
      password_confirmation?: string;
    }>(request)) ?? {};

    const email = body.email?.toLowerCase() ?? '';
    const errors: Record<string, string[]> = {};
    if (!body.name) {
      errors.name = ['The name field is required.'];
    }
    if (!email) {
      errors.email = ['The email field is required.'];
    }
    if (!body.password) {
      errors.password = ['The password field is required.'];
    }
    if (body.password !== body.password_confirmation) {
      errors.password_confirmation = ['The password confirmation does not match.'];
    }
    if (email && findUserByEmail(email)) {
      errors.email = ['The email has already been taken.'];
    }

    if (Object.keys(errors).length > 0) {
      sendJson(response, 422, {
        success: false,
        code: 'VAL_001',
        message: 'Validation failed.',
        errors,
      });
      return;
    }

    const user: MockUser = {
      id: state.nextUserId++,
      name: body.name ?? 'New Merchant',
      email,
      password: body.password ?? 'password123',
      emailVerifiedAt: null,
      onboardingStep: 'pending_verification',
      onboardingCompleted: false,
      onboardingStoreId: null,
      stores: [],
      activeStoreId: null,
      lastActiveStoreId: null,
      disabled: false,
    };
    state.users.set(user.id, user);

    const session = createSession(user.id);
    setCookies(response, [
      `${SESSION_COOKIE_NAME}=${session.id}; Path=/; HttpOnly; SameSite=Lax`,
      `${XSRF_COOKIE_NAME}=mock-xsrf-token; Path=/; SameSite=Lax`,
    ]);
    sendJson(response, 201, {
      success: true,
      message: 'Registration successful. Please verify your email.',
      data: buildAuthTransportUser(user),
      meta: {
        session: buildSessionMeta(session.id),
      },
    });
    return;
  }

  if (pathname === '/api/v1/users/auth/login' && method === 'POST') {
    const body = (await readJsonBody<{ email?: string; password?: string }>(request)) ?? {};
    const email = body.email?.toLowerCase() ?? '';
    const user = findUserByEmail(email);

    if (!user || user.password !== body.password) {
      sendJson(response, 401, {
        success: false,
        code: 'AUTH_001',
        message: 'Invalid credentials.',
        errors: {},
      });
      return;
    }

    if (user.disabled) {
      sendJson(response, 403, {
        success: false,
        code: 'AUTH_002',
        message: 'This account cannot access the dashboard right now.',
        errors: {},
      });
      return;
    }

    const session = createSession(user.id);
    setCookies(response, [
      `${SESSION_COOKIE_NAME}=${session.id}; Path=/; HttpOnly; SameSite=Lax`,
      `${XSRF_COOKIE_NAME}=mock-xsrf-token; Path=/; SameSite=Lax`,
    ]);
    sendJson(response, 200, {
      success: true,
      message: 'Login successful.',
      data: {
        user: buildAuthTransportUser(user),
      },
      meta: {
        session: buildSessionMeta(session.id),
      },
    });
    return;
  }

  if (pathname === '/api/v1/users/auth/logout' && method === 'POST') {
    const cookies = parseCookies(request);
    const sessionId = cookies[SESSION_COOKIE_NAME];
    if (sessionId) {
      const session = state.sessions.get(sessionId);
      if (session) {
        session.expired = true;
      }
    }

    setCookies(response, [
      `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`,
      `${XSRF_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`,
    ]);
    sendJson(response, 200, {
      success: true,
      message: 'Logged out successfully.',
      data: null,
      meta: {
        session: buildSessionMeta(sessionId ?? null),
      },
    });
    return;
  }

  if (pathname === '/api/v1/me' && method === 'GET') {
    const session = resolveSession(request);
    const user = session ? state.users.get(session.userId) ?? null : null;
    if (!session || !user) {
      sendJson(response, 401, {
        success: false,
        code: 'AUTH_002',
        message: 'Unauthenticated.',
        errors: {},
      });
      return;
    }

    sendJson(response, 200, buildBootstrap(user, session.id));
    return;
  }

  if (pathname === '/api/v1/store-slug/check' && method === 'GET') {
    const slug = url.searchParams.get('slug')?.toLowerCase() ?? '';
    const available = !Array.from(state.users.values()).some((user) =>
      user.stores.some((store) => store.slug === slug)
    );
    sendJson(response, 200, {
      success: true,
      message: 'Slug availability checked.',
      data: {
        available,
      },
    });
    return;
  }

  if (pathname === '/api/v1/stores' && method === 'POST') {
    const user = ensureAuthenticated(request, response);
    if (!user) {
      return;
    }

    if (!user.emailVerifiedAt) {
      sendJson(response, 403, {
        success: false,
        code: 'AUTH_002',
        message: 'Email verification is required.',
        errors: {},
      });
      return;
    }

    const body = (await readJsonBody<{ name?: string; slug?: string }>(request)) ?? {};
    const errors: Record<string, string[]> = {};

    if (!body.name) {
      errors.name = ['The name field is required.'];
    }

    if (!body.slug) {
      errors.slug = ['The slug field is required.'];
    }

    if (body.slug && Array.from(state.users.values()).some((candidate) => candidate.stores.some((store) => store.slug === body.slug))) {
      errors.slug = ['The slug has already been taken.'];
    }

    if (user.stores.some((store) => !store.isActive)) {
      errors.store = ['Store creation is already in progress.'];
    }

    if (Object.keys(errors).length > 0) {
      sendJson(response, 422, {
        success: false,
        code: 'VAL_001',
        message: 'Validation failed.',
        errors,
      });
      return;
    }

    const store = createStoreRecord({
      id: state.nextStoreId++,
      name: body.name ?? 'My First Store',
      slug: body.slug ?? `store-${state.nextStoreId}`,
      status: 'pending_setup',
      isActive: false,
      permissions: ['dashboard.view', 'product.view', 'order.view'],
      provisioning: createProvisioningState(state.nextCreatedStoreProvisioningMode ?? 'auto-complete'),
    });
    state.nextCreatedStoreProvisioningMode = null;

    user.stores.push(store);
    user.activeStoreId = store.id;
    user.lastActiveStoreId = store.id;
    user.onboardingStep = 'completed';
    user.onboardingCompleted = true;
    user.onboardingStoreId = String(store.id);

    sendJson(response, 201, {
      success: true,
      message: 'Store created successfully',
      data: {
        id: store.id,
        name: store.name,
        slug: store.slug,
        status: store.status,
        is_active: store.isActive,
        status_changed_at: store.statusChangedAt,
        created_at: store.createdAt,
        domain: null,
        currency: store.currency,
        timezone: store.timezone,
      },
    });
    return;
  }

  const provisioningMatch = pathname.match(/^\/api\/v1\/stores\/(\d+)\/provisioning-status$/);
  if (provisioningMatch && method === 'GET') {
    const user = ensureAuthenticated(request, response);
    if (!user) {
      return;
    }

    const storeId = Number(provisioningMatch[1]);
    const store = user.stores.find((candidate) => candidate.id === storeId);
    if (!store) {
      sendJson(response, 403, {
        success: false,
        code: 'STORE_ACCESS_DENIED',
        message: 'This action is unauthorized.',
        redirect: '/dashboard',
        errors: {},
      });
      return;
    }

    const provisioning = updateProvisioningState(store, user);
    sendJson(response, 200, {
      success: true,
      message: 'success',
      data: {
        status: provisioning.status,
        progress: provisioning.progress,
        current_step: provisioning.currentStep,
        message: provisioning.message,
        retryable: provisioning.retryable,
      },
    });
    return;
  }

  if (pathname === '/api/v1/users/auth/active-store' && method === 'PATCH') {
    const requestUser = ensureAuthenticated(request, response);
    if (!requestUser) {
      return;
    }

    const body = (await readJsonBody<{ store_id?: number }>(request)) ?? {};
    const storeId = body.store_id;
    if (typeof storeId !== 'number') {
      sendJson(response, 422, {
        success: false,
        code: 'VAL_001',
        message: 'Validation failed.',
        errors: {
          store_id: ['The store_id field is required.'],
        },
      });
      return;
    }

    const targetStore = requestUser.stores.find((store) => store.id === storeId);
    if (!targetStore || targetStore.status !== 'active' || !targetStore.isActive) {
      sendJson(response, 403, {
        success: false,
        code: 'STORE_ACCESS_DENIED',
        message: 'This action is unauthorized.',
        redirect: '/dashboard',
        errors: {},
      });
      return;
    }

    requestUser.activeStoreId = targetStore.id;
    requestUser.lastActiveStoreId = targetStore.id;
    const session = resolveSession(request);
    sendJson(response, 200, buildBootstrap(requestUser, session?.id ?? null));
    return;
  }

  const dashboardStatsMatch = pathname.match(/^\/api\/v1\/admin\/stores\/(\d+)\/dashboard\/stats$/);
  if (dashboardStatsMatch && method === 'GET') {
    const user = ensureAuthenticated(request, response);
    if (!user) {
      return;
    }

    const storeId = Number(dashboardStatsMatch[1]);
    const store = user.stores.find((candidate) => candidate.id === storeId);
    if (!store) {
      sendJson(response, 404, {
        success: false,
        code: 'STR_001',
        message: 'Store not found',
        errors: {},
      });
      return;
    }

    sendJson(response, 200, {
      success: true,
      message: 'success',
      data: {
        total_revenue: 12450.25,
        total_orders: 39,
        total_customers: 18,
        total_products: 12,
        revenue_change: 12.5,
        orders_change: 6.4,
        customers_change: 3.1,
        products_change: 1.2,
      },
    });
    return;
  }

  const recentOrdersMatch = pathname.match(/^\/api\/v1\/admin\/stores\/(\d+)\/dashboard\/recent-orders$/);
  if (recentOrdersMatch && method === 'GET') {
    const user = ensureAuthenticated(request, response);
    if (!user) {
      return;
    }

    const storeId = Number(recentOrdersMatch[1]);
    const store = user.stores.find((candidate) => candidate.id === storeId);
    if (!store) {
      sendJson(response, 404, {
        success: false,
        code: 'STR_001',
        message: 'Store not found',
        errors: {},
      });
      return;
    }

    sendJson(response, 200, {
      success: true,
      message: 'success',
      data: [],
    });
    return;
  }

  const topProductsMatch = pathname.match(/^\/api\/v1\/admin\/stores\/(\d+)\/dashboard\/top-products$/);
  if (topProductsMatch && method === 'GET') {
    const user = ensureAuthenticated(request, response);
    if (!user) {
      return;
    }

    const storeId = Number(topProductsMatch[1]);
    const store = user.stores.find((candidate) => candidate.id === storeId);
    if (!store) {
      sendJson(response, 404, {
        success: false,
        code: 'STR_001',
        message: 'Store not found',
        errors: {},
      });
      return;
    }

    sendJson(response, 200, {
      success: true,
      message: 'success',
      data: [],
    });
    return;
  }

  sendJson(response, 404, {
    success: false,
    code: 'NOT_FOUND',
    message: `Unhandled mock route: ${method} ${pathname}`,
    errors: {},
  });
}

createServer((request, response) => {
  void handler(request, response).catch((error: unknown) => {
    sendJson(response, 500, {
      success: false,
      code: 'MOCK_SERVER_ERROR',
      message: error instanceof Error ? error.message : 'Unknown mock server error',
      errors: {},
    });
  });
}).listen(PORT, '127.0.0.1', () => {
  process.stdout.write(`Mock backend listening on http://127.0.0.1:${PORT}\n`);
});
