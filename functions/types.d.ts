// Cloudflare Pages Functions type declarations
type PagesFunction<Env = unknown> = (context: EventContext<Env, string, unknown>) => Response | Promise<Response>;

interface EventContext<Env, P extends string, Data> {
  request: Request;
  functionPath: string;
  waitUntil: (promise: Promise<any>) => void;
  passThroughOnException: () => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  env: Env & Record<string, string>;
  params: Record<P, string | string[]>;
  data: Data;
}
